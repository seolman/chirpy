import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "../error.js";
import { createChirp, deleteChirpById, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import type { Chirp } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";


export async function handlerCreateChirps(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const { body } = req.body as parameters;
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
  }

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.jwtSecret);

  const badWords = [
    "kerfuffle",
    "sharbert",
    "fornax",
  ];
  const cleanedBody = body
    .split(" ")
    .map((word) => {
      const lower = word.toLocaleLowerCase();
      if (badWords.includes(lower)) {
        return "****";
      }
      return word
    })
    .join(" ");

  const newParams = {
    body: cleanedBody,
    userId
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

export async function handlerDeleteChirpById(req: Request, res: Response) {
  const chirpId = req.params.chirpId;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.jwtSecret);
  
  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    throw new NotFoundError("no chirps");
  }
  if (chirp.userId !== userId) {
    throw new ForbiddenError("you can not delete this chirps")
  }

  await deleteChirpById(chirpId);
  res.status(204).send();
}
