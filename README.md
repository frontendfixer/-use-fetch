# @frontendfixer/use-fetch

A flexible and type-safe HTTP client utility built on top of the native fetch API, designed to handle common HTTP request patterns with built-in error handling and configuration options.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Types](#types)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)

## Installation

Using npm:

```bash
npm install @frontendfixer/use-fetch
```

Using yarn:

```bash
yarn add @frontendfixer/use-fetch
```

Using pnpm:

```bash
pnpm add @frontendfixer/use-fetch
```

## Quick Start

```typescript
import { fetchService } from "@frontendfixer/use-fetch";

// Simple GET request
const getData = async () => {
  const response = await fetchService<YourDataType>({
    method: "GET",
    url: "/api/endpoint",
  });

  return response.data;
};
```

## Configuration

Create a `.env` file in your project root and add your API URLs:

```env
PRODUCTION_BASE_URL=https://api.yourproduction.com
LOCAL_BASE_URL=http://localhost:3000
```

The package automatically handles environment switching:

```typescript
// This is handled internally by the package
export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_BASE_URL
    : process.env.LOCAL_BASE_URL;
```

## API Reference

### fetchService<T>(params: FetchServiceParams): Promise<FetchServiceResponse<T>>

#### Parameters

`params` object properties:

| Property   | Type                                            | Required | Default    | Description                             |
| ---------- | ----------------------------------------------- | -------- | ---------- | --------------------------------------- |
| method     | 'GET' \| 'POST' \| 'PATCH' \| 'PUT' \| 'DELETE' | Yes      | -          | HTTP method for the request             |
| url        | string                                          | Yes      | -          | Endpoint URL (relative to baseURL)      |
| headers    | Record<string, string>                          | No       | {}         | Additional request headers              |
| body       | unknown                                         | No       | undefined  | Request body for POST/PATCH/PUT methods |
| signal     | AbortSignal                                     | No       | undefined  | Signal for request cancellation         |
| isFormData | boolean                                         | No       | false      | Set true when sending FormData          |
| cache      | RequestCache                                    | No       | 'no-store' | Cache mode for the request              |
| token      | string                                          | No       | undefined  | JWT token for authorization             |

#### Return Type

```typescript
interface FetchServiceResponse<T> {
  status: number; // HTTP status code
  data: T | null; // Response data of type T or null
  message: string; // Response message or error description
}
```

## Types

You can import types directly from the package:

```typescript
import type {
  FetchServiceParams,
  FetchServiceResponse,
} from "@frontendfixer/use-fetch";
```

Type definitions:

```typescript
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
```

## Usage Examples

### Basic GET Request

```typescript
import { fetchService } from "@frontendfixer/use-fetch";

interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (userId: string) => {
  const response = await fetchService<User>({
    method: "GET",
    url: `/users/${userId}`,
    cache: "force-cache",
  });

  return response.data;
};
```

### POST Request with JSON Body

```typescript
interface CreateUserPayload {
  name: string;
  email: string;
}

const createUser = async (userData: CreateUserPayload) => {
  const response = await fetchService<User>({
    method: "POST",
    url: "/users",
    body: userData,
  });

  return response;
};
```

### File Upload with FormData

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchService<{ fileUrl: string }>({
    method: "POST",
    url: "/upload",
    body: formData,
    isFormData: true,
  });

  return response;
};
```

### Authenticated Request

```typescript
const getUserProfile = async (token: string) => {
  const response = await fetchService<User>({
    method: "GET",
    url: "/profile",
    token,
  });

  return response;
};
```

### Cancellable Request

```typescript
const searchUsers = async (query: string) => {
  const controller = new AbortController();

  const response = await fetchService<User[]>({
    method: "GET",
    url: `/users/search?q=${query}`,
    signal: controller.signal,
  });

  // To cancel the request:
  // controller.abort();

  return response;
};
```

## Error Handling

The service handles errors gracefully and returns structured responses:

1. **Request Cancellation**: Returns status 499 with message "Request was cancelled"
2. **Network/Server Errors**: Returns status 500 with message "Internal server error"
3. **API Errors**: Preserves the original error status and message from the API

Example error handling:

```typescript
const handleApiCall = async () => {
  const response = await fetchService<User>({
    method: "GET",
    url: "/users/1",
  });

  if (response.status >= 400) {
    console.error(`Error: ${response.message}`);
    return null;
  }

  return response.data;
};
```

## Features

- ✅ Type-safe responses with TypeScript generics
- ✅ Automatic JSON parsing
- ✅ FormData support
- ✅ Request cancellation
- ✅ Flexible caching options
- ✅ JWT authentication support
- ✅ Comprehensive error handling
- ✅ Environment-aware base URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Author

Lakshmikanta Patra

## Support

For support, email [frontendfixer@gmail.com](mailto:frontendfixer@gmail.com) or open an issue on GitHub.
