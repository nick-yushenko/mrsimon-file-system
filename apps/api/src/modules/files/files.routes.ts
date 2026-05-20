import type { FastifyInstance } from "fastify";

import { prisma } from "../../shared/db/prisma.js";

export async function filesRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
    const query = request.query as {
      parentId?: string;
    };

    return prisma.file.findMany({
      where: {
        parentId: query.parentId ?? null,
      },
      orderBy: {
        name: "asc",
      },
    });
  });

  app.post("/folders", async (request, reply) => {
    const body = request.body as {
      name: string;
      parentId?: string | null;
    };

    const folder = await prisma.file.create({
      data: {
        name: body.name,
        type: "FOLDER",
        parentId: body.parentId ?? null,
      },
    });

    return reply.code(201).send(folder);
  });

  app.post("/", async (request, reply) => {
    const body = request.body as {
      name: string;
      parentId?: string | null;
      storageKey?: string | null;
      mimeType?: string | null;
      size?: number | null;
    };

    const file = await prisma.file.create({
      data: {
        name: body.name,
        type: "FILE",
        parentId: body.parentId ?? null,
        storageKey: body.storageKey ?? null,
        mimeType: body.mimeType ?? null,
        size: body.size ?? null,
      },
    });

    return reply.code(201).send(file);
  });

  app.patch("/:id", async (request) => {
    const params = request.params as {
      id: string;
    };

    const body = request.body as {
      name: string;
    };

    return prisma.file.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
      },
    });
  });

  app.delete("/:id", async (request) => {
    const params = request.params as {
      id: string;
    };

    return prisma.file.delete({
      where: {
        id: params.id,
      },
    });
  });
}