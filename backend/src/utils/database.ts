import { Pool } from 'pg'
import logger from './logger'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Test database connection
pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  logger.error('Database connection error:', err)
  process.exit(1)
})

export { pool }