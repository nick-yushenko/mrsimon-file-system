import type { NodeDto, BreadcrumbDto } from "./types";

export type GetFmNodesParam = {
  accessToken: string | null;
};

export type GetNodesRequest = {
  parentId?: string | null;
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

export type CreateUploadUrlResponse = {
  node: NodeDto;
  uploadUrl: string;
  renamed: boolean;
  originalName?: string;
};

export type CreateNodeRequest = CreateFolderRequest | CreateUploadUrlRequest;

export type CreateNodeResponse = {
  node: NodeDto;
  renamed: boolean;
  originalName?: string;
};

export type CompleteUploadResponse = NodeDto;

export type GetNodesResponse = {
  nodes: NodeDto[];
  breadcrumbs: BreadcrumbDto[];
};
