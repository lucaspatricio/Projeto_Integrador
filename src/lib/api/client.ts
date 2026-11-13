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
  publico?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getToken(): string | null {
  return localStorage.getItem("gestaofit_token");
}

export async function apiRequest<TResponse = unknown>(
  path: string,
  { method = "GET", body, signal, publico = false }: ApiRequestOptions = {},
): Promise<TResponse> {
  if (!apiBaseUrl) throw new Error("Defina VITE_API_BASE_URL para conectar a API.");

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (!publico) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const text = await response.text();
  let data: unknown;
  if (text) { try { data = JSON.parse(text); } catch { data = text; } }

  if (!response.ok) {
    const message = isRecord(data) ? (data.message ?? data.title) : undefined;
    if (response.status === 401) localStorage.removeItem("gestaofit_token");
    throw new ApiError(
      typeof message === "string" ? message : `A solicitação falhou (${response.status}).`,
      { status: response.status, details: data },
    );
  }

  return data as TResponse;
}