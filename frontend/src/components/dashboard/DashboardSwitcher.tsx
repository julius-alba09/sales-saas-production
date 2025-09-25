'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Building2, UserCheck, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

interface TeamMember {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  role: 'sales_rep' | 'setter' | 'manager'
  avatar?: string
}

interface DashboardSwitcherProps {
  viewingMember?: TeamMember | null
  onBackToAgency?: () => void
  children: React.ReactNode
}

export function DashboardSwitcher({ 
  viewingMember, 
  onBackToAgency, 
  children 
}: DashboardSwitcherProps) {
  const { profile } = useAuth()
  const router = useRouter()

  // Only managers can switch dashboards
  if (profile?.role !== 'manager') {
    return <>{children}</>
  }

  const handleBackToAgency = () => {
    if (onBackToAgency) {
      onBackToAgency()
    } else {
      router.push('/dashboard/agency')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager':
        return Building2
      case 'sales_rep':
        return UserCheck
      case 'setter':
        return Phone
      default:
        return UserCheck
    }
  }

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'manager':
        return 'Manager'
      case 'sales_rep':
        return 'Sales Rep'
      case 'setter':
        return 'Appointment Setter'
      default:
        return 'Team Member'
    }
  }

  return (
    <div>
      {viewingMember && (
        <div className=\"bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-200 dark:border-indigo-800 px-6 py-4\">
          <div className=\"container mx-auto flex items-center justify-between\">
            <div className=\"flex items-center gap-4\">
              <Button
                variant=\"ghost\"
                size=\"sm\"
                onClick={handleBackToAgency}
                className=\"text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300\"
              >
                <ArrowLeft className=\"w-4 h-4 mr-2\" />
                Back to Agency Dashboard
              </Button>
              
              <div className=\"h-6 w-px bg-indigo-200 dark:bg-indigo-700\" />
              
              <div className="flex items-center gap-3">
                {viewingMember.avatar ? (
                  <img 
                    src={viewingMember.avatar} 
                    alt={viewingMember.name}
                    className="w-8 h-8 rounded-full object-cover border border-indigo-200 dark:border-indigo-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs border border-indigo-200 dark:border-indigo-700">
                    {viewingMember.firstName[0]}{viewingMember.lastName[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {viewingMember.name}'s Dashboard
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {getRoleTitle(viewingMember.role)} • {viewingMember.email}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
              {(() => {
                const Icon = getRoleIcon(viewingMember.role)
                return <Icon className="w-4 h-4" />
              })()}
              <span className="font-medium">Manager View</span>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  )
}
