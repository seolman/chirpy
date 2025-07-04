import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../error.js";
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import type { Chirp } from "../db/schema.js";


export async function handlerCreateChirps(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;

  if (!params.userId) {
    throw new BadRequestError("Chirp need user id");
  }
  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
  }

  const badWords = [
    "kerfuffle",
    "sharbert",
    "fornax",
  ];
  const cleanedBody = params.body
    .split(" ")
    .map((word) => {
      const lower = word.toLocaleLowerCase();
      if (badWords.includes(lower)) {
        return "****";
      }
      return word
    })
    .join(" ");

  const newParams: parameters = {
    body: cleanedBody,
    userId: params.userId
  };

  const chirp = await createChirp(newParams);

  res.set("Content-Type", "application/json");
  res.status(201).send(JSON.stringify({
    id: chirp.id,
    createdAt: chirp.createdAt,
    updatedAt: chirp.updatedAt,
    body: chirp.body,
    userId: chirp.userId
  } as Chirp));
}

export async function handlerGetAllChirps(req: Request, res: Response) {
  const chirps = await getAllChirps();
  res.header("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify(chirps));
}

export async function handlerGetChirpById(req: Request, res: Response) {
  const chirpId = req.params.chirpId;
  const chirp = await getChirpById(chirpId);

  if (!chirp) {
    throw new NotFoundError("chirp not found");
  }

  res.header("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(JSON.stringify(chirp));
}
