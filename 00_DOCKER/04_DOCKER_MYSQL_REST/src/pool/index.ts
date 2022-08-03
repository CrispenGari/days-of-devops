import { createPool } from "mysql2";
import { PoolOptions } from "mysql2/typings/mysql";

const options = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT as any),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT as any),
} as PoolOptions;

export const pool = createPool(options);
