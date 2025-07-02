import { Request, Response } from "express";

export async function handlerValidateChrip(req: Request, res: Response) {
  type params = {
    body: string;
  };

  let body = "";
  
  req.on("data", (chunk) => {
    body += chunk;
  });

  let parsedBody: params;
  req.on("end", () => {
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      res.header("Content-Type", "application/json");
      res.status(400).send(JSON.stringify({ error: "Invalid JSON" }));
      res.end();
      return;
    }

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
  });
}
