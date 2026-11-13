import { roles } from "../../data/roles.js";
import { ApiError, apiRequest } from "../../lib/api/client.js";
import { isApiMode } from "../../lib/api/config.js";
import type { AuthUser, LoginCredentials, Role } from "./auth.types.js";

const validRoles = new Set<string>(Object.keys(roles));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeUser(user: unknown): AuthUser {
  if (
    !isRecord(user)
    || typeof user.email !== "string"
    || typeof user.role !== "string"
    || !validRoles.has(user.role)
  ) {
    throw new ApiError("A resposta da API contém um usuário ou perfil inválido.");
  }

  return {
    ...(typeof user.id === "string" ? { id: user.id } : {}),
    name: typeof user.name === "string" ? user.name : user.email.split("@")[0],
    email: user.email,
    role: user.role as Role,
  };
}

export async function login({ email, password, role }: LoginCredentials): Promise<AuthUser> {
  if (!isApiMode) {
    return normalizeUser({ email, role });
  }

  const response = await apiRequest<{ user?: unknown }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return normalizeUser(response.user);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isApiMode) return null;

  const response = await apiRequest<{ user?: unknown }>("/auth/me");
  return normalizeUser(response.user);
}

export async function logout(): Promise<void> {
  if (isApiMode) {
    await apiRequest("/auth/logout", { method: "POST" });
  }
}
