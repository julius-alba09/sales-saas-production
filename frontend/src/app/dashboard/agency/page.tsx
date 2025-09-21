'use client'

import { useState } from 'react'
import { 
  UsersIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  PhoneIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
}

function StatCard({ title, value, icon: Icon, change, changeType = 'neutral' }: StatCardProps) {
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
        {change && (
          <div className="mt-3">
            <div className={`text-sm ${changeColor}`}>
              {change}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgencyDashboard() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today')

  // Mock data - would come from API
  const stats = {
    totalSalesReps: 12,
    totalSetters: 8,
    activeUsers: 18,
    totalRevenue: 125000.50,
    totalCalls: timeRange === 'today' ? 150 : timeRange === 'week' ? 980 : 4200,
    totalCloses: timeRange === 'today' ? 12 : timeRange === 'week' ? 78 : 340,
  }

  const topPerformers = [
    { name: 'John Doe', closes: 45, revenue: 15000 },
    { name: 'Jane Smith', closes: 38, revenue: 12500 },
    { name: 'Mike Johnson', closes: 32, revenue: 11000 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agency Dashboard</h1>
              <p className="text-sm text-gray-600">
                Complete overview of your team's performance
              </p>
            </div>
            <div className="flex space-x-2">
              {(['today', 'week', 'month'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    timeRange === range
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Sales Reps"
            value={stats.totalSalesReps}
            icon={UsersIcon}
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={UsersIcon}
            change="+2 this week"
            changeType="increase"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={CurrencyDollarIcon}
            change="+12.5% this month"
            changeType="increase"
          />
          <StatCard
            title="Total Calls"
            value={stats.totalCalls}
            icon={PhoneIcon}
            change="+8.2% vs last period"
            changeType="increase"
          />
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Performance Summary - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Total Calls</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalCalls}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Total Closes</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalCloses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Close Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {((stats.totalCloses / stats.totalCalls) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Top Performers
            </h3>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900 ml-2">
                      {performer.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {performer.closes} closes
                    </div>
                    <div className="text-xs text-gray-500">
                      ${performer.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
              <UsersIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Add Team Member</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
              <CurrencyDollarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Manage Products</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
              <TrophyIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Leaderboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}