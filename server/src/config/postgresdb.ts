import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({});

const postgresPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  max: 20,
});

export default postgresPool;
