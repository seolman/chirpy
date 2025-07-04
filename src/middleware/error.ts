import type { NextFunction, Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "../error.js";

export function middlewareError(err: Error, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500
  let error = "Something went wrong on our end";

  if (err instanceof BadRequestError) {
    statusCode = err.statusCode
    error = err.message
  } else if (err instanceof UnauthorizedError) {
    statusCode = err.statusCode
    error = err.message
  } else if (err instanceof ForbiddenError) {
    statusCode = err.statusCode
    error = err.message
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode
    error = err.message
  }

  res.header("Content-Type", "application/json; charset=utf-8");
  res.status(statusCode).send(JSON.stringify({ error }));
}
