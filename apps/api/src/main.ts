import { buildApp } from "./app.js";

const app = await buildApp();

try {
  await app.listen({
    port: 4000,
    host: "0.0.0.0",
  });

  app.log.info("API started on http://localhost:4000");
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
