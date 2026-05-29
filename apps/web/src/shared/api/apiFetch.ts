import type { ApiErrorData } from "./apiError";
import type { PageMeta, ApiResponse } from "./types";

import { apiConfig } from "./config";
import { ApiError } from "./apiError";

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  // accessToken?: string;
};

export async function apiFetch<TResponse>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  // const accessToken = options.accessToken ?? null;

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      // ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorData = normalizeApiErrorData(data);

    throw new ApiError<ApiErrorData | null>(
      response.status,
      errorData?.detail ?? errorData?.title ?? errorData?.message ?? "Request failed",
      errorData,
    );
  }

  return unwrapApiResponse<TResponse>(data);
}

type ApiEnvelope = ApiResponse<unknown>;

const unwrapApiResponse = <TResponse>(data: unknown): TResponse => {
  if (!isApiEnvelope(data)) {
    return data as TResponse;
  }

  if (isPageMeta(data.meta) && Array.isArray(data.data)) {
    return {
      items: data.data,
      ...data.meta,
    } as TResponse;
  }

  return data.data as TResponse;
};

const normalizeApiErrorData = (data: unknown): ApiErrorData | null => {
  if (!isObject(data)) {
    return null;
  }

  return {
    type: getStringValue(data.type),
    title: getStringValue(data.title),
    status: getNumberValue(data.status),
    detail: getStringValue(data.detail),
    code: getStringValue(data.code),
    message: getStringValue(data.message),
    errors: isValidationErrors(data.errors) ? data.errors : undefined,
    traceId: getStringValue(data.traceId),
  };
};

const isApiEnvelope = (value: unknown): value is ApiEnvelope => {
  return isObject(value) && "data" in value && "meta" in value;
};

const isPageMeta = (value: unknown): value is PageMeta => {
  return (
    isObject(value) &&
    typeof value.page === "number" &&
    typeof value.pageSize === "number" &&
    typeof value.totalCount === "number" &&
    typeof value.totalPages === "number"
  );
};

const isValidationErrors = (value: unknown): value is Record<string, string[]> => {
  return (
    isObject(value) &&
    Object.values(value).every(
      (messages) =>
        Array.isArray(messages) && messages.every((message) => typeof message === "string"),
    )
  );
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getStringValue = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const getNumberValue = (value: unknown): number | undefined => {
  return typeof value === "number" ? value : undefined;
};
