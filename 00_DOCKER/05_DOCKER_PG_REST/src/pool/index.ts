import { Pool, PoolConfig } from "pg";

const options = {
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT as any),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number.parseInt(process.env.DB_CONNECTION_LIMIT as any),
} as PoolConfig;

export const pool = new Pool(options);
