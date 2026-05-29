import type { FastifyServerOptions } from "fastify";

import Fastify from "fastify";
import cors from "@fastify/cors";

import { HttpError } from "@/shared/errors/httpErrors.js";

import { filesRoutes } from "./modules/files/files.routes.js";

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
  const fastify = Fastify(options);

  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    request.log.error(error);

    return reply.status(500).send({
      message: "Internal server error",
    });
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.register(filesRoutes, { prefix: "/api/fm" });
  return fastify;
}

export { buildApp };
