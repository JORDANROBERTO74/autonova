export const ADMIN_SESSION_KEY = "autonova.admin.session.v1";
export const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const DEFAULT_EMAIL = "admin@autonova.mx";
const DEFAULT_PASSWORD = "autonova2026";

export type AdminSession = {
  email: string;
  expiresAt: number;
};

export type AdminCredentials = {
  email: string;
  password: string;
};

export function getAdminCredentials(): AdminCredentials {
  return {
    email: (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? DEFAULT_EMAIL)
      .trim()
      .toLowerCase(),
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? DEFAULT_PASSWORD,
  };
}

export function isValidCredentials(
  email: string,
  password: string,
  credentials: AdminCredentials = getAdminCredentials(),
): boolean {
  return (
    email.trim().toLowerCase() === credentials.email &&
    password === credentials.password
  );
}

export function isSessionValid(
  session: AdminSession | null,
  now = Date.now(),
): session is AdminSession {
  return Boolean(
    session &&
      typeof session.email === "string" &&
      Number.isFinite(session.expiresAt) &&
      session.expiresAt > now,
  );
}

export function createSession(email: string, now = Date.now()): AdminSession {
  return {
    email: email.trim().toLowerCase(),
    expiresAt: now + ADMIN_SESSION_DURATION_MS,
  };
}

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const candidate = parsed as Partial<AdminSession>;
    const session: AdminSession = {
      email: String(candidate.email ?? ""),
      expiresAt: Number(candidate.expiresAt),
    };

    if (!isSessionValid(session)) {
      window.localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession) {
  try {
    window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Sin persistencia disponible; la sesión vive en memoria hasta recargar.
  }
}

export function clearAdminSession() {
  try {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // Nada que limpiar.
  }
}
