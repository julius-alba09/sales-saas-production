'use client'

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface DarkChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
  className?: string
}

// Custom Dark Tooltip matching the reference style
const DarkTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm p-2 rounded-lg shadow-xl border border-slate-700/50">
        <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-slate-400 text-xs">
            Value: <span className="font-semibold text-white">{payload[0].value}</span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export function DarkChart({ data, height = 320, className = "" }: DarkChartProps) {
  return (
    <div className={`bg-slate-900 rounded-xl p-6 ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height={height - 48}>
        <AreaChart 
          data={data} 
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <defs>
            {/* Orange to Red Gradient for Fill */}
            <linearGradient id="darkAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.4}/>
              <stop offset="30%" stopColor="#ea580c" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0}/>
            </linearGradient>
            
            {/* Orange to Red Gradient for Stroke */}
            <linearGradient id="darkStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316"/>
              <stop offset="50%" stopColor="#ea580c"/>
              <stop offset="100%" stopColor="#dc2626"/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 12, 
              fill: '#64748b', 
              fontWeight: 500,
              dy: 8
            }}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 12, 
              fill: '#64748b', 
              fontWeight: 500
            }}
            tickFormatter={(value) => value.toString()}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          
          <Tooltip content={<DarkTooltip />} />
          
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#darkStrokeGradient)"
            strokeWidth={2}
            fill="url(#darkAreaGradient)"
            dot={false}
            activeDot={{ 
              r: 5, 
              stroke: '#f97316', 
              strokeWidth: 2, 
              fill: '#1e293b',
              filter: 'drop-shadow(0 2px 4px rgba(249, 115, 22, 0.3))'
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Sample data that matches your reference chart
export const sampleChartData = [
  { name: 'Mar 2025', value: 9 },
  { name: 'Apr 2025', value: 14 },
  { name: 'May 2025', value: 16 },
  { name: 'Jun 2025', value: 12 },
  { name: 'Jul 2025', value: 16 },
  { name: 'Aug 2025', value: 14 },
  { name: 'Sep 2025', value: 4 },
]