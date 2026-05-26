export type UploadStatus = "PENDING" | "UPLOADED";

export type NodeType = "FILE" | "FOLDER";

export type FileNodeDto = {
  id: string;
  name: string;
  type: "FILE";
  status: UploadStatus;
  parentId: string | null;
  storageKey: string;
  mimeType: string;
  size: number;
  uploadExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FolderNodeDto = {
  id: string;
  name: string;
  type: "FOLDER";
  status: UploadStatus;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NodeDto = FileNodeDto | FolderNodeDto;
