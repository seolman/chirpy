import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware/log.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import { handlerAdminMetrics, handlerAdminReset } from "./api/admin.js";
import { handlerCreateChirps, handlerDeleteChirpById, handlerGetAllChirps, handlerGetChirpById } from "./api/chirp.js";
import { middlewareError } from "./middleware/error.js";
import { config } from "./config.js";
import { handlerRefresh, handlerRevoke, handlerLogin, handlerUsersCreate, handlerUsersUpdate, handlerUserUpdateToRed } from "./api/user.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = config.api.port;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerGetChirpById(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerCreateChirps(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerDeleteChirpById(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsersUpdate(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerUserUpdateToRed(req, res)).catch(next);
});

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerAdminMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerAdminReset(req, res)).catch(next);
});

app.use(middlewareError);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

