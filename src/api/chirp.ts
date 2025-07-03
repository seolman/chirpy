import {  Request, Response } from "express";
import { BadRequestError } from "../error.js";


export async function handlerValidateChrip(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const param: parameters = req.body;

  const maxChirpLength = 140;
  if (param.body.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
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
