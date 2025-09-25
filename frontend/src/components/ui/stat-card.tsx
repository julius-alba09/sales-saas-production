'use client'

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string | number
  changeType?: 'increase' | 'decrease' | 'neutral'
  trend?: number[]
  className?: string
  variant?: 'default' | 'glass' | 'gradient' | 'neon'
  animated?: boolean
  delay?: number
  prefix?: string
  suffix?: string
}

const TrendIcon = ({ type, className }: { type: 'increase' | 'decrease' | 'neutral', className?: string }) => {
  const icons = {
    increase: TrendingUp,
    decrease: TrendingDown,
    neutral: Minus
  }
  const Icon = icons[type]
  return <Icon className={className} />
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  trend,
  className,
  variant = 'default',
  animated = true,
  delay = 0,
  prefix = '',
  suffix = '',
  ...props
}, ref) => {
  const changeColors = {
    increase: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950',
    decrease: 'text-red-500 bg-red-50 dark:bg-red-950',
    neutral: 'text-slate-500 bg-slate-50 dark:bg-slate-950'
  }

  const iconColors = {
    increase: 'text-emerald-500',
    decrease: 'text-red-500', 
    neutral: 'text-slate-500'
  }

  const cardVariants = {
    default: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl",
    glass: "glass-card bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl hover:bg-white/10",
    gradient: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200/50 dark:border-indigo-700/50 shadow-xl",
    neon: "bg-slate-900/90 border border-indigo-500/30 shadow-[0_0_20px] shadow-indigo-500/20 hover:shadow-indigo-500/40"
  }

  const MotionCard = animated ? motion.div : 'div'
  const motionProps = animated ? {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, delay, ease: "easeOut" },
    whileHover: { y: -2, scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {}

  return (
    <MotionCard
      ref={ref}
      className={cn(
        "rounded-xl p-6 transition-all duration-300 group relative overflow-hidden",
        cardVariants[variant],
        className
      )}
      {...motionProps}
      {...props}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors duration-200",
              variant === 'glass' ? "bg-white/10" : "bg-slate-100 dark:bg-slate-800"
            )}>
              {icon}
            </div>
            <div>
              <p className={cn(
                "text-sm font-medium transition-colors duration-200",
                variant === 'glass' ? "text-white/80" : "text-slate-600 dark:text-slate-400"
              )}>
                {title}
              </p>
            </div>
          </div>

          {change && (
            <div className={cn(
              "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200",
              changeColors[changeType]
            )}>
              <TrendIcon type={changeType} className="w-3 h-3" />
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className={cn(
            "text-2xl font-bold transition-colors duration-200",
            variant === 'glass' ? "text-white" : "text-slate-900 dark:text-slate-100"
          )}>
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </div>
        </div>

        {/* Trend Line */}
        {trend && trend.length > 0 && (
          <div className="mt-4">
            <div className="h-8 flex items-end space-x-1">
              {trend.map((point, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "flex-1 rounded-sm transition-colors duration-200",
                    variant === 'glass' ? "bg-white/20" : "bg-indigo-200 dark:bg-indigo-800"
                  )}
                  style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                  transition={{ duration: 0.5, delay: delay + (index * 0.1) }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Glow effect for neon variant */}
      {variant === 'neon' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
    </MotionCard>
  )
})
StatCard.displayName = "StatCard"

export { StatCard }