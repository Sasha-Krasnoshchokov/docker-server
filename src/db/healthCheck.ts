import { Pool } from "pg";
import {pool} from "./config";

export const healthCheck = async (): Promise<boolean> => {

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};
