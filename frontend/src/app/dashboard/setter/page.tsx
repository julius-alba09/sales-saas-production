'use client'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function SetterDashboard() {
  return (
    <ProtectedRoute allowedRoles={['setter']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Setter Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Dashboard is being updated. Please check back soon.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}