'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  RevenueChart, 
  PerformanceChart, 
  TeamBarChart, 
  CloseRateChart, 
  ActivityHeatmap,
  SummaryStats 
} from '@/components/charts/ModernCharts'
import { DarkChart, sampleChartData } from '@/components/charts/DarkChart'
import { 
  RevenueOverTimeChart, 
  RevenueComparisonChart 
} from '@/components/charts/RevenueCharts'
import { 
  DateRangePicker, 
  TimeGroupingPicker, 
  KPIPicker 
} from '@/components/ui/date-picker'
import { 
  useRevenueData, 
  useRevenueSummary 
} from '@/hooks/useRevenue'
import { 
  DollarSign, 
  Phone, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Award,
  Clock,
  Filter,
  BarChart3,
  Settings
} from 'lucide-react'

// Sample data - in real app this would come from your Supabase API
const allTimeRevenueData = [
  { name: 'Q1 2024', value: 45000 },
  { name: 'Q2 2024', value: 62000 },
  { name: 'Q3 2024', value: 78000 },
  { name: 'Q4 2024', value: 89000 },
  { name: 'Q1 2025', value: 95000 },
]

const monthlyRevenueData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 18000 },
  { name: 'Apr', value: 22000 },
  { name: 'May', value: 25500 },
]

const weeklyRevenueData = [
  { name: 'Week 1', value: 3200 },
  { name: 'Week 2', value: 4100 },
  { name: 'Week 3', value: 3800 },
  { name: 'Week 4', value: 4500 },
]

const performanceData = [
  { name: 'Week 1', value: 45 },
  { name: 'Week 2', value: 52 },
  { name: 'Week 3', value: 48 },
  { name: 'Week 4', value: 61 },
]

const teamData = [
  { name: 'Alex', value: 8 },
  { name: 'Emma', value: 12 },
  { name: 'John', value: 6 },
  { name: 'Sarah', value: 9 },
]

const closeRateData = [
  { name: 'Closed', value: 35, color: 'var(--success)' },
  { name: 'Pipeline', value: 45, color: 'var(--primary)' },
  { name: 'Lost', value: 20, color: 'var(--error)' },
]

const leaderboardData = [
  { name: 'Alex Johnson', deals: 10, revenue: '$8,000' },
  { name: 'Emma Clark', deals: 8, revenue: '$7,500' },
  { name: 'John Doe', deals: 6, revenue: '$5,000' },
]

const activityData = Array.from({ length: 49 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: Math.floor(Math.random() * 10)
}))

interface DateRange {
  start: Date
  end: Date
  label: string
}

type TimeGrouping = 'daily' | 'weekly' | 'monthly' | 'yearly'
type KPIType = 'revenue' | 'units' | 'closes' | 'offers' | 'calls'

