// Production-ready logging system with structured logging
import { z } from 'zod'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogContext {
  userId?: string
  workspaceId?: string
  action: string
  resource?: string
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
  sessionId?: string
  requestId?: string
  duration?: number
  error?: Error
}

export interface LogEntry extends LogContext {
  timestamp: string
  level: LogLevel
  message: string
  environment: string
  service: string
  version: string
}

// Log level hierarchy
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
}

class Logger {
  private minLevel: LogLevel
  private service: string
  private version: string
  private environment: string

  constructor() {
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'
    this.service = 'sales-saas-api'
    this.version = process.env.npm_package_version || '1.0.0'
    this.environment = process.env.NODE_ENV || 'development'
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel]
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: this.environment,
      service: this.service,
      version: this.version,
      ...context,
    }
  }

  private formatError(error: Error): Record<string, any> {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }

  private output(entry: LogEntry): void {
    if (this.environment === 'development') {
      // Pretty print for development
      const emoji = {
        debug: '🐛',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        fatal: '💀',
      }
      
      console.log(`${emoji[entry.level]} [${entry.level.toUpperCase()}] ${entry.message}`)
      if (entry.metadata) {
        console.log('  Metadata:', entry.metadata)
      }
      if (entry.error) {
        console.error('  Error:', this.formatError(entry.error))
      }
    } else {
      // Structured JSON for production
      const logData = {
        ...entry,
        ...(entry.error && { error: this.formatError(entry.error) }),
      }
      console.log(JSON.stringify(logData))
    }

    // In production, you would send to external logging service
    if (this.environment === 'production' && LOG_LEVELS[entry.level] >= LOG_LEVELS.error) {
      this.sendToExternalLogger(entry)
    }
  }

  private async sendToExternalLogger(entry: LogEntry): Promise<void> {
    // Implementation for external logging services (Sentry, DataDog, etc.)
    // This is a placeholder - implement based on your chosen service
    try {
      // Example: Send to Sentry, LogRocket, or other service
      if (process.env.SENTRY_DSN) {
        // Sentry integration would go here
      }
    } catch (error) {
      // Fallback to console if external logging fails
      console.error('Failed to send log to external service:', error)
    }
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return
    this.output(this.createLogEntry('debug', message, context))
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return
    this.output(this.createLogEntry('info', message, context))
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return
    this.output(this.createLogEntry('warn', message, context))
  }

  error(message: string, context?: LogContext): void {
    if (!this.shouldLog('error')) return
    this.output(this.createLogEntry('error', message, context))
  }

  fatal(message: string, context?: LogContext): void {
    if (!this.shouldLog('fatal')) return
    this.output(this.createLogEntry('fatal', message, context))
  }

  // Specialized logging methods for common scenarios
  security(message: string, context: LogContext, level: LogLevel = 'warn'): void {
    this[level](`[SECURITY] ${message}`, {
      ...context,
      type: 'SECURITY_EVENT',
    })
  }

  audit(message: string, context: LogContext): void {
    this.info(`[AUDIT] ${message}`, {
      ...context,
      type: 'AUDIT_EVENT',
    })
  }

  performance(message: string, duration: number, context?: LogContext): void {
    const level: LogLevel = duration > 1000 ? 'warn' : duration > 500 ? 'info' : 'debug'
    this[level](`[PERFORMANCE] ${message}`, {
      ...context,
      duration,
      type: 'PERFORMANCE',
    })
  }

  // Create child logger with default context
  child(defaultContext: Partial<LogContext>): Logger {
    const childLogger = Object.create(this)
    const originalOutput = this.output.bind(this)
    
    childLogger.output = (entry: LogEntry) => {
      originalOutput({
        ...entry,
        ...defaultContext,
        metadata: {
          ...defaultContext.metadata,
          ...entry.metadata,
        },
      })
    }
    
    return childLogger
  }
}

// Global logger instance
export const logger = new Logger()

// Request logger with timing
export function createRequestLogger(req: Request): Logger {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()
  
  const requestLogger = logger.child({
    requestId,
    resource: new URL(req.url).pathname,
    method: req.method,
    ip: req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || undefined,
  })

  // Add timing method
  ;(requestLogger as any).timing = (message: string, context?: LogContext) => {
    const duration = Date.now() - startTime
    requestLogger.performance(message, duration, context)
  }

  return requestLogger
}

// Error boundary logger
export function logError(error: Error, context?: LogContext): void {
  logger.error('Unhandled error occurred', {
    ...context,
    error,
    type: 'UNHANDLED_ERROR',
  })
}

// Database query logger
export function logDatabaseQuery(
  query: string,
  duration: number,
  context?: LogContext
): void {
  const level: LogLevel = duration > 100 ? 'warn' : 'debug'
  logger[level]('Database query executed', {
    ...context,
    query: query.substring(0, 200), // Truncate long queries
    duration,
    type: 'DATABASE_QUERY',
  })
}

// API response logger
export function logApiResponse(
  status: number,
  duration: number,
  context?: LogContext
): void {
  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
  logger[level]('API response', {
    ...context,
    status,
    duration,
    type: 'API_RESPONSE',
  })
}