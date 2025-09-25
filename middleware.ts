import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define role-based access for different routes
const ROUTE_PERMISSIONS = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/api/auth',
  ],
  
  // Protected routes (authentication required)
  protected: [
    '/dashboard',
    '/profile',
    '/settings',
    '/api/profile',
    '/api/organization',
    '/api/upload',
  ],
  
  // Manager/Owner only routes
  manager: [
    '/admin',
    '/team',
    '/analytics',
    '/api/admin',
    '/api/team',
    '/api/products',
    '/api/analytics',
  ],
  
  // API routes that need special handling
  api: [
    '/api/',
  ]
}

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/auth': { max: 5, window: 15 * 60 * 1000 }, // 5 per 15 minutes
  '/api/upload': { max: 10, window: 60 * 60 * 1000 }, // 10 per hour
  '/api/': { max: 100, window: 15 * 60 * 1000 }, // 100 per 15 minutes (default)
}

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, limit: { max: number; window: number }): boolean {
  const now = Date.now()
  const key = identifier
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.window })
    return true
  }
  
  if (current.count >= limit.max) {
    return false
  }
  
  current.count += 1
  return true
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route.endsWith('/')) {
      return pathname.startsWith(route)
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { pathname } = request.nextUrl
  
  // Get client IP for rate limiting
  const clientIP = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  
  // Apply rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitKey = Object.keys(RATE_LIMITS).find(key => pathname.startsWith(key))
    const limit = rateLimitKey ? RATE_LIMITS[rateLimitKey] : RATE_LIMITS['/api/']
    
    const identifier = `${clientIP}:${pathname.split('/').slice(0, 3).join('/')}`
    
    if (!checkRateLimit(identifier, limit)) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil(limit.window / 1000)),
            'X-RateLimit-Limit': String(limit.max),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Add CSRF protection header
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    const allowedOrigins = [
      `http://${host}`,
      `https://${host}`,
      'http://localhost:3000',
      'https://localhost:3000',
    ]
    
    if (origin && !allowedOrigins.includes(origin)) {
      return new NextResponse('CSRF validation failed', { status: 403 })
    }
  }

  // Skip auth check for public routes
  if (matchesRoute(pathname, ROUTE_PERMISSIONS.public)) {
    return response
  }

  // Get the session
  const { data: { session }, error } = await supabase.auth.getSession()

  // Redirect to login if no session for protected routes
  if (!session) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For manager-only routes, check user role
  if (matchesRoute(pathname, ROUTE_PERMISSIONS.manager)) {
    try {
      const { data: workspaceMember } = await supabase
        .from('workspace_members')
        .select('role, is_active, workspace:workspaces(id, name)')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()

      if (!workspaceMember || !['owner', 'admin'].includes(workspaceMember.role)) {
        // Redirect to dashboard if not authorized
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Add user context to request headers for API routes
      if (pathname.startsWith('/api/')) {
        response.headers.set('X-User-ID', session.user.id)
        response.headers.set('X-User-Role', workspaceMember.role)
        response.headers.set('X-Workspace-ID', workspaceMember.workspace.id)
      }
    } catch (error) {
      console.error('Error checking user permissions:', error)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Add user context for all authenticated API requests
  if (pathname.startsWith('/api/') && session) {
    response.headers.set('X-User-ID', session.user.id)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}