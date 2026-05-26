export const fmNodesQueryKeys = {
  all: ["fm-nodes"],
  list: () => [...fmNodesQueryKeys.all, "list"] as const,
  details: () => [...fmNodesQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...fmNodesQueryKeys.details(), String(id)] as const,
};
