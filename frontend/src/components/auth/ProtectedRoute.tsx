'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('manager' | 'sales_rep' | 'setter')[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    // Not authenticated
    if (!user || !profile) {
      router.push(redirectTo)
      return
    }

    // Check role permissions
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
      // Redirect to appropriate dashboard based on user's actual role
      switch (profile.role) {
        case 'manager':
          router.push('/dashboard/agency')
          break
        case 'sales_rep':
          router.push('/dashboard/sales-rep')
          break
        case 'setter':
          router.push('/dashboard/setter')
          break
        default:
          router.push('/dashboard')
      }
      return
    }

    // User is authenticated and authorized
    setIsAuthorized(true)
  }, [user, profile, loading, router, allowedRoles, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">
          <span className="text-lg font-medium">Redirecting...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}