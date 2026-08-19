import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { notFound } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend funcionando correctamente",
  });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
