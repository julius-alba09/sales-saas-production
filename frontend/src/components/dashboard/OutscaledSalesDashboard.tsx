'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  Phone, 
  Target, 
  TrendingUp, 
  Users, 
  UserPlus,
  Plus,
  FileText,
  Calendar,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Archive,
  Star,
  Zap,
  MoreHorizontal,
  ChevronDown,
  ExternalLink
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

// Sample data matching your dashboard
const salesData = {
  metrics: {
    revenue: 74200,
    totalCalls: 61,
    offersMade: 45,
    closeRate: 77.0
  },
  revenueOverTime: [
    { date: 'Sep 13', value: 15000 },
    { date: 'Sep 14', value: 25000 },
    { date: 'Sep 15', value: 45000 },
    { date: 'Sep 16', value: 35000 },
    { date: 'Sep 17', value: 10000 }
  ],
  topPerformers: [
    { name: 'Alice McDonald', revenue: 27000, closes: 15 },
    { name: 'Julius Alba', revenue: 24200, closes: 12 },
    { name: 'John Wayne', revenue: 19500, closes: 10 }
  ],
  teamMembers: [
    { name: 'Julius Alba', avatar: 'JA', status: 'Active' },
    { name: 'Mark Twain', avatar: 'MT', status: 'Active' },
    { name: 'Alice McDonald', avatar: 'AM', status: 'Active' },
    { name: 'Nathan Witkowski', avatar: 'NW', status: 'Active' }
  ],
  currentOffers: [
    { title: 'CONSULTING 1:1', type: 'Coaching', value: 500, status: 'Active' },
    { title: 'SYSTEM BUILDOUT + AUDIT', type: 'Other', value: 10000, status: 'Active' },
    { title: 'HIGH-TICKET CONSULTING RETAINER', type: 'Coaching', value: 10000, status: 'Active' }
  ],
  eodReports: [
    { date: '2025-09-17', salesRep: 'Julius Alba', liveCalls: 5, closes: 2, offers: 4, cashCollected: 4200, deposits: 1, scheduledCalls: 8, showRate: 62.5, closeRate: 40.0, callsPerOffer: 840, cashPerOffer: 1050 },
    { date: '2025-09-15', salesRep: 'Mark Twain', liveCalls: 5, closes: 5, offers: 5, cashCollected: 8000, deposits: 3000, scheduledCalls: 8, showRate: 62.5, closeRate: 100.0, callsPerOffer: 1600, cashPerOffer: 1600 },
    { date: '2025-09-15', salesRep: 'John Wayne', liveCalls: 10, closes: 20, offers: 8, cashCollected: 15000, deposits: 5000, scheduledCalls: 10, showRate: 100.0, closeRate: 200.0, callsPerOffer: 1500, cashPerOffer: 1875 },
    { date: '2025-09-15', salesRep: 'Julius Alba', liveCalls: 8, closes: 5, offers: 8, cashCollected: 20000, deposits: 10000, scheduledCalls: 5, showRate: 160.0, closeRate: 62.5, callsPerOffer: 2500, cashPerOffer: 2500 },
    { date: '2025-09-13', salesRep: 'Alice McDonald', liveCalls: 25, closes: 10, offers: 15, cashCollected: 15000, deposits: 9000, scheduledCalls: 25, showRate: 100.0, closeRate: 40.0, callsPerOffer: 600, cashPerOffer: 1000 },
    { date: '2025-09-13', salesRep: 'Alice McDonald', liveCalls: 8, closes: 5, offers: 5, cashCollected: 12000, deposits: 5000, scheduledCalls: 12, showRate: 66.67, closeRate: 62.5, callsPerOffer: 1500, cashPerOffer: 2400 }
  ]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-slate-300 text-sm">{label}</p>
        <p className="text-green-400 text-sm font-semibold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export default function OutscaledSalesDashboard() {
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' })
  const [selectedRep, setSelectedRep] = useState('All Sales Reps')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Sales Dashboard</h1>
            <p className="text-sm text-slate-400">Notionalize</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <div className="flex items-center space-x-6">
          <button className="text-blue-400 font-medium text-sm border-b-2 border-blue-400 pb-2">
            Dashboard
          </button>
          <button className="text-slate-400 hover:text-white text-sm pb-2 flex items-center space-x-2">
            <Archive className="w-4 h-4" />
            <span>Archive (1)</span>
          </button>
        </div>
        
        <div className="text-sm text-slate-400">
          $ $4,200 • Julius Alba • 5d ago
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${salesData.metrics.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Calls</p>
                  <p className="text-2xl font-bold text-white">
                    {salesData.metrics.totalCalls}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-pink-600 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Offers Made</p>
                  <p className="text-2xl font-bold text-white">
                    {salesData.metrics.offersMade}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-600 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Close Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {salesData.metrics.closeRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Over Time Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>📊 Revenue Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData.revenueOverTime}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <YAxis 
                        hide
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Add EOD
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
              
              <Button 
                className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
              
              <Button 
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Rep
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-600 rounded-full text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{performer.name}</p>
                        <p className="text-slate-400 text-sm">
                          ${performer.revenue.toLocaleString()} • {performer.closes} closes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Your Team */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Your Team</span>
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-slate-400">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-green-400 text-sm">{member.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Offers */}
        <Card className="bg-slate-800 border-slate-600 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Target className="w-4 h-4 text-red-500" />
              <span>Current Offers</span>
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-400">
              <Plus className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.currentOffers.map((offer) => (
                <div key={offer.title} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-semibold">{offer.title}</p>
                    <p className="text-slate-400 text-sm">{offer.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${offer.value.toLocaleString()}</p>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                      {offer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* End of Day Reports */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>End of Day Reports</span>
            </CardTitle>
            <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">Start Date</label>
                <input
                  type="date"
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
                  placeholder="mm/dd/yyyy"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">End Date</label>
                <input
                  type="date"
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
                  placeholder="mm/dd/yyyy"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">Sales Rep</label>
                <select className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm">
                  <option>All Sales Reps</option>
                  <option>Julius Alba</option>
                  <option>Mark Twain</option>
                  <option>John Wayne</option>
                  <option>Alice McDonald</option>
                </select>
              </div>
              <Button variant="outline" size="sm" className="text-slate-400 border-slate-600">
                Clear Filters
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Sales Rep</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Live Calls</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Closes</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Offers Made</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Cash Collected</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Deposits</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Scheduled Calls</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Show Rate</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Close Rate</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Cash per Offer</th>
                    <th className="pb-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Cash per Call</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.eodReports.map((report, index) => (
                    <tr key={index} className="border-b border-slate-700">
                      <td className="py-4 text-sm text-white">{report.date}</td>
                      <td className="py-4 text-sm text-white">{report.salesRep}</td>
                      <td className="py-4 text-sm text-white">{report.liveCalls}</td>
                      <td className="py-4 text-sm text-white">{report.closes}</td>
                      <td className="py-4 text-sm text-white">{report.offers}</td>
                      <td className="py-4 text-sm text-white">${report.cashCollected.toLocaleString()}</td>
                      <td className="py-4 text-sm text-white">{report.deposits}</td>
                      <td className="py-4 text-sm text-white">{report.scheduledCalls}</td>
                      <td className="py-4 text-sm text-white">{report.showRate}%</td>
                      <td className="py-4 text-sm text-white">{report.closeRate}%</td>
                      <td className="py-4 text-sm text-white">${report.callsPerOffer}</td>
                      <td className="py-4 text-sm text-white">${report.cashPerOffer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-slate-400">
                Showing 1 to 6 of 6 results
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-slate-400 border-slate-600">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </Button>
                <span className="text-sm text-slate-400">1 of 1</span>
                <Button variant="outline" size="sm" className="text-slate-400 border-slate-600">
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}