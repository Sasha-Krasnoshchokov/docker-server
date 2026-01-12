import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.string().transform(Number).default(3000),
  API_PREFIX: z.string().default("/api/v1"),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
