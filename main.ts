export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_BASE_URL
    : process.env.LOCAL_BASE_URL;

interface FetchServiceParams {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  isFormData?: boolean;
  cache?: RequestCache;
  token?: string;
}

interface FetchServiceResponse<T> {
  status: number;
  data: T | null;
  message: string;
}

/**
 * A service function to make HTTP requests using the native fetch API.
 * It also do automatic JSON parsing and support for multipart/form-data.
 * Is also able to cancel the request with the AbortSignal.
 *
 * @template T - The expected response data type.
 * @param {FetchServiceParams} params - The parameters for the HTTP request.
 * @param {'GET' | 'POST' | 'PATCH' | 'DELETE'} params.method - The HTTP method.
 * @param {string} params.url - The endpoint URL (relative to the base URL).
 * @param {Record<string, string>} [params.headers] - Optional headers to include in the request.
 * @param {unknown} [params.body] - The body of the request, used for methods like POST or PATCH.
 * @param {AbortSignal} [params.signal] - An optional signal to cancel the request.
 * @param {boolean} [params.isFormData=false] - Set to true if the body is FormData. Automatically adjusts the Content-Type header.
 * @param {RequestCache} [params.cache='no-store'] - The cache mode for the request. Defaults to 'no-store'.
 * @param {string} [params.token] - An optional JWT token for Authorization. If provided, it's added to the Authorization header.
 * @returns {Promise<FetchServiceResponse<T>>} A promise that resolves to an object containing the status, data, and message of the response.
 *
 * @example
 * fetchService({
 *   method: 'GET',
 *   url: '/api/v1/resource',
 *   cache: 'force-cache',
 *   token: 'your-jwt-token-here',
 * })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
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
