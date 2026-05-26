import type { ApiFetchOptions } from "./apiFetch";

import { apiFetch } from "./apiFetch";

export const apiClient = {
  get<TResponse>(path: string, options?: ApiFetchOptions) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "GET",
    });
  },

  post<TResponse>(path: string, body?: unknown, options?: ApiFetchOptions) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "POST",
      body,
    });
  },

  put<TResponse>(path: string, body?: unknown, options?: ApiFetchOptions) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "PUT",
      body,
    });
  },

  patch<TResponse>(path: string, body?: unknown, options?: ApiFetchOptions) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete<TResponse>(path: string, options?: RequestInit) {
    return apiFetch<TResponse>(path, {
      ...options,
      method: "DELETE",
    });
  },
};
