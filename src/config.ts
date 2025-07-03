import { env } from "node:process";

process.loadEnvFile("../.env");

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

export const config: APIConfig = {
  fileserverHits: 0,
  dbURL: envOrThrow("dbURL")
};

function envOrThrow(key: string) {
  if (!env[key]) {
    throw new Error(`no env: ${key}`);
  }

  return env[key];
}
