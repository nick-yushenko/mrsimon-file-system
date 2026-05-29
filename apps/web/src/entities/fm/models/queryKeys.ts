export const fmNodesQueryKeys = {
  all: ["fm-nodes"],
  list: (parentId: string | null) => [...fmNodesQueryKeys.all, "list", parentId] as const,
  details: () => [...fmNodesQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...fmNodesQueryKeys.details(), String(id)] as const,
};
