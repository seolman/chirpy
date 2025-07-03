import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../error.js";

export function middlewareError(err: Error, req: Request, res: Response, next: NextFunction) {
  res.header("Content-Type", "application/json; charset=utf-8");
  if (err instanceof BadRequestError) {
    res.status(err.statusCode).send(JSON.stringify({ error: err.message }));
 } else {
    res.status(500).send(JSON.stringify({ error: "Something went wrong on our end" }));
 }
  res.end();
}
