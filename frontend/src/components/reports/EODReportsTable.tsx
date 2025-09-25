'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  BarChart3
} from 'lucide-react'

// Sample EOD data matching your screenshots
const eodData = [
  {
    date: '2025-09-17',
    salesRep: 'Julius Alba',
    liveCalls: 5,
    closes: 2,
    offersMade: 4,
    cashCollected: '$4,200',
    deposits: 1,
    scheduledCalls: 8,
    showRate: '62.50%',
    callCloseRate: '40.00%',
    cashPerCall: '$840',
    cashPerOffer: '$1,050',
    offerCloseRate: '50.00%'
  },
  {
    date: '2025-09-15',
    salesRep: 'Mark Twain',
    liveCalls: 5,
    closes: 5,
    offersMade: 5,
    cashCollected: '$8,000',
    deposits: 5000,
    scheduledCalls: 8,
    showRate: '62.50%',
    callCloseRate: '100.00%',
    cashPerCall: '$1,600',
    cashPerOffer: '$1,600',
    offerCloseRate: '100.00%'
  },
  {
    date: '2025-09-15',
    salesRep: 'John Wayne',
    liveCalls: 10,
    closes: 20,
    offersMade: 8,
    cashCollected: '$15,000',
    deposits: 5000,
    scheduledCalls: 10,
    showRate: '100.00%',
    callCloseRate: '200.00%',
    cashPerCall: '$1,500',
    cashPerOffer: '$1,875',
    offerCloseRate: '250.00%'
  },
  {
    date: '2025-09-15',
    salesRep: 'Julius Alba',
    liveCalls: 8,
    closes: 5,
    offersMade: 8,
    cashCollected: '$20,000',
    deposits: 10000,
    scheduledCalls: 5,
    showRate: '160.00%',
    callCloseRate: '62.50%',
    cashPerCall: '$2,500',
    cashPerOffer: '$2,500',
    offerCloseRate: '62.50%'
  },
  {
    date: '2025-09-13',
    salesRep: 'Alice McDonald',
    liveCalls: 25,
    closes: 10,
    offersMade: 15,
    cashCollected: '$15,000',
    deposits: 8000,
    scheduledCalls: 25,
    showRate: '100.00%',
    callCloseRate: '40.00%',
    cashPerCall: '$600',
    cashPerOffer: '$1,000',
    offerCloseRate: '66.67%'
  },
  {
    date: '2025-09-13',
    salesRep: 'Alice McDonald',
    liveCalls: 8,
    closes: 5,
    offersMade: 5,
    cashCollected: '$12,000',
    deposits: 5000,
    scheduledCalls: 12,
    showRate: '66.67%',
    callCloseRate: '62.50%',
    cashPerCall: '$1,500',
    cashPerOffer: '$2,400',
    offerCloseRate: '100.00%'
  }
]

export default function EODReportsTable() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRep, setSelectedRep] = useState('All Sales Reps')
  const [currentPage, setCurrentPage] = useState(1)

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSelectedRep('All Sales Reps')
  }

  const exportToExcel = () => {
    // In real app, this would trigger Excel export
    console.log('Exporting to Excel...')
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">End of Day Reports</h1>
          </div>
        </div>
        <Button onClick={exportToExcel} className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Excel</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input w-full"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Sales Rep Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Sales Rep</label>
            <select 
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              className="input w-full"
            >
              <option value="All Sales Reps">All Sales Reps</option>
              <option value="Julius Alba">Julius Alba</option>
              <option value="Mark Twain">Mark Twain</option>
              <option value="John Wayne">John Wayne</option>
              <option value="Alice McDonald">Alice McDonald</option>
            </select>
          </div>

          {/* Clear Filters */}
          <Button 
            variant="ghost" 
            onClick={clearFilters}
            className="flex items-center space-x-2 h-10"
          >
            <Filter className="w-4 h-4" />
            <span>Clear Filters</span>
          </Button>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-soft)] bg-[var(--accent)]">
                <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[100px]">DATE</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[120px]">SALES REP</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[80px]">LIVE CALLS</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[80px]">CLOSES</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[100px]">OFFERS MADE</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[120px]">CASH COLLECTED</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[80px]">DEPOSITS</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[120px]">SCHEDULED CALLS</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[100px]">SHOW RATE</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[120px]">CALL CLOSE RATE</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[100px]">CASH PER CALL</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[110px]">CASH PER OFFER</th>
                <th className="text-center p-4 text-sm font-medium text-[var(--foreground-muted)] min-w-[130px]">OFFER CLOSE RATE</th>
              </tr>
            </thead>
            <tbody>
              {eodData.map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-[var(--border-subtle)] hover:bg-[var(--accent)] transition-colors"
                >
                  <td className="p-4 text-sm text-[var(--foreground)]">{row.date}</td>
                  <td className="p-4 text-sm font-medium text-[var(--foreground)]">{row.salesRep}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.liveCalls}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.closes}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.offersMade}</td>
                  <td className="p-4 text-sm text-center font-medium text-[var(--success)]">{row.cashCollected}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.deposits}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.scheduledCalls}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.showRate}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.callCloseRate}</td>
                  <td className="p-4 text-sm text-center font-medium text-[var(--success)]">{row.cashPerCall}</td>
                  <td className="p-4 text-sm text-center font-medium text-[var(--success)]">{row.cashPerOffer}</td>
                  <td className="p-4 text-sm text-center text-[var(--foreground)]">{row.offerCloseRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--foreground-muted)]">
          Showing 1 to 6 of 6 results
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm text-[var(--foreground-muted)]">1 of 1</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}