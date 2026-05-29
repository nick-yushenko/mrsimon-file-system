import { useQuery } from "@tanstack/react-query";

import { fmApi } from "@/entities/fm/api/fmApi";

import { fmNodesQueryKeys } from "./queryKeys";

export const useFmQuery = (parentId: string | null) => {
  return useQuery({
    queryKey: fmNodesQueryKeys.list(parentId),
    queryFn: () => fmApi.getNodes({ parentId }),
  });
};
