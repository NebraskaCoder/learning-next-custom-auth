import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { sha256 } from "@oslojs/crypto/sha2";
import { sessions, type SessionInsert } from "@/db/schema/sessions";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

import type {
  SessionExtraData,
  SessionValidationResult,
} from "@/types/AuthenticationTypes";
import { cookies } from "next/headers";
import { cache } from "react";

export const generateSessionToken = () => {
  const bytes = new Uint8Array(20);

  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);

  return token;
};

export const createSession = async (
  token: string,
  userId: string,
  extraData: SessionExtraData = {}
) => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: SessionInsert = {
    sessionId: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    source: extraData.source ?? "web",
    passKeyUsed: extraData.passKeyUsed || false,
    twoFactorVerified: extraData.twoFactorVerified || false,
    userAgent: extraData.userAgent,
    initialIPAddress: extraData.initialIPAddress,
    initialIPAddressReverseLookup: extraData.initialIPAddressReverseLookup,
    knownLocation: extraData.knownLocation,
    adminComments: extraData.adminComments,
  };

  await db.insert(sessions).values(session);

  const sessionQuery = await db.query.sessions.findFirst({
    where: eq(sessions.sessionId, sessionId),
    with: {
      user: true,
    },
  });

  if (!sessionQuery) {
    throw new Error("Session not found after creation");
  }

  return sessionQuery;
};

export const validateSessionToken = async (
  token: string
): Promise<SessionValidationResult> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const sessionResult = await db.query.sessions.findFirst({
    where: eq(sessions.sessionId, sessionId),
    with: {
      user: true,
    },
  });

  if (!sessionResult) {
    return { session: null, user: null };
  }

  const { user, ...session } = sessionResult;
  const sessionExpiresAtTime = session.expiresAt.getTime();

  if (Date.now() >= sessionExpiresAtTime) {
    await db.delete(sessions).where(eq(sessions.sessionId, session.sessionId));
    return { session: null, user: null };
  }

  if (Date.now() >= sessionExpiresAtTime - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await db
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessions.sessionId, session.sessionId));
  }

  return { session, user };
};

export const removeSession = async (sessionId: string) => {
  await db.delete(sessions).where(eq(sessions.sessionId, sessionId));
};

export const setSessionTokenCookie = (token: string, expiresAt: Date) => {
  cookies().set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
};

export const deleteSessionTokenCookie = () => {
  cookies().set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
};

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = cookies().get("session")?.value ?? null;

    if (token === null) {
      return { session: null, user: null };
    }

    const result = await validateSessionToken(token);

    return result;
  }
);
