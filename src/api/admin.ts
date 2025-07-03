import type { Response, Request } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "../error.js";
import { reset } from "../db/queries/users.js";

export async function handlerAdminMetrics(_: Request, res: Response) {
  const html = `
  <html>
    <body>
      <h1>Welcome, Chirpy Admin</h1>
      <p>Chirpy has been visited ${config.api.fileserverHits.toString(10)} times!</p>
    </body>
  </html>
  `;

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(html.trim());
  res.end();
}

export async function handlerAdminReset(req: Request, res: Response) {
  if (config.api.platform !== "dev") {
    console.log(config.api.platform);
    throw new ForbiddenError(`${req.url} is allowed in dev env`);
  }

  await reset();
  config.api.fileserverHits = 0;
  res.status(200).end();
}
