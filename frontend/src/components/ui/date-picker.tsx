'use client'

import { useState } from 'react'
import { format, subDays, subWeeks, subMonths, subYears, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
import { Calendar, ChevronDown, Filter, X } from 'lucide-react'

interface DateRange {
  start: Date
  end: Date
  label: string
}

interface DatePickerProps {
  selectedRange?: DateRange
  onRangeChange: (range: DateRange | undefined) => void
  className?: string
  disabled?: boolean
}

const PRESET_RANGES = [
  {
    label: 'Last 7 days',
    getValue: () => ({
      start: subDays(startOfDay(new Date()), 6),
      end: endOfDay(new Date()),
      label: 'Last 7 days'
    })
  },
  {
    label: 'Last 14 days', 
    getValue: () => ({
      start: subDays(startOfDay(new Date()), 13),
      end: endOfDay(new Date()),
      label: 'Last 14 days'
    })
  },
  {
    label: 'Last 30 days',
    getValue: () => ({
      start: subDays(startOfDay(new Date()), 29), 
      end: endOfDay(new Date()),
      label: 'Last 30 days'
    })
  },
  {
    label: 'This week',
    getValue: () => ({
      start: startOfWeek(new Date()),
      end: endOfWeek(new Date()),
      label: 'This week'
    })
  },
  {
    label: 'This month',
    getValue: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
      label: 'This month'
    })
  },
  {
    label: 'Last month',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1)
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
        label: 'Last month'
      }
    }
  },
  {
    label: 'Last 3 months',
    getValue: () => ({
      start: subMonths(startOfMonth(new Date()), 2),
      end: endOfMonth(new Date()),
      label: 'Last 3 months'
    })
  },
  {
    label: 'Last 6 months',
    getValue: () => ({
      start: subMonths(startOfMonth(new Date()), 5),
      end: endOfMonth(new Date()),
      label: 'Last 6 months'
    })
  },
  {
    label: 'This year',
    getValue: () => ({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
      label: 'This year'
    })
  },
  {
    label: 'Last year',
    getValue: () => {
      const lastYear = subYears(new Date(), 1)
      return {
        start: startOfYear(lastYear),
        end: endOfYear(lastYear),
        label: 'Last year'
      }
    }
  }
]

export function DateRangePicker({ selectedRange, onRangeChange, className = '', disabled = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleRangeSelect = (preset: typeof PRESET_RANGES[0]) => {
    const range = preset.getValue()
    onRangeChange(range)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRangeChange(undefined)
  }

  const formatDateRange = (range: DateRange) => {
    if (range.label) return range.label
    
    const startStr = format(range.start, 'MMM dd')
    const endStr = format(range.end, 'MMM dd, yyyy')
    return `${startStr} - ${endStr}`
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center space-x-2 px-3 py-2 text-sm border border-[var(--border-soft)] rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors min-w-[160px] ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <Calendar className="w-4 h-4 text-[var(--foreground-muted)]" />
        <span className="text-[var(--foreground)] flex-1 text-left">
          {selectedRange ? formatDateRange(selectedRange) : 'Select date range'}
        </span>
        {selectedRange && !disabled && (
          <X 
            className="w-4 h-4 text-[var(--foreground-muted)] hover:text-[var(--foreground)]" 
            onClick={handleClear}
          />
        )}
        <ChevronDown className={`w-4 h-4 text-[var(--foreground-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-[var(--surface-elevated)] border border-[var(--border-soft)] rounded-lg shadow-[var(--shadow-floating)] z-20 py-2 max-h-80 overflow-y-auto">
            {PRESET_RANGES.map((preset, index) => (
              <button
                key={preset.label}
                onClick={() => handleRangeSelect(preset)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)] transition-colors ${
                  selectedRange?.label === preset.label ? 'bg-[var(--accent)] text-[var(--primary)]' : 'text-[var(--foreground)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface TimeGroupingPickerProps {
  value: 'daily' | 'weekly' | 'monthly' | 'yearly'
  onChange: (value: 'daily' | 'weekly' | 'monthly' | 'yearly') => void
  className?: string
  disabled?: boolean
}

export function TimeGroupingPicker({ value, onChange, className = '', disabled = false }: TimeGroupingPickerProps) {
  const options = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ] as const

  return (
    <div className={`flex items-center space-x-1 p-1 bg-[var(--accent)] rounded-lg ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => !disabled && onChange(option.value)}
          disabled={disabled}
          className={`px-3 py-1 text-xs font-medium rounded transition-all duration-200 ${
            value === option.value
              ? 'bg-[var(--primary)] text-white shadow-sm'
              : 'text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

interface KPIPickerProps {
  value: 'revenue' | 'units' | 'closes' | 'offers' | 'calls'
  onChange: (value: 'revenue' | 'units' | 'closes' | 'offers' | 'calls') => void
  className?: string
  disabled?: boolean
}

export function KPIPicker({ value, onChange, className = '', disabled = false }: KPIPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { value: 'revenue', label: 'Revenue', icon: '$' },
    { value: 'closes', label: 'Closes', icon: '🎯' },
    { value: 'offers', label: 'Offers', icon: '💼' },
    { value: 'calls', label: 'Calls', icon: '📞' },
    { value: 'units', label: 'Units', icon: '📦' }
  ] as const

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center space-x-2 px-3 py-1 text-xs bg-transparent text-[var(--foreground-muted)] border border-[var(--border-soft)] rounded px-2 py-1 hover:bg-[var(--surface-hover)] transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>{selectedOption?.label || 'Select KPI'}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 w-32 bg-[var(--surface-elevated)] border border-[var(--border-soft)] rounded-lg shadow-[var(--shadow-floating)] z-20 py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-[var(--surface-hover)] transition-colors flex items-center space-x-2 ${
                  value === option.value ? 'bg-[var(--accent)] text-[var(--primary)]' : 'text-[var(--foreground)]'
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}