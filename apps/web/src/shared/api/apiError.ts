export type ApiErrorData = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
};

export const isInvalidSessionError = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return false;
  }

  return error.status === 401 || error.status === 403 || error.status === 404;
};

export const isTemporaryAuthCheckError = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return true;
  }

  return error.status >= 500;
};

export class ApiError<TData = unknown> extends Error {
  status: number;
  data: TData;

  constructor(status: number, message: string, data: TData) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const getApiErrorMessage = (error: unknown, fallback = "Request failed"): string => {
  if (error instanceof ApiError) {
    return (
      error.data?.detail ?? error.data?.title ?? error.data?.message ?? error.message ?? fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
