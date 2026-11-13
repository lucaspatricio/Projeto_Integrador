const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, { status, details }: { status?: number; details?: unknown } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function apiRequest<TResponse = unknown>(
  path: string,
  { method = "GET", body, signal }: ApiRequestOptions = {},
): Promise<TResponse> {
  if (!apiBaseUrl) {
    throw new Error("Defina VITE_API_BASE_URL para conectar a API.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const responseText = await response.text();
  let data: unknown;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message = isRecord(data)
      ? data.message ?? data.title
      : undefined;
    throw new ApiError(
      typeof message === "string" ? message : `A solicitação falhou (${response.status}).`,
      {
      status: response.status,
      details: data,
      },
    );
  }

  return data as TResponse;
}
