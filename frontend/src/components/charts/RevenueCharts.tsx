'use client'

import { useState, useMemo } from 'react'
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip,
  CartesianGrid,
  ComposedChart
} from 'recharts'
import { format, startOfWeek, startOfMonth, startOfYear, isWithinInterval, subDays, subWeeks, subMonths, subYears } from 'date-fns'

interface RevenueDataPoint {
  date: string
  revenue: number
  units?: number
  product_name?: string
  user_name?: string
  closes?: number
  offers?: number
  calls?: number
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
  height?: number
  showGrid?: boolean
  color?: string
  dateRange?: DateRange
  timeGrouping?: TimeGrouping
  kpiType?: KPIType
}

type DateRange = {
  start: Date
  end: Date
}

type TimeGrouping = 'daily' | 'weekly' | 'monthly' | 'yearly'
type KPIType = 'revenue' | 'units' | 'closes' | 'offers' | 'calls'

// Custom Tooltip Component
const RevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface-elevated)] p-4 rounded-lg shadow-[var(--shadow-floating)] border border-[var(--border-soft)]">
        <p className="text-[var(--foreground)] text-sm font-medium mb-2">{label}</p>
        {payload.map((pld: any, index: number) => {
          const value = pld.value
          const formattedValue = pld.dataKey === 'revenue' ? 
            `$${value.toLocaleString()}` : 
            value.toLocaleString()
          
          return (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: pld.color }}
              />
              <span className="text-[var(--foreground-muted)] text-sm capitalize">
                {pld.dataKey}: <span className="font-semibold text-[var(--foreground)]">{formattedValue}</span>
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

// Helper function to group data by time period
const groupDataByTime = (data: RevenueDataPoint[], grouping: TimeGrouping): RevenueDataPoint[] => {
  const grouped = new Map<string, RevenueDataPoint>()

  data.forEach(item => {
    const date = new Date(item.date)
    let key: string
    let groupDate: Date

    switch (grouping) {
      case 'weekly':
        groupDate = startOfWeek(date)
        key = format(groupDate, 'MMM dd, yyyy')
        break
      case 'monthly':
        groupDate = startOfMonth(date)
        key = format(groupDate, 'MMM yyyy')
        break
      case 'yearly':
        groupDate = startOfYear(date)
        key = format(groupDate, 'yyyy')
        break
      default: // daily
        groupDate = date
        key = format(date, 'MMM dd')
        break
    }

    if (grouped.has(key)) {
      const existing = grouped.get(key)!
      grouped.set(key, {
        ...existing,
        revenue: existing.revenue + item.revenue,
        units: (existing.units || 0) + (item.units || 0),
        closes: (existing.closes || 0) + (item.closes || 0),
        offers: (existing.offers || 0) + (item.offers || 0),
        calls: (existing.calls || 0) + (item.calls || 0),
      })
    } else {
      grouped.set(key, {
        ...item,
        date: key
      })
    }
  })

  return Array.from(grouped.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Filter data by date range
const filterDataByDateRange = (data: RevenueDataPoint[], dateRange?: DateRange): RevenueDataPoint[] => {
  if (!dateRange) return data
  
  return data.filter(item => {
    const itemDate = new Date(item.date)
    return isWithinInterval(itemDate, { start: dateRange.start, end: dateRange.end })
  })
}

// Main Revenue Over Time Chart
export function RevenueOverTimeChart({ 
  data, 
  height = 300, 
  showGrid = false,
  dateRange,
  timeGrouping = 'daily',
  kpiType = 'revenue'
}: RevenueChartProps) {
  const processedData = useMemo(() => {
    let filtered = filterDataByDateRange(data, dateRange)
    return groupDataByTime(filtered, timeGrouping)
  }, [data, dateRange, timeGrouping])

  const getDataKey = () => {
    switch (kpiType) {
      case 'units': return 'units'
      case 'closes': return 'closes'
      case 'offers': return 'offers'
      case 'calls': return 'calls'
      default: return 'revenue'
    }
  }

  const formatValue = (value: number) => {
    return kpiType === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString()
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id={`${kpiType}Gradient`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.08}/>
            <stop offset="50%" stopColor="var(--primary)" stopOpacity={0.04}/>
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
          <filter id="revenueDropShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08"/>
          </filter>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="2 2" stroke="var(--border-soft)" opacity={0.15} />
        )}
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--foreground-subtle)', fontWeight: 500 }}
          dy={8}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--foreground-subtle)', fontWeight: 500 }}
          tickFormatter={formatValue}
          width={70}
        />
        <Tooltip content={<RevenueTooltip />} />
        <Area
          type="natural"
          dataKey={getDataKey()}
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill={`url(#${kpiType}Gradient)`}
          dot={false}
          activeDot={{ 
            r: 6, 
            stroke: 'var(--primary)', 
            strokeWidth: 2.5, 
            fill: 'var(--surface)',
            filter: 'url(#revenueDropShadow)'
          }}
          style={{ filter: 'url(#revenueDropShadow)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Revenue Comparison Chart (Multiple KPIs)
export function RevenueComparisonChart({ 
  data, 
  height = 350,
  showGrid = true,
  dateRange,
  timeGrouping = 'daily'
}: Omit<RevenueChartProps, 'kpiType'>) {
  const processedData = useMemo(() => {
    let filtered = filterDataByDateRange(data, dateRange)
    return groupDataByTime(filtered, timeGrouping)
  }, [data, dateRange, timeGrouping])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueComparisonGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" opacity={0.3} />
        )}
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--foreground-subtle)' }}
        />
        <YAxis 
          yAxisId="left"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--foreground-subtle)' }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          width={80}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--foreground-subtle)' }}
          width={60}
        />
        <Tooltip content={<RevenueTooltip />} />
        
        {/* Revenue as Area */}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#revenueComparisonGradient)"
          name="Revenue"
        />
        
        {/* Closes as Line */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="closes"
          stroke="var(--success)"
          strokeWidth={2}
          dot={{ fill: 'var(--success)', strokeWidth: 0, r: 3 }}
          name="Closes"
        />
        
        {/* Offers as Line */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="offers"
          stroke="var(--warning)"
          strokeWidth={2}
          dot={{ fill: 'var(--warning)', strokeWidth: 0, r: 3 }}
          name="Offers"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// Revenue by Product Breakdown
export function RevenueByProductChart({ 
  data, 
  height = 300,
  timeGrouping = 'monthly'
}: Omit<RevenueChartProps, 'kpiType' | 'dateRange'> & { 
  productData?: Array<{ product_name: string; revenue: number; color?: string }>
}) {
  // Group revenue by product
  const productRevenue = useMemo(() => {
    const productMap = new Map<string, number>()
    
    data.forEach(item => {
      if (item.product_name) {
        const current = productMap.get(item.product_name) || 0
        productMap.set(item.product_name, current + item.revenue)
      }
    })
    
    return Array.from(productMap.entries())
      .map(([name, revenue]) => ({ product_name: name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8) // Top 8 products
  }, [data])

  const colors = [
    'var(--primary)',
    'var(--success)', 
    'var(--warning)',
    'var(--error)',
    'var(--info)',
    '#8b5cf6',
    '#f59e0b',
    '#06b6d4'
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={productRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="product_name" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: 'var(--foreground-subtle)' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--foreground-subtle)' }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-[var(--surface-elevated)] p-3 rounded-lg shadow-[var(--shadow-floating)] border border-[var(--border-soft)]">
                  <p className="text-[var(--foreground)] text-sm font-medium mb-1">{label}</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
                    <span className="text-[var(--foreground-muted)] text-sm">
                      Revenue: <span className="font-semibold text-[var(--foreground)]">${payload[0].value?.toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="revenue"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
          opacity={0.8}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Revenue Growth Rate Chart
export function RevenueGrowthChart({ 
  data, 
  height = 250,
  timeGrouping = 'monthly',
  dateRange
}: RevenueChartProps) {
  const growthData = useMemo(() => {
    let filtered = filterDataByDateRange(data, dateRange)
    let grouped = groupDataByTime(filtered, timeGrouping)
    
    return grouped.map((item, index) => {
      if (index === 0) {
        return { ...item, growthRate: 0 }
      }
      
      const previousRevenue = grouped[index - 1].revenue
      const growthRate = previousRevenue > 0 ? 
        ((item.revenue - previousRevenue) / previousRevenue) * 100 : 0
      
      return { ...item, growthRate }
    })
  }, [data, dateRange, timeGrouping])

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" opacity={0.3} />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--foreground-subtle)' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--foreground-subtle)' }}
          tickFormatter={(value) => `${value.toFixed(1)}%`}
        />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const growthRate = payload[0].value as number
              const isPositive = growthRate >= 0
              
              return (
                <div className="bg-[var(--surface-elevated)] p-3 rounded-lg shadow-[var(--shadow-floating)] border border-[var(--border-soft)]">
                  <p className="text-[var(--foreground)] text-sm font-medium mb-1">{label}</p>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: isPositive ? 'var(--success)' : 'var(--error)' }}
                    />
                    <span className="text-[var(--foreground-muted)] text-sm">
                      Growth: <span 
                        className={`font-semibold ${isPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}
                      >
                        {isPositive ? '+' : ''}{growthRate.toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="growthRate"
          stroke="var(--primary)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, stroke: 'var(--primary)', strokeWidth: 2, fill: 'var(--surface)' }}
        />
        {/* Zero line reference */}
        <Line
          type="monotone"
          dataKey={() => 0}
          stroke="var(--border-soft)"
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}