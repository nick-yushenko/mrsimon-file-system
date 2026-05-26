import type { FastifyPluginAsync } from "fastify";
import type { CreateNodeRequest, CreateUploadUrlRequest } from "@mrsimon/shared";

import { randomUUID } from "node:crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "@/shared/storage/s3.js";
import { prisma } from "@/shared/db/prisma.js";
import { getUploadExpiresAt } from "@/shared/storage/lib/getUploadExpiresAt.js";
import { MAX_FILE_SIZE } from "@/shared/storage/constants.js";

export const filesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/nodes", async () => {
    return prisma.node.findMany({
      where: {
        parentId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });

  app.post("/nodes", async (request, reply) => {
    const body = request.body as CreateNodeRequest;
    if (body.type === "FOLDER") {
      // TODO имя папки должно быть уникальным в рамках уровня иерархии
      const node = await prisma.node.create({
        data: {
          name: body.name,
          type: "FOLDER",
          status: "UPLOADED",
          parentId: body.parentId ?? null,
        },
      });

      return reply.send({
        node,
      });
    } else if (body.type === "FILE") {
      if (body.size > MAX_FILE_SIZE)
        return reply.status(400).send({ message: `Node is too large` });

      const storageKey = randomUUID();
      const uploadExpiresAt = getUploadExpiresAt(body.size);

      const node = await prisma.node.create({
        data: {
          name: body.name,
          type: "FILE",
          status: "PENDING",
          parentId: body.parentId ?? null,
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

      return reply.send({
        node,
        uploadUrl,
      });
    } else {
      return reply.status(400).send({ message: "Invalid node type" });
    }
  });

  // Подтверждение, что файл был добавлен в S3
  app.post("/nodes/:id/complete", async (request, reply) => {
    const params = request.params as { id: string };

    const node = await prisma.node.findUnique({
      where: { id: params.id },
    });

    if (!node) {
      return reply.status(404).send({ message: "Node not found" });
    }

    if (node.type === "FILE") {
      if (!node.storageKey) {
        return reply.status(400).send({
          message:
            "The node couldn't be searched in the storage. Node doesn't have unique storage key",
        });
      }

      if (node.status === "UPLOADED") {
        return reply.send(node);
      }

      try {
        await s3.send(
          new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: node.storageKey,
          }),
        );
      } catch {
        return reply.status(400).send({
          message: "File does not exist in storage",
        });
      }

      const updatedNode = await prisma.node.update({
        where: { id: params.id },
        data: {
          status: "UPLOADED",
          uploadExpiresAt: null,
        },
      });

      return reply.send(updatedNode);
    } else {
      return reply.status(400).send({ message: "Invalid node type. Node is not a file" });
    }
  });

  app.get("/nodes/:id", async (request, reply) => {
    const params = request.params as { id: string };

    const node = await prisma.node.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!node) {
      return reply.status(404).send({ message: "Node not found" });
    }

    if (node.type === "FOLDER") {
      return reply.send({ node });
    } else if (node.type === "FILE") {
      if (node.status !== "UPLOADED") {
        return reply.status(400).send({ message: "File is not uploaded yet, try leter" });
      }

      if (!node.storageKey) {
        return reply.status(400).send({
          message:
            "The node couldn't be searched in the storage. Node doesn't have unique storage key",
        });
      }

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: node.storageKey,
      });

      const expiresIn = 60 * 15;

      const downloadUrl = await getSignedUrl(s3, command, {
        expiresIn: expiresIn,
      });

      return reply.send({ node, downloadUrl, expiresIn });
    }
  });
};
