"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ADMIN_SESSION_KEY,
  clearAdminSession,
  createSession,
  isValidCredentials,
  readAdminSession,
  saveAdminSession,
  type AdminSession,
} from "@/lib/admin-auth";

type SignInResult = { ok: true } | { ok: false; error: string };

type AdminAuthContextValue = {
  session: AdminSession | null;
  ready: boolean;
  signIn: (email: string, password: string) => SignInResult;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readAdminSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!session) return;

    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      clearAdminSession();
      setSession(null);
      return;
    }

    const timer = window.setTimeout(() => {
      clearAdminSession();
      setSession(null);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_SESSION_KEY) setSession(readAdminSession());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback((email: string, password: string): SignInResult => {
    if (!isValidCredentials(email, password)) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }

    const nextSession = createSession(email);
    saveAdminSession(nextSession);
    setSession(nextSession);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    clearAdminSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, ready, signIn, signOut }),
    [session, ready, signIn, signOut],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth debe usarse dentro de <AdminAuthProvider>.");
  }
  return context;
}
