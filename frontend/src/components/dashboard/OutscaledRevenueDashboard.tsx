'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  RevenueOverTimeChart, 
  RevenueComparisonChart, 
  RevenueByProductChart, 
  RevenueGrowthChart 
} from '@/components/charts/RevenueCharts'
import { 
  DateRangePicker, 
  TimeGroupingPicker, 
  KPIPicker 
} from '@/components/ui/date-picker'
import { SummaryStats } from '@/components/charts/ModernCharts'
import { 
  useRevenueData, 
  useRevenueSummary, 
  useRevenueByProduct, 
  useRevenueByUser,
  useRevenueGrowth 
} from '@/hooks/useRevenue'
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Package,
  Phone,
  UserCheck,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  FileBarChart,
  Zap
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

interface DateRange {
  start: Date
  end: Date
  label: string
}

type TimeGrouping = 'daily' | 'weekly' | 'monthly' | 'yearly'
type KPIType = 'revenue' | 'units' | 'closes' | 'offers' | 'calls'

// Sample data that matches your existing Outscaled portal structure
const outscaledSampleData = {
  revenue: [
    { date: '2024-01-01', revenue: 45280, units: 89, closes: 67, offers: 234, calls: 1456, product_name: 'Outscaled Premium', user_name: 'Alex M.' },
    { date: '2024-02-01', revenue: 52340, units: 103, closes: 78, offers: 267, calls: 1623, product_name: 'Outscaled Premium', user_name: 'Sarah K.' },
    { date: '2024-03-01', revenue: 48920, units: 96, closes: 72, offers: 251, calls: 1534, product_name: 'Outscaled Premium', user_name: 'Mike R.' },
    { date: '2024-04-01', revenue: 61750, units: 121, closes: 89, offers: 298, calls: 1789, product_name: 'Outscaled Premium', user_name: 'Emma T.' },
    { date: '2024-05-01', revenue: 58630, units: 115, closes: 84, offers: 279, calls: 1667, product_name: 'Outscaled Premium', user_name: 'Chris L.' },
    { date: '2024-06-01', revenue: 67890, units: 133, closes: 98, offers: 324, calls: 1923, product_name: 'Outscaled Premium', user_name: 'Lisa P.' },
    { date: '2024-07-01', revenue: 72450, units: 142, closes: 107, offers: 356, calls: 2134, product_name: 'Outscaled Premium', user_name: 'David W.' },
    { date: '2024-08-01', revenue: 69120, units: 136, closes: 103, offers: 341, calls: 2045, product_name: 'Outscaled Premium', user_name: 'Jennifer B.' },
    { date: '2024-09-01', revenue: 75680, units: 149, closes: 112, offers: 378, calls: 2267, product_name: 'Outscaled Premium', user_name: 'Robert C.' },
    { date: '2024-10-01', revenue: 81340, units: 160, closes: 119, offers: 401, calls: 2389, product_name: 'Outscaled Premium', user_name: 'Maria S.' },
    { date: '2024-11-01', revenue: 78950, units: 155, closes: 116, offers: 389, calls: 2301, product_name: 'Outscaled Premium', user_name: 'James H.' },
    { date: '2024-12-01', revenue: 89230, units: 175, closes: 132, offers: 445, calls: 2567, product_name: 'Outscaled Premium', user_name: 'Ashley D.' }
  ],
  products: [
    { product_name: 'Outscaled Premium Package', revenue: 423500, units: 847, closes: 234 },
    { product_name: 'Outscaled Growth Package', revenue: 312800, units: 624, closes: 189 },
    { product_name: 'Outscaled Enterprise', revenue: 189600, units: 298, closes: 145 },
    { product_name: 'Outscaled Starter', revenue: 145300, units: 423, closes: 167 },
    { product_name: 'Custom Solutions', revenue: 87900, units: 156, closes: 78 }
  ],
  salesReps: [
    { user_id: '1', user_name: 'Sarah Mitchell', role: 'sales_rep', revenue: 134500, units: 267, closes: 89, offers: 334, eod_completed: 28, eod_total: 30 },
    { user_id: '2', user_name: 'Alex Rodriguez', role: 'sales_rep', revenue: 128900, units: 256, closes: 84, offers: 312, eod_completed: 30, eod_total: 30 },
    { user_id: '3', user_name: 'Emma Thompson', role: 'sales_rep', revenue: 121300, units: 241, closes: 78, offers: 298, eod_completed: 27, eod_total: 30 },
    { user_id: '4', user_name: 'Michael Chen', role: 'sales_rep', revenue: 116700, units: 232, closes: 76, offers: 287, eod_completed: 29, eod_total: 30 },
    { user_id: '5', user_name: 'Lisa Johnson', role: 'sales_rep', revenue: 109800, units: 218, closes: 71, offers: 267, eod_completed: 26, eod_total: 30 }
  ],
  clients: [
    { client_id: '1', client_name: 'TechCorp Solutions', revenue: 89500, status: 'active', last_purchase: '2024-12-15', lifetime_value: 234500 },
    { client_id: '2', client_name: 'Growth Dynamics LLC', revenue: 76300, status: 'active', last_purchase: '2024-12-10', lifetime_value: 198700 },
    { client_id: '3', client_name: 'InnovateTech Inc', revenue: 67800, status: 'active', last_purchase: '2024-12-08', lifetime_value: 156900 },
    { client_id: '4', client_name: 'ScaleUp Enterprises', revenue: 54200, status: 'pending', last_purchase: '2024-12-05', lifetime_value: 143600 },
    { client_id: '5', client_name: 'Digital Horizon Co', revenue: 48900, status: 'active', last_purchase: '2024-12-12', lifetime_value: 127800 }
  ]
}

