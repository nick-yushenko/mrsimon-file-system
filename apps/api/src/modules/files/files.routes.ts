import type { FastifyPluginAsync } from "fastify";
import type { GetNodesRequest, CreateNodeRequest } from "@mrsimon/shared";

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3 } from "@/shared/storage/s3.js";
import { prisma } from "@/shared/db/prisma.js";
import { getNodes, createNode, completeUpload } from "@/modules/files/files.service.js";

export const filesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/nodes", async (request) => {
    return getNodes(request.query as GetNodesRequest);
  });

  app.post("/nodes", async (request, reply) => {
    const result = await createNode(request.body as CreateNodeRequest);

    return reply.status(201).send(result);
  });

  // Подтверждение, что файл был добавлен в S3
  app.post("/nodes/:id/complete", async (request, reply) => {
    const params = request.params as { id: string };
    const result = await completeUpload(params.id);
    return reply.status(201).send(result);
  });

  app.get("/nodes/:id", async (request, reply) => {
    // TODO переработать (разделить на скачивание и доступ по ссылке для просмотра)
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
