import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fmApi } from "@/entities/fm/api/fmApi";

import { fmNodesQueryKeys } from "./queryKeys";

export const useFmActions = () => {
  const queryClient = useQueryClient();

  const invalidate = {
    all: () =>
      queryClient.invalidateQueries({
        queryKey: fmNodesQueryKeys.all,
      }),
  } as const;

  const createFolder = useMutation({
    mutationFn: fmApi.createFolder,
    onSuccess: invalidate.all,
  });

  return {
    createFolder: createFolder.mutateAsync,

    isCreating: createFolder.isPending,

    creatingError: createFolder.error,
  };
};