// Key metrics that match your Outscaled system
const calculateOutscaledMetrics = (data: any) => {
  const totalRevenue = data.revenue.reduce((sum: number, item: any) => sum + item.revenue, 0)
  const totalCloses = data.revenue.reduce((sum: number, item: any) => sum + item.closes, 0)
  const totalOffers = data.revenue.reduce((sum: number, item: any) => sum + item.offers, 0)
  const totalCalls = data.revenue.reduce((sum: number, item: any) => sum + item.calls, 0)
  
  return {
    totalRevenue,
    totalCloses,
    totalOffers,
    totalCalls,
    closeRate: totalOffers > 0 ? (totalCloses / totalOffers) * 100 : 0,
    avgRevenuePerClose: totalCloses > 0 ? totalRevenue / totalCloses : 0,
    avgRevenuePerCall: totalCalls > 0 ? totalRevenue / totalCalls : 0,
    monthlyGrowth: 12.4, // Calculate from your real data
    quarterlyGrowth: 28.7,
    yearlyGrowth: 156.3
  }
}

export default function OutscaledRevenueDashboard() {
  // State for filters and views
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [timeGrouping, setTimeGrouping] = useState<TimeGrouping>('monthly')
  const [kpiType, setKpiType] = useState<KPIType>('revenue')
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'reps' | 'clients'>('overview')
  const [viewMode, setViewMode] = useState<'charts' | 'table'>('charts')

  // Calculate metrics from sample data (replace with your real data hooks)
  const metrics = useMemo(() => calculateOutscaledMetrics(outscaledSampleData), [])

  // Set default date range to current year
  useEffect(() => {
    if (!dateRange) {
      setDateRange({
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
        label: 'This Year'
      })
    }
  }, [dateRange])

  const handleExportData = () => {
    // Implement export to CSV/Excel functionality
    console.log('Exporting Outscaled revenue data...')
  }

  const handleSyncNotion = () => {
    // Implement Notion sync functionality using your database IDs
    console.log('Syncing with Notion databases...')
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
                Outscaled Revenue Analytics
              </h1>
              <p className="text-[var(--foreground-muted)] text-lg">
                Comprehensive revenue tracking and performance insights
                {dateRange && ` • ${dateRange.label}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSyncNotion}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Sync Notion</span>
            </Button>
            
            <Button
              onClick={handleExportData}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 p-1 bg-[var(--accent)] rounded-lg">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'products', label: 'Products & Offers', icon: Package },
              { key: 'reps', label: 'Sales Reps', icon: Users },
              { key: 'clients', label: 'Clients', icon: Building2 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === key
                    ? 'bg-[var(--primary)] text-white shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <DateRangePicker
              selectedRange={dateRange}
              onRangeChange={setDateRange}
              className="min-w-[200px]"
            />
            
            <TimeGroupingPicker
              value={timeGrouping}
              onChange={setTimeGrouping}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Revenue</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              ${metrics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              +{metrics.yearlyGrowth.toFixed(1)}% YoY
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Close Rate</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {metrics.closeRate.toFixed(1)}%
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              +2.4% vs last month
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Calls</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {metrics.totalCalls.toLocaleString()}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              +15.6% vs last month
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-orange-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Revenue/Close</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              ${metrics.avgRevenuePerClose.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              +8.2% vs last month
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-teal-100 dark:bg-teal-800 rounded-lg">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <CheckCircle className="w-4 h-4 text-teal-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Active Sales Reps</p>
            <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
              {outscaledSampleData.salesReps.length}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-400">
              All completing EODs
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-100 dark:bg-rose-800 rounded-lg">
              <Building2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <Eye className="w-4 h-4 text-rose-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">Active Clients</p>
            <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
              {outscaledSampleData.clients.filter(c => c.status === 'active').length}
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {outscaledSampleData.clients.filter(c => c.status === 'pending').length} pending
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <CardHeader className="pb-4 px-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                  <span>Revenue Performance Over Time</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <KPIPicker value={kpiType} onChange={setKpiType} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <RevenueOverTimeChart 
                data={outscaledSampleData.revenue}
                height={400}
                dateRange={dateRange}
                timeGrouping={timeGrouping}
                kpiType={kpiType}
                showGrid={true}
              />
            </CardContent>
          </Card>

          {/* Secondary Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardHeader className="pb-4 px-0">
                <CardTitle className="text-lg">Revenue Growth Rate</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <RevenueGrowthChart 
                  data={outscaledSampleData.revenue}
                  height={300}
                  dateRange={dateRange}
                  timeGrouping={timeGrouping}
                />
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="pb-4 px-0">
                <CardTitle className="text-lg">Revenue vs Performance</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <RevenueComparisonChart 
                  data={outscaledSampleData.revenue}
                  height={300}
                  dateRange={dateRange}
                  timeGrouping={timeGrouping}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="pb-4 px-0">
              <CardTitle className="text-xl">Products & Offers Performance</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <RevenueByProductChart 
                data={outscaledSampleData.revenue}
                height={400}
              />
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="pb-4 px-0">
              <CardTitle className="text-lg">Product Performance Table</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-soft)]">
                      <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)]">Product</th>
                      <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Revenue</th>
                      <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Units</th>
                      <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Closes</th>
                      <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outscaledSampleData.products.map((product, index) => (
                      <tr key={product.product_name} className="border-b border-[var(--border-subtle)]">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{product.product_name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right font-semibold">${product.revenue.toLocaleString()}</td>
                        <td className="py-4 text-right">{product.units}</td>
                        <td className="py-4 text-right">{product.closes}</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              +{(12 + index * 3).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'reps' && (
        <Card className="p-6">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-xl">Sales Rep Performance & EOD Tracking</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)]">Sales Rep</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Revenue</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Closes</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Close Rate</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">EOD Status</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {outscaledSampleData.salesReps.map((rep) => (
                    <tr key={rep.user_id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {rep.user_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium">{rep.user_name}</div>
                            <div className="text-sm text-[var(--foreground-muted)] capitalize">{rep.role.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right font-semibold">${rep.revenue.toLocaleString()}</td>
                      <td className="py-4 text-right">{rep.closes}</td>
                      <td className="py-4 text-right">
                        {((rep.closes / rep.offers) * 100).toFixed(1)}%
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {rep.eod_completed === rep.eod_total ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-orange-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            rep.eod_completed === rep.eod_total ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {rep.eod_completed}/{rep.eod_total}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">+18.4%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'clients' && (
        <Card className="p-6">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-xl">Client Revenue & Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)]">Client</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Current Revenue</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Lifetime Value</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Last Purchase</th>
                    <th className="pb-3 text-sm font-medium text-[var(--foreground-muted)] text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {outscaledSampleData.clients.map((client) => (
                    <tr key={client.client_id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {client.client_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="font-medium">{client.client_name}</div>
                        </div>
                      </td>
                      <td className="py-4 text-right font-semibold">${client.revenue.toLocaleString()}</td>
                      <td className="py-4 text-right font-bold text-green-600">${client.lifetime_value.toLocaleString()}</td>
                      <td className="py-4 text-right text-sm text-[var(--foreground-muted)]">
                        {format(new Date(client.last_purchase), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === 'active' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}