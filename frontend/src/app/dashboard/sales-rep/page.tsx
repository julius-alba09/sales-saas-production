'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  PhoneIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Navigation } from '@/components/navigation/Navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { DashboardSwitcher } from '@/components/dashboard/DashboardSwitcher'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
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

export default function SalesRepDashboard() {
  const searchParams = useSearchParams()
  const { profile } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null)

  // Check if manager is viewing specific team member
  useEffect(() => {
    const memberId = searchParams?.get('member')
    if (memberId && profile?.role === 'manager') {
      // In a real app, you would fetch the member data from the API
      // For now, using mock data
      const mockMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          role: 'sales_rep',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: '4',
          name: 'Sarah Williams',
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@company.com',
          role: 'sales_rep',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
      ]
      
      const member = mockMembers.find(m => m.id === memberId)
      setViewingMember(member || null)
    }
  }, [searchParams, profile])

  // Mock data - would come from API
  const todayMetrics = {
    scheduledCalls: 8,
    liveCalls: 6,
    offersDelivered: 4,
    closes: 2,
    revenue: 8500.00
  }

  const weeklyGoals = {
    callsTarget: 50,
    closesTarget: 15,
    revenueTarget: 45000,
    currentCalls: 32,
    currentCloses: 12,
    currentRevenue: 38500
  }

  const eodSubmitted = false

  return (
    <ProtectedRoute allowedRoles={['sales_rep', 'manager']}>
      <DashboardSwitcher viewingMember={viewingMember}>
        <div className="min-h-screen">
          {/* Navigation */}
          <Navigation />

      {/* Background */}
      <div className="absolute inset-0 top-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-100/50 dark:from-slate-950/50 dark:via-slate-900/30 dark:to-slate-800/50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Dashboard Header */}
      <div className="relative z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sales Rep Dashboard</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Track your personal performance and goals
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Submit EOD Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <Breadcrumb />
        {/* Today's Performance */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Scheduled Calls
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.scheduledCalls}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Live Calls
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.liveCalls}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600">
                  Show Rate: {((todayMetrics.liveCalls / todayMetrics.scheduledCalls) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Offers Made
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.offersDelivered}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600">
                  Offer Rate: {((todayMetrics.offersDelivered / todayMetrics.liveCalls) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckBadgeIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Closes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {todayMetrics.closes}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-green-600">
                  Close Rate: {((todayMetrics.closes / todayMetrics.liveCalls) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Revenue
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${todayMetrics.revenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-gray-600">
                  Per Call: ${(todayMetrics.revenue / todayMetrics.liveCalls).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Goals Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Goals Progress</h3>
            <div className="space-y-6">
              {/* Calls Goal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Calls</span>
                  <span className="text-sm text-gray-600">
                    {weeklyGoals.currentCalls} / {weeklyGoals.callsTarget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(weeklyGoals.currentCalls / weeklyGoals.callsTarget) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {((weeklyGoals.currentCalls / weeklyGoals.callsTarget) * 100).toFixed(0)}% complete
                </div>
              </div>

              {/* Closes Goal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Closes</span>
                  <span className="text-sm text-gray-600">
                    {weeklyGoals.currentCloses} / {weeklyGoals.closesTarget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(weeklyGoals.currentCloses / weeklyGoals.closesTarget) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {((weeklyGoals.currentCloses / weeklyGoals.closesTarget) * 100).toFixed(0)}% complete
                </div>
              </div>

              {/* Revenue Goal */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Revenue</span>
                  <span className="text-sm text-gray-600">
                    ${weeklyGoals.currentRevenue.toLocaleString()} / ${weeklyGoals.revenueTarget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(weeklyGoals.currentRevenue / weeklyGoals.revenueTarget) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {((weeklyGoals.currentRevenue / weeklyGoals.revenueTarget) * 100).toFixed(0)}% complete
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Tasks</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                eodSubmitted ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className={`h-5 w-5 mr-2 ${
                      eodSubmitted ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      eodSubmitted ? 'text-green-800' : 'text-red-800'
                    }`}>
                      EOD Report
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    eodSubmitted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {eodSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>
                {!eodSubmitted && (
                  <p className="text-xs text-red-600 mt-2">
                    Don't forget to submit your end of day report!
                  </p>
                )}
              </div>

              <div className="p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    Update Pipeline
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    Log Call Notes
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    Schedule Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <CheckBadgeIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Closed deal</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Weight Loss Program - $4,500
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <PhoneIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Made offer</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          John Smith - Nutrition Coaching
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                        <CalendarIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Scheduled call</span>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Follow-up with Sarah Johnson
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </DashboardSwitcher>
    </ProtectedRoute>
  )
}
