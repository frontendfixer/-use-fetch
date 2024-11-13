export interface FetchServiceParams {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  isFormData?: boolean;
  cache?: RequestCache;
  token?: string;
}

export interface FetchServiceResponse<T> {
  status: number;
  data: T | null;
  message: string;
}