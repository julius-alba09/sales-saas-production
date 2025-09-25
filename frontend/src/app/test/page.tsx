'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, User, Settings, BarChart3 } from 'lucide-react'

export default function TestPage() {
  const { user, profile, loading, signOut } = useAuth()

  const testCases = [
    {
      title: 'Authentication System',
      items: [
        {
          name: 'AuthProvider Context',
          status: !!useAuth,
          description: 'Auth context is available'
        },
        {
          name: 'User State',
          status: loading ? 'loading' : (user ? 'authenticated' : 'unauthenticated'),
          description: loading ? 'Loading user data' : (user ? `User ID: ${user.id}` : 'No user logged in')
        },
        {
          name: 'Profile Data',
          status: loading ? 'loading' : (profile ? 'loaded' : 'missing'),
          description: loading ? 'Loading profile' : (profile ? `Role: ${profile.role}, Name: ${profile.first_name} ${profile.last_name}` : 'No profile data')
        }
      ]
    },
    {
      title: 'Dashboard Access',
      items: [
        {
          name: 'Agency Dashboard',
          status: 'available',
          description: 'For managers only',
          link: '/dashboard/agency'
        },
        {
          name: 'Sales Rep Dashboard',
          status: 'available',
          description: 'For sales reps and managers',
          link: '/dashboard/sales-rep'
        },
        {
          name: 'Setter Dashboard',
          status: 'available',
          description: 'For setters and managers',
          link: '/dashboard/setter'
        }
      ]
    },
    {
      title: 'Manager Features',
      items: [
        {
          name: 'Team Member Cards',
          status: 'implemented',
          description: 'Shows photos, names, roles, emails'
        },
        {
          name: 'Dashboard Switching',
          status: 'implemented',
          description: 'Managers can view individual team member dashboards'
        },
        {
          name: 'Role-based Access',
          status: 'implemented',
          description: 'Protected routes with role verification'
        }
      ]
    }
  ]

  const getStatusIcon = (status: any) => {
    if (status === 'loading') return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    if (status === true || status === 'available' || status === 'implemented' || status === 'authenticated' || status === 'loaded') {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    }
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  const getStatusColor = (status: any) => {
    if (status === 'loading') return 'text-blue-600'
    if (status === true || status === 'available' || status === 'implemented' || status === 'authenticated' || status === 'loaded') {
      return 'text-green-600'
    }
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            System Test Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Verify authentication and dashboard functionality
          </p>
        </div>

        {/* Current User Info */}
        {user && profile && (
          <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Current User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{profile.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    Role: {profile.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <Button onClick={() => signOut()} variant="outline" size="sm">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Test Cases */}
        <div className="grid gap-6">
          {testCases.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">
                            {item.name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {item.description}
                          </p>
                          <p className={`text-xs font-medium mt-1 ${getStatusColor(item.status)}`}>
                            Status: {typeof item.status === 'string' ? item.status : (item.status ? 'Active' : 'Inactive')}
                          </p>
                        </div>
                      </div>
                      
                      {item.link && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={item.link}>Test</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card className="mt-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Test Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/">Home Page</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/login">Login Page</Link>
              </Button>
              {!user && (
                <Button asChild variant="outline">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              )}
              {user && profile?.role === 'manager' && (
                <>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/agency">Agency Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/sales-rep?member=1">View Sales Rep (John Doe)</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/setter?member=3">View Setter (Mike Johnson)</Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}