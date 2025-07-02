import { Request, Response } from "express";

export async function handlerValidateChrip(req: Request, res: Response) {
  type params = {
    body: string;
  };

  let parsedBody: params = req.body;

  const maxChirpLength = 140;
  if (parsedBody.body.length > maxChirpLength) {
    res.header("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
    res.end();
    return;
  }

  res.set("Content-Type", "application/json");
  res.status(200).send(JSON.stringify({ valid: true }));
  res.end();
}
