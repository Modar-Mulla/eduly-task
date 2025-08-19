"use client";

import * as React from "react";

export type UserRole = "Admin" | "Teacher" | "Proctor";
export type User = {
  id: string;
  name: string;
  email?: string;
  role?: UserRole;
};

type AuthCtx = {
  user: User | null;
  isHydrated: boolean;
  login: (user: User, opts?: { token?: string; persist?: boolean }) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
};

export const AuthContext = React.createContext<AuthCtx | null>(null);


const LS_USER = "auth.user";
const LS_TOKEN = "auth.token";
const LS_SYNC = "auth.sync";

function readUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isHydrated, setHydrated] = React.useState(false);


  React.useEffect(() => {
    setUser(readUserFromStorage());
    setHydrated(true);
  }, []);

 
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_USER) {
        setUser(readUserFromStorage());
      }
      if (e.key === LS_SYNC && e.newValue) {
        try {
          const msg = JSON.parse(e.newValue) as { type: "login" | "logout" | "update"; ts: number; payload?: any };
          if (msg.type === "logout") setUser(null);
          if (msg.type === "login" || msg.type === "update") setUser(readUserFromStorage());
        } catch {
       
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const broadcast = React.useCallback((type: "login" | "logout" | "update", payload?: unknown) => {
    
    localStorage.setItem(LS_SYNC, JSON.stringify({ type, ts: Date.now(), payload }));
  }, []);

  const login = React.useCallback<AuthCtx["login"]>((u, opts) => {
    setUser(u);
    if (opts?.persist !== false) {
      localStorage.setItem(LS_USER, JSON.stringify(u));
      if (opts?.token) localStorage.setItem(LS_TOKEN, opts.token);
    }
    broadcast("login", { id: u.id });
  }, [broadcast]);

  const logout = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_TOKEN);
    broadcast("logout");
  }, [broadcast]);

  const updateUser = React.useCallback<AuthCtx["updateUser"]>((patch) => {
    setUser((prev) => {
      const next = { ...(prev ?? { id: "me", name: "" }), ...patch } as User;
      localStorage.setItem(LS_USER, JSON.stringify(next));
      broadcast("update", { id: next.id });
      return next;
    });
  }, [broadcast]);

  const value = React.useMemo<AuthCtx>(() => ({
    user,
    isHydrated,
    login,
    logout,
    updateUser,
  }), [user, isHydrated, login, logout, updateUser]);

  return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
