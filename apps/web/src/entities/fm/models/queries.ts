import { useQuery } from "@tanstack/react-query";

import { fmApi } from "@/entities/fm/api/fmApi";

import { fmNodesQueryKeys } from "./queryKeys";

export const useFmQuery = () => {
  return useQuery({
    queryKey: fmNodesQueryKeys.all,
    queryFn: () => fmApi.getNodes(),
  });
};
