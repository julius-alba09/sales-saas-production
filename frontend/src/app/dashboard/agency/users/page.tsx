'use client'

import UserManagement from '@/components/admin/UserManagement'
import { Navigation } from '@/components/navigation/Navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function UsersPage() {
  return (
    <ProtectedRoute requireRole="manager">
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/dashboard/agency' },
              { label: 'User Management', href: '/dashboard/agency/users' }
            ]} 
          />
          
          <div className="mt-8">
            <UserManagement />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}