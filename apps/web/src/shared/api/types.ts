export type PageMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  meta: PageMeta | null;
};

export type PagedResult<T> = {
  items: T[];
} & PageMeta;
