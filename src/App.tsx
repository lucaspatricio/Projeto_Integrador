import { useEffect, useState } from "react";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import Login from "./features/auth/Login.tsx";
import { getCurrentUser, login, logout } from "./features/auth/auth.service";
import type { AuthUser, Role } from "./features/auth/auth.types";
import { ApiError } from "./lib/api/client";
import { isApiMode } from "./lib/api/config";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(isApiMode);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isApiMode) return undefined;

    let isMounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (isMounted) setUser(currentUser);
      })
      .catch((error) => {
        if (isMounted && !(error instanceof ApiError && error.status === 401)) {
          setAuthError(error instanceof Error ? error.message : "Não foi possível validar sua sessão.");
        }
      })
      .finally(() => {
        if (isMounted) setIsInitializing(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogin(email: string, password: string, role: Role): Promise<void> {
    setIsLoggingIn(true);
    setAuthError("");

    try {
      setUser(await login({ email, password, role }));
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout(): Promise<void> {
    await logout();
    setUser(null);
  }

  if (isInitializing) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-slate-500">Carregando sua sessão...</main>;
  }

  return user ? (
    <Dashboard
      email={user.email}
      name={user.name}
      role={user.role}
      onLogout={handleLogout}
    />
  ) : (
    <Login
      onLogin={handleLogin}
      error={authError}
      isLoading={isLoggingIn}
      isApiMode={isApiMode}
    />
  );
}
