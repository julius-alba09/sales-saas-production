import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { validateInput, sanitizeObject } from './validation'

// Error classes
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public validationErrors?: z.ZodError) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

// Logging utility
export interface LogContext {
  userId?: string
  workspaceId?: string
  action: string
  resource?: string
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
}

export function logSecurityEvent(context: LogContext, level: 'info' | 'warn' | 'error' = 'info') {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    type: 'SECURITY',
    ...context,
  }
  
  // In production, send to proper logging service
  console.log(`[SECURITY] ${timestamp}:`, logEntry)
}

// Request validation wrapper
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json()
      const sanitizedBody = sanitizeObject(body)
      const validation = validateInput(schema, sanitizedBody)
      
      if (!validation.success) {
        logSecurityEvent({
          action: 'VALIDATION_FAILED',
          resource: req.nextUrl.pathname,
          metadata: { errors: validation.errors.issues },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'warn')
        
        throw new ValidationError('Invalid input data', validation.errors)
      }
      
      return await handler(validation.data, req)
    } catch (error) {
      return handleAPIError(error, req)
    }
  }
}

// Authentication wrapper
export function withAuth(
  handler: (req: NextRequest, user: any, supabase: any) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        logSecurityEvent({
          action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          resource: req.nextUrl.pathname,
          metadata: { error: error?.message },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'warn')
        
        throw new APIError('Unauthorized', 401, 'UNAUTHORIZED')
      }
      
      return await handler(req, user, supabase)
    } catch (error) {
      return handleAPIError(error, req)
    }
  }
}

// Role-based authorization wrapper
export function withRoleAuth(
  allowedRoles: string[],
  handler: (req: NextRequest, user: any, workspaceMember: any, supabase: any) => Promise<NextResponse>
) {
  return withAuth(async (req: NextRequest, user: any, supabase: any) => {
    try {
      // Get workspace member info
      const { data: workspaceMember, error } = await supabase
        .from('workspace_members')
        .select(`
          role,
          is_active,
          workspace:workspaces(id, name, is_active)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()
      
      if (error || !workspaceMember) {
        logSecurityEvent({
          userId: user.id,
          action: 'WORKSPACE_ACCESS_DENIED',
          resource: req.nextUrl.pathname,
          metadata: { error: error?.message },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'warn')
        
        throw new AuthorizationError('No active workspace membership found')
      }
      
      if (!allowedRoles.includes(workspaceMember.role)) {
        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'ROLE_ACCESS_DENIED',
          resource: req.nextUrl.pathname,
          metadata: { userRole: workspaceMember.role, requiredRoles: allowedRoles },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'warn')
        
        throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
      }
      
      if (!workspaceMember.workspace.is_active) {
        throw new APIError('Workspace is inactive', 403, 'WORKSPACE_INACTIVE')
      }
      
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'AUTHORIZED_ACCESS',
        resource: req.nextUrl.pathname,
        metadata: { role: workspaceMember.role },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'info')
      
      return await handler(req, user, workspaceMember, supabase)
    } catch (error) {
      return handleAPIError(error, req)
    }
  })
}

// Error handler
export function handleAPIError(error: unknown, req?: NextRequest): NextResponse {
  let statusCode = 500
  let message = 'Internal server error'
  let code = 'INTERNAL_ERROR'
  let details: any = undefined
  
  if (error instanceof APIError) {
    statusCode = error.statusCode
    message = error.message
    code = error.code || 'API_ERROR'
    
    if (error instanceof ValidationError && error.validationErrors) {
      details = {
        validation: error.validationErrors.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
      }
    }
  } else if (error instanceof Error) {
    message = error.message
    
    // Log unexpected errors
    console.error('Unexpected API error:', error)
    if (req) {
      logSecurityEvent({
        action: 'UNEXPECTED_ERROR',
        resource: req.nextUrl.pathname,
        metadata: { error: error.message, stack: error.stack },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
    }
  }
  
  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error'
    details = undefined
  }
  
  return NextResponse.json(
    {
      error: message,
      code,
      ...(details && { details }),
    },
    { status: statusCode }
  )
}

// Success response helper
export function successResponse(data?: any, message?: string, status: number = 200): NextResponse {
  return NextResponse.json({
    success: true,
    ...(data && { data }),
    ...(message && { message }),
  }, { status })
}

// Pagination helper
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function parsePaginationParams(searchParams: URLSearchParams): PaginationParams {
  return {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20'))),
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc'),
  }
}

// Database query helper with proper error handling
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string = 'Database query failed'
): Promise<T> {
  const { data, error } = await queryFn()
  
  if (error) {
    console.error('Database error:', error)
    throw new APIError(errorMessage, 500, 'DATABASE_ERROR')
  }
  
  if (data === null) {
    throw new APIError('Resource not found', 404, 'NOT_FOUND')
  }
  
  return data
}