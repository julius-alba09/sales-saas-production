import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'
import logger from './utils/logger'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import dashboardRoutes from './routes/dashboard'
import metricsRoutes from './routes/metrics'
import reportsRoutes from './routes/reports'
import productsRoutes from './routes/products'
import analyticsRoutes from './routes/analytics'
import goalsRoutes from './routes/goals'
import notificationsRoutes from './routes/notifications'
import questionsRoutes from './routes/questions'
import organizationRoutes from './routes/organization'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan(process.env.LOG_FORMAT || 'combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(limiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/metrics', metricsRoutes)
app.use('/api/v1/reports', reportsRoutes)
app.use('/api/v1/products', productsRoutes)
app.use('/api/v1/analytics', analyticsRoutes)
app.use('/api/v1/goals', goalsRoutes)
app.use('/api/v1/notifications', notificationsRoutes)
app.use('/api/v1/questions', questionsRoutes)
app.use('/api/v1/organization', organizationRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV}`)
})

export default app