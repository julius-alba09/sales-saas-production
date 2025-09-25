'use client'

import * as React from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  variant?: 'default' | 'glass' | 'gradient'
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className,
  title,
  description,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700',
    glass: 'glass-card bg-white/5 backdrop-blur-xl border-white/10',
    gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200/50 dark:border-indigo-700/50'
  }

  return (
    <motion.div
      className={cn(
        'rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl',
        variants[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, labelFormatter, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        className="glass-card p-3 shadow-xl backdrop-blur-xl border border-white/20 dark:border-white/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {entry.name}: {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </motion.div>
    )
  }
  return null
}

// Animated Line Chart Component
interface AnimatedLineChartProps {
  data: any[]
  xKey: string
  yKeys: string[]
  colors?: string[]
  title?: string
  description?: string
  variant?: 'default' | 'glass' | 'gradient'
  height?: number
  formatValue?: (value: any) => string
  className?: string
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  xKey,
  yKeys,
  colors = ['#6366f1', '#8b5cf6', '#06b6d4'],
  title,
  description,
  variant = 'glass',
  height = 300,
  formatValue,
  className
}) => {
  return (
    <ChartContainer title={title} description={description} variant={variant} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis 
            dataKey={xKey} 
            stroke="currentColor" 
            opacity={0.6}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="currentColor" 
            opacity={0.6}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip formatter={formatValue} />} />
          {yKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: 'currentColor' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: colors[index % colors.length] }}
              animationDuration={1500}
              animationBegin={index * 200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Animated Area Chart Component
export const AnimatedAreaChart: React.FC<AnimatedLineChartProps> = ({
  data,
  xKey,
  yKeys,
  colors = ['#6366f1', '#8b5cf6', '#06b6d4'],
  title,
  description,
  variant = 'glass',
  height = 300,
  formatValue,
  className
}) => {
  return (
    <ChartContainer title={title} description={description} variant={variant} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`areaGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.6} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis 
            dataKey={xKey} 
            stroke="currentColor" 
            opacity={0.6}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="currentColor" 
            opacity={0.6}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip formatter={formatValue} />} />
          {yKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              fill={`url(#areaGradient${index})`}
              animationDuration={1500}
              animationBegin={index * 200}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Animated Bar Chart Component
export const AnimatedBarChart: React.FC<AnimatedLineChartProps> = ({
  data,
  xKey,
  yKeys,
  colors = ['#6366f1', '#8b5cf6', '#06b6d4'],
  title,
  description,
  variant = 'glass',
  height = 300,
  formatValue,
  className
}) => {
  return (
    <ChartContainer title={title} description={description} variant={variant} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis 
            dataKey={xKey} 
            stroke="currentColor" 
            opacity={0.6}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="currentColor" 
            opacity={0.6}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip formatter={formatValue} />} />
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`url(#barGradient${index})`}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationBegin={index * 200}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Animated Pie Chart Component
interface AnimatedPieChartProps {
  data: { name: string; value: number; color?: string }[]
  title?: string
  description?: string
  variant?: 'default' | 'glass' | 'gradient'
  height?: number
  showLegend?: boolean
  formatValue?: (value: any) => string
  className?: string
}

export const AnimatedPieChart: React.FC<AnimatedPieChartProps> = ({
  data,
  title,
  description,
  variant = 'glass',
  height = 300,
  showLegend = true,
  formatValue,
  className
}) => {
  const defaultColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
  
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length]
  }))

  return (
    <ChartContainer title={title} description={description} variant={variant} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={height / 4}
            innerRadius={height / 8}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1500}
            animationBegin={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip formatter={formatValue} />} />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// Sparkline Component for inline charts
interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = '#6366f1',
  height = 40,
  className
}) => {
  const chartData = data.map((value, index) => ({ index, value }))
  
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export {
  ChartContainer,
  CustomTooltip
}