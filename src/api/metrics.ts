import type { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(Buffer.from(`Hits: ${config.fileserverHits.toString(10)}`).toString());
  res.end();
}

export async function handlerReset(req: Request, res: Response) {
  config.fileserverHits = 0;
  res.status(200).end();
}
