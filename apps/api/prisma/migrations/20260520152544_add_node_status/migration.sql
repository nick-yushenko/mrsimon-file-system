/*
  Warnings:

  - Added the required column `status` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'UPLOADED');

-- AlterTable
ALTER TABLE "Node" ADD COLUMN     "status" "UploadStatus" NOT NULL;
