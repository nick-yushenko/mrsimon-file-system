import type { CreateFolderRequest, NodeDto } from "@mrsimon/shared";

import { apiClient } from "@/shared/api/apiClient";

export const fmApi = {
  getNodes: async (): Promise<NodeDto[]> => {
    return apiClient.get("/api/fm/nodes");
  },

  createFolder: async (body: CreateFolderRequest): Promise<NodeDto> => {
    return apiClient.post("/api/fm/nodes", body);
  },
};
