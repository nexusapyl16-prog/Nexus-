import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const db = {
  connect: async () => {
    try {
      const client = await pool.connect();
      console.log('✅ Database connected');
      client.release();
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  },
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};

export default db;
