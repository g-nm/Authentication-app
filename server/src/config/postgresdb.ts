import { Pool } from 'pg';

const postgresPool = new Pool({
  user: 'gnm',
  host: 'localhost',
  port: 5432,
  database: 'authdb',
  password: 'gnm',
  max: 20,
});

export default postgresPool;
