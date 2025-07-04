import { Request, Response } from "express";

import { createUser, getUserByEmail, updateUserById, upgradeUserToChirpyRed } from "../db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../error.js";
import { checkPasswordHash, getAPIKey, getBearerToken, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "../auth.js";
import type { NewUser, UserResponse } from "../db/schema.js";
import { config } from "../config.js";
import { createRefreshToken, getUserFromRefreshToken, revokeRefreshToken } from "../db/queries/refresh_tokens.js";

export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };
  const { email, password } = req.body as parameters;

  if (!email || !password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({ email, hashedPassword } satisfies NewUser);
  if (!user) {
    throw new Error("could not create user");
  }
  const { hashedPassword: _, ...userResponse } = user;

  res.header("Content-type", "application/json; charset=utf-8");
  res.status(201).send(JSON.stringify(userResponse));
}

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const { email, password } = req.body as parameters;

  if (!email || !password) {
    throw new BadRequestError("Missing required fields");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const validPassword = await checkPasswordHash(password, user.hashedPassword);
  if (!validPassword) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const accessTokenExpiresIn = 60 * 60;
  const refreshTokenExpiresIn = 60 * 60 * 24 * 60;

  const accessToken = makeJWT(user.id, accessTokenExpiresIn, config.api.jwtSecret);
  const refreshToken = makeRefreshToken();

  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + refreshTokenExpiresIn * 1000)
  });

  const { hashedPassword: _, ...userResponse } = user;

  res.header("Content-type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify({
    id: userResponse.id,
    email: userResponse.email,
    createdAt: userResponse.createdAt,
    updatedAt: userResponse.updatedAt,
    isChirpyRed: userResponse.isChirpyRed,
    token: accessToken,
    refreshToken: refreshToken
  }));
}

export async function handlerRefresh(req: Request, res: Response) {
  const token = getBearerToken(req);
  const refreshToken = await getUserFromRefreshToken(token);

  if (!refreshToken || refreshToken.revokedAt || refreshToken.expiresAt < new Date()) {
    throw new UnauthorizedError("invalid or expired refresh token");
  }

  const refreshTokenExpiresIn = 60 * 60;
  const newToken = makeJWT(refreshToken.userId, refreshTokenExpiresIn, config.api.jwtSecret);

  res.header("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify({
    token: newToken
  }));
}

export async function handlerRevoke(req: Request, res: Response) {
  const token = getBearerToken(req);
  await revokeRefreshToken(token);
  res.header("Content-type", "application/json; charset=utf-8");
  res.status(204).send();
}

export async function handlerUsersUpdate(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
  };

  const { email, password }: parameter = req.body;
  if (!email || !password) {
    throw new BadRequestError("missing required fields");
  }

  const jwtToken = getBearerToken(req);
  const userId = validateJWT(jwtToken, config.api.jwtSecret);
  const hashedPassword = await hashPassword(password);
  const updatedUsers = await updateUserById(email, hashedPassword, userId);
  const { hashedPassword: _, ...userWithoutPassword } = updatedUsers[0];

  res.header("Content-type", "application/json; charset=utf-8");
  res.status(200).send(userWithoutPassword);
}

export async function handlerUserUpdateToRed(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    };
  };
  const { event, data }: parameters = req.body;
  const authHeader = getAPIKey(req);
  if (authHeader !== config.api.polkaKey) {
    throw new UnauthorizedError("wrong api key");
  }

  if (event !== "user.upgraded") {
    res.status(204).send();
    return;
  }

  const userId = data?.userId;
  if (!userId) {
    return res.status(204).send();
  }

  const [updated] = await upgradeUserToChirpyRed(userId);

  if (!updated) {
    throw new NotFoundError("User not found");
  }

  res.status(204).send();
}
