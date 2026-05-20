import Fastify from "fastify";
import cors from "@fastify/cors";

import { filesRoutes } from "./modules/files/files.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  app.get("/health", async () => {
    return {
      status: "ok",
    };
  });

  await app.register(filesRoutes, {
    prefix: "/api/files",
  });

  return app;
}
