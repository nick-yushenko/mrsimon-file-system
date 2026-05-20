-- CreateEnum
CREATE TYPE "FileSystemNodeType" AS ENUM ('FILE', 'FOLDER');

-- CreateTable
CREATE TABLE "FileSystemNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileSystemNodeType" NOT NULL,
    "parentId" TEXT,
    "storageKey" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileSystemNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileSystemNode_parentId_idx" ON "FileSystemNode"("parentId");

-- AddForeignKey
ALTER TABLE "FileSystemNode" ADD CONSTRAINT "FileSystemNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileSystemNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
