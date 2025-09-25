// Health Check Edge Function for Production Monitoring
// This function provides comprehensive health monitoring for your SaaS application

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: ServiceStatus
    auth: ServiceStatus
    storage: ServiceStatus
    functions: ServiceStatus
  }
  metrics: {
    response_time_ms: number
    total_workspaces: number
    active_users_24h: number
    total_api_calls_24h: number
  }
  environment: string
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  response_time_ms?: number
  error?: string
  last_check: string
}

serve(async (req: Request) => {
  const startTime = Date.now()
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const healthCheck: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: Deno.env.get('APP_VERSION') ?? '1.0.0',
      services: {
        database: await checkDatabase(supabase),
        auth: await checkAuth(supabase),
        storage: await checkStorage(supabase),
        functions: await checkFunctions(supabase)
      },
      metrics: await getMetrics(supabase),
      environment: Deno.env.get('ENVIRONMENT') ?? 'development'
    }

    // Determine overall health status
    const serviceStatuses = Object.values(healthCheck.services).map(s => s.status)
    if (serviceStatuses.includes('unhealthy')) {
      healthCheck.status = 'unhealthy'
    } else if (serviceStatuses.includes('degraded')) {
      healthCheck.status = 'degraded'
    }

    healthCheck.metrics.response_time_ms = Date.now() - startTime

    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503

    return new Response(JSON.stringify(healthCheck, null, 2), {
      status: httpStatus,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    const errorResponse: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: Deno.env.get('APP_VERSION') ?? '1.0.0',
      services: {
        database: { status: 'unhealthy', error: error.message, last_check: new Date().toISOString() },
        auth: { status: 'unhealthy', error: 'Not checked due to database error', last_check: new Date().toISOString() },
        storage: { status: 'unhealthy', error: 'Not checked due to database error', last_check: new Date().toISOString() },
        functions: { status: 'unhealthy', error: 'Not checked due to database error', last_check: new Date().toISOString() }
      },
      metrics: {
        response_time_ms: Date.now() - startTime,
        total_workspaces: 0,
        active_users_24h: 0,
        total_api_calls_24h: 0
      },
      environment: Deno.env.get('ENVIRONMENT') ?? 'development'
    }

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 503,
      headers: corsHeaders
    })
  }
})

async function checkDatabase(supabase: any): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('count')
      .limit(1)

    if (error) throw error

    return {
      status: 'healthy',
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  }
}

async function checkAuth(supabase: any): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    // Try to get current user (should work with service role)
    const { data, error } = await supabase.auth.getUser()
    
    // Auth is working if we get a response (even if no user)
    return {
      status: 'healthy',
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  }
}

async function checkStorage(supabase: any): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    // Try to list buckets
    const { data, error } = await supabase.storage.listBuckets()
    
    if (error) throw error

    return {
      status: 'healthy',
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'degraded', // Storage issues shouldn't fail the whole app
      error: error.message,
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  }
}

async function checkFunctions(supabase: any): Promise<ServiceStatus> {
  const startTime = Date.now()
  
  try {
    // Test a simple RPC function
    const { data, error } = await supabase.rpc('has_workspace_permission', {
      workspace_uuid: '00000000-0000-0000-0000-000000000000', // Dummy UUID
      required_role: 'member'
    })
    
    // Function executed (even if it returns false/error, the function system works)
    return {
      status: 'healthy',
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'degraded',
      error: error.message,
      response_time_ms: Date.now() - startTime,
      last_check: new Date().toISOString()
    }
  }
}

async function getMetrics(supabase: any) {
  try {
    // Get total workspaces
    const { count: workspaceCount } = await supabase
      .from('workspaces')
      .select('*', { count: 'exact', head: true })

    // Get active users in last 24 hours
    const { count: activeUsersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // Get API calls from audit logs (proxy for API usage)
    const { count: apiCallsCount } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    return {
      response_time_ms: 0, // Will be set by caller
      total_workspaces: workspaceCount || 0,
      active_users_24h: activeUsersCount || 0,
      total_api_calls_24h: apiCallsCount || 0
    }
  } catch (error) {
    console.error('Error getting metrics:', error)
    return {
      response_time_ms: 0,
      total_workspaces: 0,
      active_users_24h: 0,
      total_api_calls_24h: 0
    }
  }
}