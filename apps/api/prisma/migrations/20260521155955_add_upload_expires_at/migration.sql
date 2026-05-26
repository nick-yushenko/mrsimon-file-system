/*
  Warnings:

  - Made the column `storageKey` on table `Node` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "uploadExpiresAt" TIMESTAMP(3),
ALTER COLUMN "storageKey" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Node_status_uploadExpiresAt_idx" ON "Node"("status", "uploadExpiresAt");
