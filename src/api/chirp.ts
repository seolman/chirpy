import { Request, Response } from "express";

export async function handlerValidateChrip(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const param: parameters = req.body;

  const maxChirpLength = 140;
  if (param.body.length > maxChirpLength) {
    res.header("Content-Type", "application/json");
    res.status(400).send(JSON.stringify({ error: "Chirp is too long" }));
    res.end();
    return;
  }

  const badWords = [
    "kerfuffle",
    "sharbert",
    "fornax",
  ];
  const cleanedBody = param.body
    .split(" ")
    .map((word) => {
      const lower = word.toLocaleLowerCase();
      if (badWords.includes(lower)) {
        return "****";
      }
      return word
    })
    .join(" ");

  res.set("Content-Type", "application/json");
  res.status(200).send(JSON.stringify({ cleanedBody }));
  res.end();
}
