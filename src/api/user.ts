import { Request, Response } from "express";

import { createUser, getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { checkHashPassword, hashPassword } from "../auth.js";
import type { NewUser, UserResponse } from "../db/schema.js";

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

export async function handlerUserLogin(req: Request, res: Response) {
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

  const validPassword = await checkHashPassword(password, user.hashedPassword);
  if (!validPassword) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const { hashedPassword: _, ...userResponse } = user;

  res.header("Content-type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify(userResponse satisfies UserResponse));
}
