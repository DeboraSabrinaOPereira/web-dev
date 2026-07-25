"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadJSON, saveJSON } from "../lib/storage";
import type { UserAccount, UserRole } from "../types";

export const ACCOUNTS: UserAccount[] = [
  {
    name: "Mariana Duarte",
    email: "cliente@exemplo.com",
    password: "cliente123",
    role: "cliente",
  },
  {
    name: "Ana Beatriz Lima",
    email: "admin@compia.com.br",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Otávio Lins",
    email: "editor@compia.com.br",
    password: "editor123",
    role: "editor",
  },
  {
    name: "Rafael Nunes",
    email: "vendedor@compia.com.br",
    password: "vendedor123",
    role: "vendedor",
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  cliente: "Cliente",
  admin: "Administrador",
  editor: "Editor",
  vendedor: "Vendedor",
};

interface AuthValue {
  user: UserAccount | null;
  role: UserRole | null;
  login: (email: string, password: string) => UserAccount;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEmail(loadJSON<string | null>("session", null));
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON("session", email);
  }, [email, hydrated]);

  const user = useMemo(
    () => ACCOUNTS.find((account) => account.email === email) ?? null,
    [email],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      role: user?.role ?? null,
      login(loginEmail, password) {
        const account = ACCOUNTS.find(
          (candidate) =>
            candidate.email.toLowerCase() === loginEmail.trim().toLowerCase(),
        );
        if (!account || account.password !== password) {
          throw new Error("E-mail ou senha incorretos.");
        }
        setEmail(account.email);
        return account;
      },
      logout() {
        setEmail(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return value;
}
