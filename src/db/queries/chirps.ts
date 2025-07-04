import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
import type { Chirp, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp): Promise<Chirp> {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps(): Promise<Chirp[]> {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(chirps.createdAt);

  return result;
}

export async function getChirpById(chirpId: string): Promise<Chirp> {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpId));

  return result;
}

export async function deleteChirpById(chripId: string) {
  const [result] = await db
    .delete(chirps)
    .where(eq(chirps.id, chripId))
    .returning();

  return result;
}
