import "dotenv/config";

import { buildApp, type AppOptions } from "./app.js";
import { startCleanupPendingUploadsJob } from "./jobs/cleanupPendingUploads.js";

const options: AppOptions = {
  logger: true,
};

const start = async () => {
  const app = await buildApp(options);
  startCleanupPendingUploadsJob();

  try {
    await app.listen({
      port: 3001,
      host: "localhost",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
