import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Pool } from 'pg'

import { pool } from '../utils/database'
import logger from '../utils/logger'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    organizationId: string
    email: string
    role: 'manager' | 'sales_rep' | 'appointment_setter'
  }
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: 'Authorization header required',
      })
      return
    }

    const token = authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token required',
      })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Get user from database
    const result = await pool.query(
      'SELECT id, organization_id, email, role, is_active FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      })
      return
    }

    const user = result.rows[0]

    if (!user.is_active) {
      res.status(401).json({
        success: false,
        error: 'Account deactivated',
      })
      return
    }

    req.user = {
      id: user.id,
      organizationId: user.organization_id,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
      })
      return
    }

    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      })
      return
    }

    next()
  }
}