import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware/log.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import { handlerAdminMetrics, handlerAdminReset } from "./api/admin.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerAdminMetrics);
app.post("/admin/reset", handlerAdminReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

