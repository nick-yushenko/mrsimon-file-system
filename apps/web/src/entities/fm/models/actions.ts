import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fmApi } from "@/entities/fm/api/fmApi";

import { fmNodesQueryKeys } from "./queryKeys";

export const useFmActions = (parentId: string | null) => {
  const queryClient = useQueryClient();

  const invalidate = {
    list: () =>
      queryClient.invalidateQueries({
        queryKey: fmNodesQueryKeys.list(parentId),
      }),
  } as const;

  const createFolder = useMutation({
    mutationFn: fmApi.createFolder,
    onSuccess: invalidate.list,
  });

  const createUploadUrl = useMutation({
    mutationFn: fmApi.createUploadUrl,
  });

  const completeUpload = useMutation({
    mutationFn: fmApi.completeUpload,
    onSuccess: invalidate.list,
  });

  return {
    createFolder: createFolder.mutateAsync,
    createUploadUrl: createUploadUrl.mutateAsync,
    completeUpload: completeUpload.mutateAsync,

    isCreating: createFolder.isPending || createUploadUrl.isPending || completeUpload.isPending,

    creatingError: createFolder.error || createUploadUrl.error || completeUpload.error,
  };
};
