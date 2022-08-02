import { createPool } from "mysql2";

export const pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT as any,
});
