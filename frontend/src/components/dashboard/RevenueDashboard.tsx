'use client'

import { useState, useMemo } from 'react'
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
  Package
} from 'lucide-react'
import { format } from 'date-fns'

interface DateRange {
  start: Date
  end: Date
  label: string
}

type TimeGrouping = 'daily' | 'weekly' | 'monthly' | 'yearly'
type KPIType = 'revenue' | 'units' | 'closes' | 'offers' | 'calls'

// Sample revenue data for immediate visualization
const sampleRevenueData = [
  { date: '2024-01-01', revenue: 12500, units: 25, closes: 15, offers: 45, calls: 120, product_name: 'Premium Package', user_name: 'John Doe' },
  { date: '2024-02-01', revenue: 15800, units: 32, closes: 18, offers: 52, calls: 145, product_name: 'Premium Package', user_name: 'Jane Smith' },
  { date: '2024-03-01', revenue: 18200, units: 38, closes: 22, offers: 58, calls: 168, product_name: 'Premium Package', user_name: 'Mike Johnson' },
  { date: '2024-04-01', revenue: 22100, units: 45, closes: 28, offers: 67, calls: 189, product_name: 'Premium Package', user_name: 'Sarah Wilson' },
  { date: '2024-05-01', revenue: 25500, units: 52, closes: 31, offers: 72, calls: 201, product_name: 'Premium Package', user_name: 'Alex Brown' },
  { date: '2024-06-01', revenue: 28900, units: 58, closes: 35, offers: 78, calls: 225, product_name: 'Premium Package', user_name: 'Emily Davis' },
  { date: '2024-07-01', revenue: 32400, units: 65, closes: 42, offers: 89, calls: 248, product_name: 'Premium Package', user_name: 'Chris Lee' },
  { date: '2024-08-01', revenue: 35800, units: 71, closes: 48, offers: 95, calls: 267, product_name: 'Premium Package', user_name: 'Lisa Garcia' },
  { date: '2024-09-01', revenue: 39200, units: 78, closes: 52, offers: 101, calls: 289, product_name: 'Premium Package', user_name: 'David Miller' },
  { date: '2024-10-01', revenue: 42600, units: 85, closes: 58, offers: 108, calls: 312, product_name: 'Premium Package', user_name: 'Jennifer Taylor' },
  { date: '2024-11-01', revenue: 46100, units: 92, closes: 64, offers: 115, calls: 334, product_name: 'Premium Package', user_name: 'Robert Anderson' },
  { date: '2024-12-01', revenue: 49800, units: 98, closes: 71, offers: 122, calls: 356, product_name: 'Premium Package', user_name: 'Maria Rodriguez' }
]

const sampleProductData = [
  { product_name: 'Premium Package', revenue: 189500, units: 425 },
  { product_name: 'Basic Package', revenue: 125300, units: 312 },
  { product_name: 'Enterprise Package', revenue: 89200, units: 156 },
  { product_name: 'Starter Package', revenue: 45600, units: 298 }
]

const sampleUserData = [
  { user_id: '1', user_name: 'Sarah Wilson', role: 'sales_rep', revenue: 85400, units: 167, closes: 89, offers: 245 },
  { user_id: '2', user_name: 'Mike Johnson', role: 'sales_rep', revenue: 76200, units: 152, closes: 78, offers: 221 },
  { user_id: '3', user_name: 'Emily Davis', role: 'sales_rep', revenue: 69800, units: 143, closes: 71, offers: 198 },
  { user_id: '4', user_name: 'Alex Brown', role: 'sales_rep', revenue: 62300, units: 128, closes: 64, offers: 187 },
  { user_id: '5', user_name: 'Chris Lee', role: 'sales_rep', revenue: 58900, units: 119, closes: 58, offers: 172 }
]

