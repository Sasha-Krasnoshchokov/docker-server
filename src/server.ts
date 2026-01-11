import app from "./app.js";
import { env } from "./config/env.js";

const { PORT, NODE_ENV } = env;

const server = app.listen(PORT, "0.0.0.0", () => {
  const info =
    NODE_ENV === "development"
      ? `🚀 Server running in ${NODE_ENV} mode`
      : "🚀 Server live";
  console.info(`${info} on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = () => {
  console.info("Stopping server...");

  server.close(() => {
    // await db.disconnect();
    // await redis.quit();
    // await queue.close();
    console.info("Server stopped.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
