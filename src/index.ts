import { getBaseURL } from "./env";
import type { FetchServiceParams, FetchServiceResponse } from "./types";

export { type FetchServiceParams, type FetchServiceResponse };

/**
 * A service function to make HTTP requests using the native fetch API.
 * It also does automatic JSON parsing and support for multipart/form-data.
 * Is also able to cancel the request with the AbortSignal.
 */
export async function fetchService<T>({
  method,
  url,
  headers = {},
  body,
  signal,
  isFormData = false,
  cache = "no-store",
  token,
}: FetchServiceParams): Promise<FetchServiceResponse<T>> {
  try {
    const baseURL = getBaseURL();
    const res = await fetch(`${baseURL}${url}`, {
      method,
      headers: {
        ...headers,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: isFormData ? (body as FormData) : JSON.stringify(body),
      credentials: "include",
      signal,
      cache,
    });

    const data = await res.json();
    const responseStatus = data.status ?? res.status;
    const responseMessage = data.message ?? "Request successful";
    const responseData = data.data ?? null;

    return {
      status: responseStatus,
      data: responseData,
      message: responseMessage,
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        status: 499,
        data: null as unknown as T,
        message: "Request was cancelled",
      };
    }

    return {
      status: 500,
      data: null as unknown as T,
      message: "Internal server error. Something went wrong",
    };
  }
}
