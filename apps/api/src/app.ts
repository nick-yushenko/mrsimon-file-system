import type { FastifyServerOptions } from "fastify";

import Fastify from "fastify";
import cors from "@fastify/cors";

import { filesRoutes } from "./modules/files/files.routes.js";

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
  const fastify = Fastify(options);

  await fastify.register(cors, {
    origin: true,
  });

  fastify.register(filesRoutes, { prefix: "/api/fm" });
  return fastify;
}

export { buildApp };
