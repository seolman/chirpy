import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

import { UnauthorizedError } from "./error.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

const SALT_ROUNDS = 10;
const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function checkPasswordHash(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}


export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload: Pick<JwtPayload, "iss" | "sub" | "iat" | "exp"> = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: iat,
    exp: iat + expiresIn
  };

  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("missing or malformed auth header");
  }

  return authHeader.replace("Bearer ", "").trim();
}
