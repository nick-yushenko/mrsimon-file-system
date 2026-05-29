import type {
  NodeType,
  BreadcrumbDto,
  GetNodesRequest,
  GetNodesResponse,
  CreateNodeRequest,
  CreateNodeResponse,
  CompleteUploadResponse,
  CreateUploadUrlResponse,
} from "@mrsimon/shared";

import { randomUUID } from "node:crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "@/shared/storage/s3.js";
import { prisma } from "@/shared/db/prisma.js";
import { HttpError } from "@/shared/errors/httpErrors.js";
import { MAX_FILE_SIZE } from "@/shared/storage/constants.js";
import { getUploadExpiresAt } from "@/shared/storage/lib/getUploadExpiresAt.js";

const ROOT_BREADCRUMB: BreadcrumbDto = {
  id: null,
  name: "Root",
};

const normalizeParentId = (parentId: unknown) => {
  if (parentId === undefined || parentId === null || parentId === "null" || parentId === "") {
    return null;
  }

  return String(parentId);
};

const normalizeNodeName = (name: string) => name.trim().toLowerCase();

const splitFileName = (name: string) => {
  const dotIndex = name.lastIndexOf(".");

  if (dotIndex <= 0 || dotIndex === name.length - 1) {
    return {
      baseName: name,
      extension: "",
    };
  }

  return {
    baseName: name.slice(0, dotIndex),
    extension: name.slice(dotIndex),
  };
};

const withNameIndex = (name: string, type: NodeType, index: number) => {
  if (type === "FOLDER") {
    return `${name} ${index}`;
  }

  const { baseName, extension } = splitFileName(name);

  return `${baseName} ${index}${extension}`;
};

const getAvailableNodeName = async (name: string, type: NodeType, parentId: string | null) => {
  const siblingNodes = await prisma.node.findMany({
    where: {
      parentId,
      type,
    },
    select: {
      name: true,
    },
  });

  const siblingNames = new Set(siblingNodes.map((node) => normalizeNodeName(node.name)));
  let candidateName = name;
  let index = 1;

  while (siblingNames.has(normalizeNodeName(candidateName))) {
    candidateName = withNameIndex(name, type, index);
    index += 1;
  }

  return {
    name: candidateName,
    renamed: candidateName !== name,
  };
};

const getBreadcrumbs = async (parentId: string | null) => {
  const breadcrumbs: BreadcrumbDto[] = [];
  let currentId = parentId;

  while (currentId) {
    const node = await prisma.node.findUnique({
      where: {
        id: currentId,
      },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
    });

    if (!node) {
      break;
    }

    breadcrumbs.unshift({
      id: node.id,
      name: node.name,
    });

    currentId = node.parentId;
  }

  return [ROOT_BREADCRUMB, ...breadcrumbs];
};

const getParentFolder = async (parentId: string | null) => {
  if (parentId === null) {
    return null;
  }

  return prisma.node.findUnique({
    where: {
      id: parentId,
    },
  });
};

export const getNodes = async (query: GetNodesRequest): Promise<GetNodesResponse> => {
  const parentId = normalizeParentId(query.parentId);
  const parentNode = await getParentFolder(parentId);

  if (parentId !== null && !parentNode) {
    throw new HttpError(404, "Parent node not found");
  }

  if (parentNode && parentNode.type !== "FOLDER") {
    throw new HttpError(400, "Parent node is not a folder");
  }

  const nodes = await prisma.node.findMany({
    where: {
      parentId,
    },
    orderBy: [
      {
        type: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const breadcrumbs = await getBreadcrumbs(parentId);

  return {
    nodes,
    breadcrumbs,
  };
};

export const createNode = async (
  body: CreateNodeRequest,
): Promise<CreateNodeResponse | CreateUploadUrlResponse> => {
  const parentId = normalizeParentId(body.parentId);
  const parentNode = await getParentFolder(parentId);

  if (parentId !== null && !parentNode) {
    throw new HttpError(404, "Parent node not found");
  }

  if (parentNode && parentNode.type !== "FOLDER") {
    throw new HttpError(400, "Parent node is not a folder");
  }

  const requestedName = body.name.trim();

  if (!requestedName) {
    throw new HttpError(400, "Node name is required");
  }

  if (body.type === "FOLDER") {
    const name = await getAvailableNodeName(requestedName, "FOLDER", parentId);
    const node = await prisma.node.create({
      data: {
        name: name.name,
        type: "FOLDER",
        status: "UPLOADED",
        parentId,
      },
    });

    return {
      node,
      renamed: name.renamed,
      originalName: name.renamed ? requestedName : undefined,
    };
  } else if (body.type === "FILE") {
    if (body.size > MAX_FILE_SIZE) throw new HttpError(400, "Node is too large");

    const storageKey = randomUUID();
    const uploadExpiresAt = getUploadExpiresAt(body.size);
    const name = await getAvailableNodeName(requestedName, "FILE", parentId);

    const node = await prisma.node.create({
      data: {
        name: name.name,
        type: "FILE",
        status: "PENDING",
        parentId,
        storageKey,
        mimeType: body.mimeType,
        size: body.size,
        uploadExpiresAt,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: storageKey,
      ContentType: body.mimeType,
      ContentLength: body.size,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    });

    return {
      node,
      uploadUrl,
      renamed: name.renamed,
      originalName: name.renamed ? requestedName : undefined,
    };
  } else {
    throw new HttpError(400, "Invalid node type");
  }
};

export const completeUpload = async (id: string): Promise<CompleteUploadResponse> => {
  if (!id) {
    throw new HttpError(400, "Node ID is required");
  }

  const node = await prisma.node.findUnique({
    where: { id: id },
  });

  if (!node) {
    throw new HttpError(404, "Node not found");
  }

  if (node.type === "FILE") {
    if (!node.storageKey) {
      throw new HttpError(
        400,
        "The node couldn't be searched in the storage. Node doesn't have unique storage key",
      );
    }

    if (node.status === "UPLOADED") {
      return node;
    }

    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: node.storageKey,
        }),
      );
    } catch {
      throw new HttpError(400, "File does not exist in storage");
    }

    const updatedNode = await prisma.node.update({
      where: { id: id },
      data: {
        status: "UPLOADED",
        uploadExpiresAt: null,
      },
    });

    return updatedNode;
  } else {
    throw new HttpError(400, "Invalid node type. Node is not a file");
  }
};
