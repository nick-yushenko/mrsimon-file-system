import type { NodeDto } from "./types";

export type GetFmNodesParam = {
  accessToken: string | null;
};

export type CreateFolderRequest = {
  name: string;
  type: "FOLDER";
  parentId?: string | null;
};

export type CreateUploadUrlRequest = {
  name: string;
  type: "FILE";
  mimeType: string;
  size: number;
  parentId?: string | null;
};

export type CreateNodeRequest = CreateFolderRequest | CreateUploadUrlRequest;

export type CreateUploadUrlResponse = {
  node: NodeDto;
  uploadUrl: string;
};

export type CompleteUploadResponse = NodeDto;

export type GetNodesResponse = NodeDto[];
