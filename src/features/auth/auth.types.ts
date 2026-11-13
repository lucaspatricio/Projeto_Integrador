export const roleKeys = ["admin", "professor", "aluno"] as const;

export type Role = (typeof roleKeys)[number];

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: Role;
}
