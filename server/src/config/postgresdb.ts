import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({});

const connectionString = process.env.DATABASE_URL;

const ssl =
  process.env.NODE_ENV === 'PRODUCTION'
    ? { rejectUnauthorized: false }
    : undefined;

const postgresPool = new Pool({ connectionString, ssl });

export default postgresPool;
