'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Phone,
  DollarSign,
  Target,
  TrendingUp,
  Calendar,
  Trophy,
  Clock,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-provider'

interface SalesRepData {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'sales_rep'
  status: 'active' | 'busy' | 'away'
  startDate: string
  stats: {
    totalCalls: number
    liveCalls: number
    closes: number
    revenue: number
    deposits: number
    offersMade: number
    showRate: number
    closeRate: number
    conversionRate: number
  }
  recentActivity: Array<{
    date: string
    calls: number
    offers: number
    closes: number
    revenue: number
    deposits: number
  }>
}

// Mock data - would come from API based on ID
const getSalesRepData = (id: string): SalesRepData => ({
  id,
  name: id === '1' ? 'John Doe' : id === '2' ? 'Jane Smith' : id === '3' ? 'Mike Johnson' : 'Sarah Williams',
  email: `${id === '1' ? 'john.doe' : id === '2' ? 'jane.smith' : id === '3' ? 'mike.johnson' : 'sarah.williams'}@company.com`,
  role: 'sales_rep',
  status: 'active',
  startDate: '2025-01-15',
  stats: {
    totalCalls: id === '1' ? 450 : id === '2' ? 380 : id === '3' ? 320 : 410,
    liveCalls: id === '1' ? 350 : id === '2' ? 300 : id === '3' ? 250 : 330,
    closes: id === '1' ? 45 : id === '2' ? 38 : id === '3' ? 32 : 41,
    revenue: id === '1' ? 150000 : id === '2' ? 125000 : id === '3' ? 110000 : 142000,
    deposits: id === '1' ? 27 : id === '2' ? 23 : id === '3' ? 19 : 25,
    offersMade: id === '1' ? 280 : id === '2' ? 240 : id === '3' ? 200 : 260,
    showRate: id === '1' ? 77.8 : id === '2' ? 78.9 : id === '3' ? 78.1 : 80.5,
    closeRate: id === '1' ? 16.1 : id === '2' ? 15.8 : id === '3' ? 16.0 : 16.6,
    conversionRate: id === '1' ? 12.9 : id === '2' ? 12.7 : id === '3' ? 12.5 : 13.4
  },
  recentActivity: [
    { date: '2025-09-21', calls: 12, offers: 8, closes: 2, revenue: 3200, deposits: 1 },
    { date: '2025-09-20', calls: 15, offers: 10, closes: 3, revenue: 4500, deposits: 2 },
    { date: '2025-09-19', calls: 10, offers: 6, closes: 1, revenue: 1800, deposits: 1 },
    { date: '2025-09-18', calls: 18, offers: 12, closes: 4, revenue: 6200, deposits: 3 },
    { date: '2025-09-17', calls: 14, offers: 9, closes: 2, revenue: 2900, deposits: 1 }
  ]
})

export default function SalesRepDashboard() {
  const params = useParams()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')
  
  const repId = params.id as string
  const repData = getSalesRepData(repId)

  const statusColors = {
    active: 'bg-emerald-400',
    busy: 'bg-amber-400',
    away: 'bg-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-3xl">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/30 dark:border-slate-800/30">
        <div className="px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {repData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[repData.status]} rounded-full border-2 border-white dark:border-slate-900`}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  {repData.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  Sales Representative • {repData.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-1 p-1 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-200/30 dark:border-slate-700/30">
                {(['week', 'month', 'quarter'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Performance KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Calls */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                TOTAL CALLS
              </div>
              <Phone className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {repData.stats.totalCalls}
            </div>
            <div className="text-xs text-blue-500 font-medium">
              Show Rate: {repData.stats.showRate.toFixed(1)}%
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                REVENUE
              </div>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              ${repData.stats.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-500 font-medium">
              +{((repData.stats.revenue / 100000) * 10).toFixed(1)}% growth
            </div>
          </div>

          {/* Closes */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                CLOSES
              </div>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {repData.stats.closes}
            </div>
            <div className="text-xs text-purple-500 font-medium">
              {repData.stats.closeRate.toFixed(1)}% close rate
            </div>
          </div>

          {/* Deposits */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                DEPOSITS
              </div>
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {repData.stats.deposits}
            </div>
            <div className="text-xs text-orange-500 font-medium">
              {((repData.stats.deposits / repData.stats.closes) * 100).toFixed(1)}% deposit rate
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Recent Performance ({timeRange})
          </h3>
          
          <div className="overflow-hidden rounded-xl border border-slate-200/30 dark:border-slate-700/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Calls</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Offers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Closes</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Deposits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-700/30">
                  {repData.recentActivity.map((activity, index) => (
                    <tr key={index} className="hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {activity.calls}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {activity.offers}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {activity.closes}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">
                        ${activity.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {activity.deposits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goals & Targets */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Goals & Progress
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Closes Target</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{repData.stats.closes}/50</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full" style={{width: `${Math.min((repData.stats.closes / 50) * 100, 100)}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Revenue Target</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">${repData.stats.revenue.toLocaleString()}/200K</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" style={{width: `${Math.min((repData.stats.revenue / 200000) * 100, 100)}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Performance Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200/30 dark:border-slate-700/30">
                <span className="text-slate-600 dark:text-slate-400">Conversion Rate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{repData.stats.conversionRate}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200/30 dark:border-slate-700/30">
                <span className="text-slate-600 dark:text-slate-400">Avg Revenue per Close</span>
                <span className="font-semibold text-emerald-500">${Math.floor(repData.stats.revenue / repData.stats.closes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600 dark:text-slate-400">Days Active</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {Math.floor((new Date().getTime() - new Date(repData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}