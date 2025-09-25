'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  BarChart3, 
  DollarSign,
  Phone,
  Trophy,
  TrendingUp,
  Activity,
  Target,
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Zap,
  ArrowRight,
  Settings,
  Package,
  FileText,
  UserPlus,
  ChevronRight,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation/Navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { DarkChart, sampleChartData } from '@/components/charts/DarkChart'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'sales_rep' | 'setter' | 'manager'
  avatar?: string
  closes: number
  revenue: number
  callsToday: number
  status: 'active' | 'busy' | 'away' | 'offline'
  lastActive: string
  performance: number // percentage
  firstName: string
  lastName: string
}

interface QuickAction {
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  href?: string
  onClick?: () => void
}

export default function AgencyDashboard() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today')
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'sales_rep'
  })

  // Mock data - would come from API
  const stats = {
    totalSalesReps: 8,
    totalSetters: 5,
    activeUsers: 11,
    totalRevenue: 145750.00,
    totalCalls: timeRange === 'today' ? 186 : timeRange === 'week' ? 1240 : 5200,
    totalOffers: timeRange === 'today' ? 45 : timeRange === 'week' ? 312 : 1480,
    totalCloses: timeRange === 'today' ? 18 : timeRange === 'week' ? 127 : 589,
    conversionRate: 9.7,
    growthRate: 0.125
  }

  const teamMembers: TeamMember[] = [
    { 
      id: '1', 
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      role: 'sales_rep',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      closes: 45, 
      revenue: 18500, 
      callsToday: 12,
      status: 'active',
      lastActive: '2 min ago',
      performance: 92
    },
    { 
      id: '2', 
      name: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith', 
      email: 'jane.smith@company.com',
      role: 'sales_rep',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=150&h=150&fit=crop&crop=face',
      closes: 38, 
      revenue: 15200, 
      callsToday: 8,
      status: 'busy',
      lastActive: 'now',
      performance: 88
    },
    { 
      id: '3', 
      name: 'Mike Johnson',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@company.com',
      role: 'setter',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      closes: 0, 
      revenue: 0, 
      callsToday: 25,
      status: 'active',
      lastActive: '5 min ago',
      performance: 85
    },
    { 
      id: '4', 
      name: 'Sarah Williams',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@company.com',
      role: 'sales_rep',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      closes: 28, 
      revenue: 12800, 
      callsToday: 6,
      status: 'away',
      lastActive: '1 hour ago',
      performance: 76
    },
    { 
      id: '5', 
      name: 'Alex Chen',
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'alex.chen@company.com',
      role: 'setter',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      closes: 0, 
      revenue: 0, 
      callsToday: 18,
      status: 'active',
      lastActive: '1 min ago',
      performance: 94
    },
    { 
      id: '6', 
      name: 'Emily Davis',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@company.com',
      role: 'sales_rep',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      closes: 22, 
      revenue: 9200, 
      callsToday: 4,
      status: 'offline',
      lastActive: '3 hours ago',
      performance: 71
    }
  ]

  // Status colors for team members
  const statusColors = {
    active: 'bg-green-500',
    busy: 'bg-yellow-500',
    away: 'bg-orange-500',
    offline: 'bg-gray-500'
  }

  // Helper function to get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'sales_rep':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'setter':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'manager':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  const handleAddEOD = () => {
    router.push('/reports/eod')
  }

  const handleAddProduct = () => {
    router.push('/products')
  }

  const handleAddSalesRep = () => {
    // In a real app, this would open a modal or navigate to a form
    alert('Add Sales Rep functionality - would open a form to add new sales representative')
  }

  const handleAddSetter = () => {
    // In a real app, this would open a modal or navigate to a form
    alert('Add Appointment Setter functionality - would open a form to add new appointment setter')
  }

  const handleViewTeamMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId)
    if (member) {
      if (member.role === 'sales_rep') {
        router.push(`/dashboard/sales-rep?member=${memberId}`)
      } else if (member.role === 'setter') {
        router.push(`/dashboard/setter?member=${memberId}`)
      }
    }
  }

  const handleAddMember = () => {
    // In a real app, this would make an API call to create a new team member
    console.log('Adding new member:', newMember)
    setShowAddMemberModal(false)
    setNewMember({ name: '', email: '', role: 'sales_rep' })
    // Show success message
    alert(`Team member ${newMember.name} has been added successfully!`)
  }

  const quickActions: QuickAction[] = [
    {
      title: 'Add EOD Report',
      description: 'Submit end of day performance report',
      icon: FileText,
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      onClick: handleAddEOD
    },
    {
      title: 'Add Product',
      description: 'Add new product to catalog',
      icon: Package,
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
      onClick: handleAddProduct
    },
    {
      title: 'Add Sales Rep',
      description: 'Onboard new sales representative',
      icon: UserPlus,
      gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      onClick: handleAddSalesRep
    },
    {
      title: 'Add Appointment Setter',
      description: 'Add new appointment setter to team',
      icon: Phone,
      gradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
      onClick: handleAddSetter
    }
  ]

  const statusColors = {
    active: 'bg-emerald-400',
    busy: 'bg-amber-400', 
    away: 'bg-orange-400',
    offline: 'bg-slate-400'
  }


  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <div className="min-h-screen">
        {/* Navigation */}
        <Navigation />

      {/* Background */}
      <div className="absolute inset-0 top-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-100/50 dark:from-slate-950/50 dark:via-slate-900/30 dark:to-slate-800/50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Dashboard Header */}
      <div className="relative z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Agency Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Real-time overview of your team performance
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-1 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                {(['today', 'week', 'month'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      timeRange === range
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <Breadcrumb />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Calls */}
          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Calls</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalCalls}</p>
              </div>
              <Phone className="w-8 h-8 text-indigo-500" />
            </div>
          </Card>

          {/* Offers */}
          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Offers</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalOffers}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          {/* Closes */}
          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Closes</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalCloses}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          {/* Revenue */}
          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${(stats.totalRevenue / 1000).toFixed(0)}k</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </Card>

          {/* Close Rate */}
          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Close Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          {/* Active Team */}
          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Team</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-amber-500" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.title}
                    onClick={action.onClick}
                    className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-200 text-left group hover:shadow-lg"
                  >
                    <div className={`inline-flex p-2 rounded-lg ${action.gradient} mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Your Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleViewTeamMember(member.id)}
                  className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-200 text-left group hover:shadow-lg hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-white dark:border-slate-700 shadow-lg">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                        )}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${statusColors[member.status]} rounded-full border-2 border-white dark:border-slate-800 shadow-sm`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">{member.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">{member.email}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${getRoleColor(member.role)}`}>
                          {member.role === 'sales_rep' ? 'Sales Rep' : member.role === 'setter' ? 'Setter' : 'Manager'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 flex-shrink-0" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Calls Today</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{member.callsToday}</span>
                    </div>
                    
                    {member.role === 'sales_rep' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Closes</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{member.closes}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Revenue</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">${(member.revenue / 1000).toFixed(1)}k</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Performance</span>
                      <span className={`font-semibold ${
                        member.performance >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                        member.performance >= 80 ? 'text-blue-600 dark:text-blue-400' :
                        member.performance >= 70 ? 'text-amber-600 dark:text-amber-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {member.performance}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          member.performance >= 90 ? 'bg-emerald-500' :
                          member.performance >= 80 ? 'bg-blue-500' :
                          member.performance >= 70 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${member.performance}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Last active: {member.lastActive}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Chart */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DarkChart data={sampleChartData} height={300} className="-m-6" />
          </CardContent>
        </Card>

          {/* EOD Submission Table */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/20 dark:border-slate-800/20 p-6 hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                Recent EOD Submissions
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>Live data</span>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg border border-slate-200/40 dark:border-slate-700/40">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                      <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Date</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Rep</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Cash</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Sched</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Live</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Show%</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Offers</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Offer%</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Deps</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Closes</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Close%</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">Call%</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide border-r border-slate-200/30 dark:border-slate-700/30">$/Offer</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">$/Call</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/40 dark:divide-slate-700/40">
                    {[
                      { 
                        date: '2025-09-21', 
                        name: 'John Doe', 
                        cashCollected: 12500, 
                        scheduledCalls: 45, 
                        liveCalls: 35, 
                        showRate: 77.8, 
                        offersMade: 28, 
                        offerRate: 80.0, 
                        deposits: 5, 
                        closes: 8, 
                        offerCloseRate: 28.6, 
                        callCloseRate: 22.9, 
                        cashPerOffer: 446, 
                        cashPerCall: 357 
                      },
                      { 
                        date: '2025-09-21', 
                        name: 'Jane Smith', 
                        cashCollected: 9800, 
                        scheduledCalls: 38, 
                        liveCalls: 30, 
                        showRate: 78.9, 
                        offersMade: 24, 
                        offerRate: 80.0, 
                        deposits: 4, 
                        closes: 6, 
                        offerCloseRate: 25.0, 
                        callCloseRate: 20.0, 
                        cashPerOffer: 408, 
                        cashPerCall: 327 
                      },
                      { 
                        date: '2025-09-21', 
                        name: 'Mike Johnson', 
                        cashCollected: 7500, 
                        scheduledCalls: 32, 
                        liveCalls: 25, 
                        showRate: 78.1, 
                        offersMade: 19, 
                        offerRate: 76.0, 
                        deposits: 3, 
                        closes: 5, 
                        offerCloseRate: 26.3, 
                        callCloseRate: 20.0, 
                        cashPerOffer: 395, 
                        cashPerCall: 300 
                      },
                      { 
                        date: '2025-09-20', 
                        name: 'Sarah Williams', 
                        cashCollected: 14200, 
                        scheduledCalls: 41, 
                        liveCalls: 33, 
                        showRate: 80.5, 
                        offersMade: 26, 
                        offerRate: 78.8, 
                        deposits: 6, 
                        closes: 9, 
                        offerCloseRate: 34.6, 
                        callCloseRate: 27.3, 
                        cashPerOffer: 546, 
                        cashPerCall: 430 
                      },
                      { 
                        date: '2025-09-20', 
                        name: 'David Brown', 
                        cashCollected: 6200, 
                        scheduledCalls: 29, 
                        liveCalls: 22, 
                        showRate: 75.9, 
                        offersMade: 18, 
                        offerRate: 81.8, 
                        deposits: 2, 
                        closes: 4, 
                        offerCloseRate: 22.2, 
                        callCloseRate: 18.2, 
                        cashPerOffer: 344, 
                        cashPerCall: 282 
                      }
                    ].map((submission, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400 border-r border-slate-200/20 dark:border-slate-700/20">
                          {new Date(submission.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap border-r border-slate-200/20 dark:border-slate-700/20">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                              {submission.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-slate-100 text-xs truncate max-w-20">{submission.name.split(' ')[0]}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400 text-right border-r border-slate-200/20 dark:border-slate-700/20">
                          ${(submission.cashCollected / 1000).toFixed(0)}k
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-slate-900 dark:text-slate-100 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.scheduledCalls}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-blue-600 dark:text-blue-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.liveCalls}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-purple-600 dark:text-purple-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.showRate.toFixed(0)}%
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-indigo-600 dark:text-indigo-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.offersMade}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-cyan-600 dark:text-cyan-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.offerRate.toFixed(0)}%
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-orange-600 dark:text-orange-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.deposits}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-emerald-600 dark:text-emerald-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.closes}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-teal-600 dark:text-teal-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.offerCloseRate.toFixed(0)}%
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-semibold text-rose-600 dark:text-rose-400 text-center border-r border-slate-200/20 dark:border-slate-700/20">
                          {submission.callCloseRate.toFixed(0)}%
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-bold text-slate-900 dark:text-slate-100 text-right border-r border-slate-200/20 dark:border-slate-700/20">
                          ${submission.cashPerOffer}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-bold text-slate-900 dark:text-slate-100 text-right">
                          ${submission.cashPerCall}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                View All Submissions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        
        {/* Add Team Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Add Team Member
                  </h2>
                  <button 
                    onClick={() => setShowAddMemberModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleAddMember(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Role
                    </label>
                    <select
                      value={newMember.role}
                      onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    >
                      <option value="sales_rep">Sales Representative</option>
                      <option value="appointment_setter">Appointment Setter</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddMemberModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Member
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
