import cron from "node-cron";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "../shared/storage/s3.js";
import { prisma } from "../shared/db/prisma.js";

export function startCleanupPendingUploadsJob() {
  cron.schedule("26 * * * *", async () => {
    console.log("---- CRON RUNING ----");
    const expiredNodes = await prisma.node.findMany({
      where: {
        type: "FILE",
        status: "PENDING",
        OR: [
          {
            uploadExpiresAt: {
              lt: new Date(),
            },
          },
          {
            uploadExpiresAt: null,
          },
        ],
      },
      select: {
        id: true,
        storageKey: true,
      },
      // TODO в будущем может потребоваться очередь либо другой способ очищать не только 100 записей
      take: 100,
    });

    console.log(expiredNodes);
    for (const node of expiredNodes) {
      console.log(`[cleanup] found ${expiredNodes.length} expired uploads`);
      try {
        console.log(`[cleanup] check file existing`);

        await s3.send(
          new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: node.storageKey,
          }),
        );
        console.log(`[cleanup] file exist`);
        console.log(`[cleanup] update node status to UPLOADED in database`);
        await prisma.node.update({
          where: { id: node.id },
          data: {
            status: "UPLOADED",
            uploadExpiresAt: null,
          },
        });
      } catch (error) {
        const statusCode =
          error instanceof Error && "$metadata" in error
            ? (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
            : undefined;

        if (statusCode === 404) {
          console.log(`[cleanup] file don't exist`);
          console.log(`[cleanup] delete node from database`);

          await prisma.node.delete({
            where: { id: node.id },
          });
          continue;
        }

        console.log(`[cleanup] file don't exist or any other errors`);
      }
    }

    console.log("---- CRON FINISHED ----");
  });
}
