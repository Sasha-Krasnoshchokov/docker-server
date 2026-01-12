import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { healthCheck } from "./db/healthCheck";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  console.info(`Request from ${req.host}`);
  res.status(200).json({ status: "OK", message: "Server Healthy", uptime: process.uptime() });
});
app.get("/health-db", async (req, res) => {
  console.info(`Request from ${req.host}`);
  const dbHealthy = await healthCheck();
  if (!dbHealthy) {
    res.status(500).json({ status: "", message: "Database Unhealthy", uptime: process.uptime()});
    throw new Error("Database Unhealthy");
  }
  res.status(200).json({ status: "OK", message: "Database Healthy", uptime: process.uptime() });
});

// Centralized Error Handler (Must be last)
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const status = err.status || 500;
    res.status(status).json({
      error: {
        message: err.message || "Internal Server Error",
        ...(env.NODE_ENV === "development" && { stack: err.stack }),
      },
    });
  }
);

export default app;