export default function ModernDashboard() {
  const [revenueTimeRange, setRevenueTimeRange] = useState<'all-time' | 'monthly' | 'weekly'>('monthly')
  const [revenueKPI, setRevenueKPI] = useState<'revenue' | 'calls' | 'closes' | 'offers'>('revenue')
  const [useRealData, setUseRealData] = useState(true) // ENABLE REAL DATA BY DEFAULT
  
  // New state for enhanced revenue charts
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [timeGrouping, setTimeGrouping] = useState<TimeGrouping>('monthly')
  const [kpiType, setKpiType] = useState<KPIType>('revenue')
  
  // Prepare query parameters for real data
  const queryParams = useMemo(() => ({
    startDate: dateRange?.start,
    endDate: dateRange?.end
  }), [dateRange])
  
  // Fetch real revenue data (only when enabled)
  const { data: revenueData = [], isLoading: revenueLoading } = useRevenueData(queryParams)
  const { data: revenueSummary, isLoading: summaryLoading } = useRevenueSummary(queryParams)
  
  const getRevenueData = () => {
    // Use real data if enabled and available, otherwise fall back to sample data
    if (useRealData && revenueData.length > 0) {
      return revenueData
    }
    
    switch (revenueTimeRange) {
      case 'all-time':
        return allTimeRevenueData
      case 'weekly':
        return weeklyRevenueData
      default:
        return monthlyRevenueData
    }
  }
  
  // Get real revenue summary or use sample data
  const getRealRevenueSummary = () => {
    if (useRealData && revenueSummary) {
      return {
        revenue: `$${revenueSummary.totalRevenue.toLocaleString()}`,
        change: '+0%', // Could calculate from growth data
        calls: revenueSummary.totalCalls.toString(),
        offers: revenueSummary.totalOffers.toString(),
        closes: revenueSummary.totalCloses.toString()
      }
    }
    return {
      revenue: '$25,500',
      change: '+12.5%',
      calls: '85',
      offers: '45',
      closes: '35%'
    }
  }
  
  const realSummary = getRealRevenueSummary()
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Revenue Analytics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your team's performance and revenue growth
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link 
            href="/revenue" 
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg font-medium text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">View Full Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useRealData}
                onChange={(e) => setUseRealData(e.target.checked)}
                className="rounded border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <span>Use Real Data</span>
            </label>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <Card className="p-4 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <SummaryStats
            title="Revenue"
            value={realSummary.revenue}
            change={realSummary.change}
            trend={[20000, 21500, 23000, 24200, 25500]}
            icon={<DollarSign className="w-4 h-4" />}
          />
        </Card>

        {/* Calls Card */}
        <Card className="p-4 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <SummaryStats
            title="Calls"
            value={realSummary.calls}
            change="+8.2%"
            trend={[72, 78, 81, 83, 85]}
            icon={<Phone className="w-4 h-4" />}
          />
        </Card>

        {/* Offers Card */}
        <Card className="p-4 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <SummaryStats
            title="Offers"
            value={realSummary.offers}
            change="+15.3%"
            trend={[35, 38, 41, 43, 45]}
            icon={<Target className="w-4 h-4" />}
          />
        </Card>

        {/* Close Rate Card */}
        <Card className="p-4 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <SummaryStats
            title="Close Rate"
            value={realSummary.closes}
            change="+2.1%"
            trend={[31, 32, 33, 34, 35]}
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4 px-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>Revenue Over Time</span>
                {useRealData && (revenueLoading || summaryLoading) && (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                )}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {useRealData ? (
                  <>
                    {/* Date Range Picker for Real Data */}
                    <DateRangePicker
                      selectedRange={dateRange}
                      onRangeChange={setDateRange}
                      className="min-w-[160px]"
                    />
                    
                    {/* Time Grouping */}
                    <TimeGroupingPicker
                      value={timeGrouping}
                      onChange={setTimeGrouping}
                      className="text-xs"
                    />
                    
                    {/* KPI Picker */}
                    <KPIPicker
                      value={kpiType}
                      onChange={setKpiType}
                      className="text-xs"
                    />
                  </>
                ) : (
                  <>
                    {/* Original Time Range Filter */}
                    <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      {(['all-time', 'monthly', 'weekly'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setRevenueTimeRange(range)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                            revenueTimeRange === range
                              ? 'bg-indigo-600 text-white shadow-lg'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          {range === 'all-time' ? 'All Time' : range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                      ))}
                    </div>
                    
                    {/* Original KPI Filter */}
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <select 
                        value={revenueKPI}
                        onChange={(e) => setRevenueKPI(e.target.value as any)}
                        className="text-xs bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="revenue">Revenue</option>
                        <option value="calls">Calls</option>
                        <option value="closes">Closes</option>
                        <option value="offers">Offers</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {useRealData && revenueData.length > 0 ? (
              <RevenueOverTimeChart 
                data={revenueData}
                height={240}
                dateRange={dateRange}
                timeGrouping={timeGrouping}
                kpiType={kpiType}
                showGrid={false}
              />
            ) : (
              <DarkChart data={sampleChartData} height={300} className="-m-6" />
            )}
          </CardContent>
        </Card>

        {/* Rep Leaderboard */}
        <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Rep Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="space-y-1 text-sm">
              <div className="grid grid-cols-3 gap-4 text-slate-500 dark:text-slate-400 font-medium">
                <span>Name</span>
                <span className="text-right">Closed Deals</span>
                <span className="text-right">Revenue</span>
              </div>
            </div>
            
            {leaderboardData.map((rep, index) => (
              <div key={rep.name} className="grid grid-cols-3 gap-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-medium text-white">
                    {rep.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium">{rep.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">{rep.deals}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">{rep.revenue}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Team Performance */}
        <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>Team Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <TeamBarChart data={teamData} height={180} />
          </CardContent>
        </Card>

        {/* Close Rate Breakdown */}
        <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span>Close Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 flex flex-col items-center">
            <CloseRateChart data={closeRateData} height={160} />
            <div className="flex items-center justify-center space-x-6 mt-4">
              {closeRateData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Last 7 weeks of activity
              </div>
              <ActivityHeatmap data={activityData} />
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Less</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-sm" />
                  <div className="w-2 h-2 bg-indigo-200 dark:bg-indigo-800 rounded-sm" />
                  <div className="w-2 h-2 bg-indigo-300 dark:bg-indigo-700 rounded-sm" />
                  <div className="w-2 h-2 bg-indigo-400 dark:bg-indigo-600 rounded-sm" />
                  <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-sm" />
                </div>
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card className="p-6 hover:shadow-lg transition-all duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
        <CardHeader className="pb-4 px-0">
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span>Weekly Performance Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <PerformanceChart data={performanceData} height={200} />
        </CardContent>
      </Card>
    </div>
  )
}