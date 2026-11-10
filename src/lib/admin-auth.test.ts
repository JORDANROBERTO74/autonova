import { describe, expect, it } from "vitest";

import {
  ADMIN_SESSION_DURATION_MS,
  createSession,
  isSessionValid,
  isValidCredentials,
} from "./admin-auth";

const credentials = {
  email: "admin@autonova.mx",
  password: "autonova2026",
};

describe("isValidCredentials", () => {
  it("normalizes the email and requires the exact password", () => {
    expect(
      isValidCredentials(" Admin@AutoNova.mx ", "autonova2026", credentials),
    ).toBe(true);
    expect(
      isValidCredentials("admin@autonova.mx", "incorrecta", credentials),
    ).toBe(false);
  });
});

describe("admin session", () => {
  it("creates an 8-hour session", () => {
    const now = 1_700_000_000_000;
    const session = createSession(" Admin@AutoNova.mx ", now);

    expect(session.email).toBe("admin@autonova.mx");
    expect(session.expiresAt).toBe(now + ADMIN_SESSION_DURATION_MS);
    expect(isSessionValid(session, now + 1)).toBe(true);
    expect(isSessionValid(session, session.expiresAt)).toBe(false);
    expect(isSessionValid(null)).toBe(false);
  });
});
