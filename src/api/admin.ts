import type { Response, Request } from "express";
import { config } from "../config.js";

export async function handlerAdminMetrics(_: Request, res: Response) {
  const html = `
  <html>
    <body>
      <h1>Welcome, Chirpy Admin</h1>
      <p>Chirpy has been visited ${config.fileserverHits.toString(10)} times!</p>
    </body>
  </html>
  `;

  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(html.trim());
}

export async function handlerAdminReset(_: Request, res: Response) {
  config.fileserverHits = 0;
  res.status(200).end();
}
