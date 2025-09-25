'use client'

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
  PieChart, 
  Pie, 
  Cell,
  Tooltip,
  CartesianGrid
} from 'recharts'

interface ChartData {
  name: string
  value: number
  revenue?: number
  closes?: number
  calls?: number
  offers?: number
  date?: string
}

interface ModernChartProps {
  data: ChartData[]
  height?: number
  showGrid?: boolean
  color?: string
}

// Custom Dark Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-700/50">
        <p className="text-slate-200 text-sm font-medium mb-1">{label}</p>
        {payload.map((pld: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: pld.color }}
            />
            <span className="text-slate-400 text-sm">
              {pld.dataKey}: <span className="font-medium text-slate-200">{pld.value}</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Revenue Over Time - Dark Area Chart (Reference Style)
export function RevenueChart({ data, height = 200 }: ModernChartProps) {
  return (
    <div className="bg-slate-900/90 dark:bg-slate-800/90 rounded-xl p-4" style={{ height: height + 40 }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3}/>
              <stop offset="50%" stopColor="#ea580c" stopOpacity={0.1}/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316"/>
              <stop offset="50%" stopColor="#ea580c"/>
              <stop offset="100%" stopColor="#dc2626"/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            dy={8}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#strokeGradient)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ 
              r: 4, 
              stroke: '#f97316', 
              strokeWidth: 2, 
              fill: '#1e293b'
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Performance Metrics - Dark Line Chart
export function PerformanceChart({ data, height = 180 }: ModernChartProps) {
  return (
    <div className="bg-slate-900/90 dark:bg-slate-800/90 rounded-xl p-4" style={{ height: height + 40 }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="performanceGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4"/>
              <stop offset="50%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#6366f1"/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            dy={8}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#performanceGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ 
              r: 4, 
              stroke: '#06b6d4', 
              strokeWidth: 2, 
              fill: '#1e293b'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Team Performance - Dark Bar Chart
export function TeamBarChart({ data, height = 160 }: ModernChartProps) {
  return (
    <div className="bg-slate-900/90 dark:bg-slate-800/90 rounded-xl p-4" style={{ height: height + 40 }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 15, right: 20, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981"/>
              <stop offset="100%" stopColor="#059669"/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            dy={8}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
            tickFormatter={(value) => value.toString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Close Rate Donut Chart (Notion Style)
export function CloseRateChart({ data, height = 140 }: { data: { name: string; value: number; color: string }[], height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-[var(--surface-elevated)] p-3 rounded-lg shadow-[var(--shadow-floating)] border border-[var(--border-soft)]">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: payload[0].payload.color }}
                    />
                    <span className="text-[var(--foreground-muted)] text-sm">
                      {payload[0].name}: <span className="font-medium text-[var(--foreground)]">{payload[0].value}%</span>
                    </span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Mini Trend Chart for KPI Cards
export function MiniTrendChart({ data, positive = true, height = 40 }: { 
  data: number[], 
  positive?: boolean,
  height?: number 
}) {
  const chartData = data.map((value, index) => ({ index, value }))
  const color = positive ? 'var(--success)' : 'var(--error)'
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Activity Heatmap (Notion Style)
export function ActivityHeatmap({ data }: { data: { day: string; value: number }[] }) {
  const getIntensity = (value: number) => {
    if (value === 0) return 'bg-[var(--accent)]'
    if (value <= 3) return 'bg-[var(--primary)]/20'
    if (value <= 6) return 'bg-[var(--primary)]/40'
    if (value <= 9) return 'bg-[var(--primary)]/60'
    return 'bg-[var(--primary)]/80'
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {data.slice(0, 49).map((day, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-sm ${getIntensity(day.value)} transition-all hover:scale-110`}
          title={`${day.day}: ${day.value} activities`}
        />
      ))}
    </div>
  )
}

// Summary Stats Component
export function SummaryStats({ 
  title, 
  value, 
  change, 
  trend,
  icon 
}: { 
  title: string
  value: string | number
  change?: string
  trend?: number[]
  icon?: React.ReactNode
}) {
  const isPositive = change && change.startsWith('+')
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm text-[var(--foreground-muted)] font-medium tracking-wide uppercase">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            {icon}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          {value}
        </div>
        
        {change && (
          <div className="flex items-center space-x-2">
            <span className={`text-xs md:text-sm font-semibold px-2 py-1 rounded-full ${
              isPositive 
                ? 'text-[var(--success)] bg-[var(--success)]/10' 
                : 'text-[var(--error)] bg-[var(--error)]/10'
            }`}>
              {change}
            </span>
            <span className="text-xs text-[var(--foreground-subtle)] font-medium">
              vs last period
            </span>
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-3">
          <MiniTrendChart data={trend} positive={isPositive} />
        </div>
      )}
    </div>
  )
}
