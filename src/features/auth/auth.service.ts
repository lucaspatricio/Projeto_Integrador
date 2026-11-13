import { apiRequest, ApiError } from "../../lib/api/client.js";
import type { AuthUser, LoginCredentials, Role } from "./auth.types.js";

const TOKEN_KEY = "gestaofit_token";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeUser(user: unknown): AuthUser {
  if (!isRecord(user) || typeof user.email !== "string" || typeof user.role !== "string") {
    throw new ApiError("Resposta de usuário inválida.");
  }
  return {
    ...(typeof user.id === "number" || typeof user.id === "string" ? { id: String(user.id) } : {}),
    name: typeof user.name === "string" ? user.name : user.email.split("@")[0],
    email: user.email,
    role: user.role as Role,
  };
}

export async function login({ email, password }: LoginCredentials): Promise<AuthUser> {
  const response = await apiRequest<{ token?: string; user?: unknown }>("/auth/login", {
    method: "POST",
    body: { email, password },
    publico: true,
  });
  if (typeof response.token === "string") localStorage.setItem(TOKEN_KEY, response.token);
  return normalizeUser(response.user);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  try {
    const response = await apiRequest<{ user?: unknown }>("/auth/me");
    return normalizeUser(response.user);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem(TOKEN_KEY);
  try { await apiRequest("/auth/logout", { method: "POST" }); } catch { /* ignora */ }
}