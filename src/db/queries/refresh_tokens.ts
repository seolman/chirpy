import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { refreshTokens, type NewRefreshTokens } from "../schema.js";

export async function createRefreshToken(token: NewRefreshTokens) {
  const result = await db
    .insert(refreshTokens)
    .values(token)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getUserFromRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));

  return result;
}

export async function revokeRefreshToken(token: string) {
  const result = db
    .update(refreshTokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(refreshTokens.token, token));

  return result;
}
