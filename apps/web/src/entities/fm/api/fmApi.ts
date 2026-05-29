import type {
  GetNodesRequest,
  GetNodesResponse,
  CreateNodeResponse,
  CreateFolderRequest,
  CreateUploadUrlRequest,
  CompleteUploadResponse,
  CreateUploadUrlResponse,
} from "@mrsimon/shared";

import { apiClient } from "@/shared/api/apiClient";

export const fmApi = {
  getNodes: async (params?: GetNodesRequest): Promise<GetNodesResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.parentId !== undefined) {
      searchParams.set("parentId", params.parentId ?? "null");
    }

    const query = searchParams.toString();

    return apiClient.get(`/api/fm/nodes${query ? `?${query}` : ""}`);
  },

  createFolder: async (body: CreateFolderRequest): Promise<CreateNodeResponse> => {
    return apiClient.post("/api/fm/nodes", body);
  },

  createUploadUrl: async (body: CreateUploadUrlRequest): Promise<CreateUploadUrlResponse> => {
    return apiClient.post("/api/fm/nodes", body);
  },

  completeUpload: async (id: string): Promise<CompleteUploadResponse> => {
    return apiClient.post(`/api/fm/nodes/${id}/complete`);
  },
};
