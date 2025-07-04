import type { MigrationConfig } from "drizzle-orm/migrator";
import { env } from "node:process";

process.loadEnvFile();

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: string;
  jwtSecret: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
    jwtSecret: envOrThrow("JWT_SECRET")
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "./src/db/migrations"
    }
  }
};

function envOrThrow(key: string) {
  if (!env[key]) {
    throw new Error(`no env: ${key}`);
  }

  return env[key];
}