export default function RevenueDashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [timeGrouping, setTimeGrouping] = useState<TimeGrouping>('monthly')
  const [kpiType, setKpiType] = useState<KPIType>('revenue')
  const [chartView, setChartView] = useState<'overview' | 'comparison' | 'growth' | 'products'>('overview')

  // Prepare query parameters
  const queryParams = useMemo(() => ({
    startDate: dateRange?.start,
    endDate: dateRange?.end
  }), [dateRange])

  // Fetch data using custom hooks
  const { data: realRevenueData = [], isLoading: revenueLoading, refetch: refetchRevenue } = useRevenueData(queryParams)
  const { data: revenueSummary, isLoading: summaryLoading } = useRevenueSummary(queryParams)
  const { data: realRevenueByProduct = [], isLoading: productLoading } = useRevenueByProduct(queryParams)
  const { data: realRevenueByUser = [], isLoading: userLoading } = useRevenueByUser(queryParams)
  const { data: revenueGrowth, isLoading: growthLoading } = useRevenueGrowth({ 
    ...queryParams, 
    periodType: timeGrouping 
  })
  
  // Use real data if available, otherwise fall back to sample data
  const revenueData = realRevenueData.length > 0 ? realRevenueData : sampleRevenueData
  const revenueByProduct = realRevenueByProduct.length > 0 ? realRevenueByProduct : sampleProductData
  const revenueByUser = realRevenueByUser.length > 0 ? realRevenueByUser : sampleUserData

  const isLoading = revenueLoading || summaryLoading || productLoading || userLoading || growthLoading

  // Calculate additional metrics - use real data or calculate from sample data
  const totalRevenue = revenueSummary?.totalRevenue || sampleRevenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalUnits = revenueSummary?.totalUnits || sampleRevenueData.reduce((sum, item) => sum + (item.units || 0), 0)
  const totalCloses = revenueSummary?.totalCloses || sampleRevenueData.reduce((sum, item) => sum + (item.closes || 0), 0)
  const totalOffers = revenueSummary?.totalOffers || sampleRevenueData.reduce((sum, item) => sum + (item.offers || 0), 0)
  const avgRevenuePerClose = totalCloses > 0 ? totalRevenue / totalCloses : 0
  const closeRate = totalOffers > 0 ? (totalCloses / totalOffers) * 100 : 0

  // Growth indicators
  const revenueGrowthRate = revenueGrowth?.growthRate || 0
  const revenueGrowthAmount = revenueGrowth?.growthAmount || 0

  const handleRefresh = () => {
    refetchRevenue()
  }

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting revenue data...', { dateRange, revenueData })
  }

  const getChartTitle = () => {
    switch (chartView) {
      case 'comparison': return 'Revenue vs Performance Metrics'
      case 'growth': return 'Revenue Growth Rate'
      case 'products': return 'Revenue by Product'
      default: return 'Revenue Over Time'
    }
  }

  const renderMainChart = () => {
    if (!revenueData.length) {
      return (
        <div className="flex items-center justify-center h-64 text-[var(--foreground-muted)]">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No revenue data available for the selected period</p>
            <p className="text-sm mt-1">Try adjusting your date range or check back later</p>
          </div>
        </div>
      )
    }

    switch (chartView) {
      case 'comparison':
        return (
          <RevenueComparisonChart 
            data={revenueData}
            height={400}
            dateRange={dateRange}
            timeGrouping={timeGrouping}
          />
        )
      case 'growth':
        return (
          <RevenueGrowthChart 
            data={revenueData}
            height={400}
            dateRange={dateRange}
            timeGrouping={timeGrouping}
          />
        )
      case 'products':
        return (
          <RevenueByProductChart 
            data={revenueData}
            height={400}
            timeGrouping={timeGrouping}
          />
        )
      default:
        return (
          <RevenueOverTimeChart 
            data={revenueData}
            height={400}
            dateRange={dateRange}
            timeGrouping={timeGrouping}
            kpiType={kpiType}
            showGrid={true}
          />
        )
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-[var(--foreground)]">Revenue Analytics</h1>
          <p className="text-[var(--foreground-muted)]">
            Track revenue performance and growth across your organization
            {dateRange && ` • ${dateRange.label}`}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--surface)] border border-[var(--border-soft)] rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[var(--foreground-muted)]" />
          <span className="text-sm font-medium text-[var(--foreground)]">Filters:</span>
        </div>
        
        <DateRangePicker
          selectedRange={dateRange}
          onRangeChange={setDateRange}
          className="min-w-[200px]"
        />
        
        <TimeGroupingPicker
          value={timeGrouping}
          onChange={setTimeGrouping}
        />
        
        {chartView === 'overview' && (
          <KPIPicker
            value={kpiType}
            onChange={setKpiType}
          />
        )}
        
        <div className="flex items-center space-x-1 ml-auto">
          <span className="text-xs text-[var(--foreground-muted)] mr-2">View:</span>
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'comparison', label: 'Comparison', icon: TrendingUp },
            { key: 'growth', label: 'Growth', icon: Target },
            { key: 'products', label: 'Products', icon: Package }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setChartView(key as any)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 flex items-center space-x-1 ${
                chartView === key
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <SummaryStats
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change={revenueGrowthRate > 0 ? `+${revenueGrowthRate.toFixed(1)}%` : `${revenueGrowthRate.toFixed(1)}%`}
            icon={<DollarSign className="w-4 h-4" />}
          />
        </Card>
        
        <Card className="p-6">
          <SummaryStats
            title="Units Sold"
            value={totalUnits.toLocaleString()}
            icon={<Package className="w-4 h-4" />}
          />
        </Card>
        
        <Card className="p-6">
          <SummaryStats
            title="Avg Revenue per Close"
            value={`$${avgRevenuePerClose.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            icon={<Target className="w-4 h-4" />}
          />
        </Card>
        
        <Card className="p-6">
          <SummaryStats
            title="Close Rate"
            value={`${closeRate.toFixed(1)}%`}
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="p-6">
        <CardHeader className="pb-4 px-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{getChartTitle()}</CardTitle>
            <div className="flex items-center space-x-2 text-xs text-[var(--foreground-muted)]">
              {dateRange && (
                <>
                  <Calendar className="w-3 h-3" />
                  <span>{dateRange.label}</span>
                </>
              )}
              {revenueData.length > 0 && (
                <span>• {revenueData.length} data points</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-[var(--primary)]" />
                <p className="text-[var(--foreground-muted)]">Loading revenue data...</p>
              </div>
            </div>
          ) : (
            renderMainChart()
          )}
        </CardContent>
      </Card>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Package className="w-4 h-4 text-[var(--primary)]" />
              <span>Top Products by Revenue</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {productLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
              </div>
            ) : revenueByProduct.length > 0 ? (
              <div className="space-y-3">
                {revenueByProduct.slice(0, 5).map((product, index) => (
                  <div key={product.product_name} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-medium text-[var(--foreground)]">
                        {index + 1}
                      </div>
                      <div>
                        <span className="text-[var(--foreground)] font-medium">{product.product_name}</span>
                        <div className="text-xs text-[var(--foreground-muted)]">
                          {product.units} units sold
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[var(--foreground)] font-semibold">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[var(--foreground-muted)] py-8">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No product data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="p-6">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="w-4 h-4 text-[var(--primary)]" />
              <span>Top Performers by Revenue</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {userLoading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 animate-spin text-[var(--primary)]" />
              </div>
            ) : revenueByUser.length > 0 ? (
              <div className="space-y-3">
                {revenueByUser.slice(0, 5).map((user, index) => (
                  <div key={user.user_id} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-sm font-medium text-[var(--foreground)]">
                        {user.user_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-[var(--foreground)] font-medium">{user.user_name}</span>
                        <div className="text-xs text-[var(--foreground-muted)] capitalize">
                          {user.role.replace('_', ' ')} • {user.closes} closes
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[var(--foreground)] font-semibold">
                        ${user.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[var(--foreground-muted)] py-8">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No user data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}