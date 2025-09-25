'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useProfile } from './useProfile'
import { useRealtimeSubscription } from './useRealtimeSubscription'
import { Database } from '@/types/supabase'

type ProductSales = Database['public']['Tables']['product_sales']['Row']
type DailyMetrics = Database['public']['Tables']['daily_metrics']['Row']
type Products = Database['public']['Tables']['products']['Row']
type UserProfiles = Database['public']['Tables']['user_profiles']['Row']

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

interface RevenueQueryParams {
  startDate?: Date
  endDate?: Date
  userId?: string
  productId?: string
}

// Hook to fetch revenue data with detailed joins
export function useRevenueData(params: RevenueQueryParams = {}) {
  const { context } = useProfile()
  
  // Set up real-time subscriptions
  useRealtimeSubscription({
    table: 'product_sales',
    invalidateQueries: ['revenue-data', 'revenue-summary']
  })
  
  useRealtimeSubscription({
    table: 'daily_metrics', 
    invalidateQueries: ['revenue-data', 'revenue-summary']
  })

  return useQuery({
    queryKey: ['revenue-data', context?.organization_id, params],
    queryFn: async (): Promise<RevenueDataPoint[]> => {
      if (!context?.organization_id) return []

      let query = supabase
        .from('product_sales')
        .select(`
          *,
          products:product_id (
            name,
            price
          ),
          daily_metrics:daily_metric_id (
            date,
            closes,
            offers_made,
            live_calls,
            user_profiles:user_id (
              first_name,
              last_name
            )
          )
        `)
        .eq('organization_id', context.organization_id)
        .order('created_at', { ascending: false })

      // Apply date filters if provided
      if (params.startDate) {
        query = query.gte('daily_metrics.date', params.startDate.toISOString().split('T')[0])
      }
      if (params.endDate) {
        query = query.lte('daily_metrics.date', params.endDate.toISOString().split('T')[0])
      }

      // Apply user filter if provided
      if (params.userId) {
        query = query.eq('daily_metrics.user_profiles.id', params.userId)
      }

      // Apply product filter if provided  
      if (params.productId) {
        query = query.eq('product_id', params.productId)
      }

      const { data, error } = await query.limit(1000)

      if (error) {
        console.error('Error fetching revenue data:', error)
        throw error
      }

      // Transform data to RevenueDataPoint format
      return (data || []).map(sale => ({
        date: sale.daily_metrics?.date || new Date().toISOString().split('T')[0],
        revenue: sale.cash_collected || 0,
        units: sale.units_closed || 0,
        product_name: sale.products?.name || 'Unknown Product',
        user_name: sale.daily_metrics?.user_profiles ? 
          `${sale.daily_metrics.user_profiles.first_name} ${sale.daily_metrics.user_profiles.last_name}` : 
          'Unknown User',
        closes: sale.daily_metrics?.closes || 0,
        offers: sale.daily_metrics?.offers_made || 0,
        calls: sale.daily_metrics?.live_calls || 0,
      }))
    },
    enabled: !!context?.organization_id
  })
}

// Hook to fetch revenue summary/totals
export function useRevenueSummary(params: RevenueQueryParams = {}) {
  const { context } = useProfile()

  return useQuery({
    queryKey: ['revenue-summary', context?.organization_id, params],
    queryFn: async () => {
      if (!context?.organization_id) return null

      let query = supabase
        .from('product_sales')
        .select(`
          cash_collected,
          units_closed,
          daily_metrics:daily_metric_id (
            date,
            closes,
            offers_made,
            live_calls
          )
        `)
        .eq('organization_id', context.organization_id)

      // Apply date filters
      if (params.startDate) {
        query = query.gte('daily_metrics.date', params.startDate.toISOString().split('T')[0])
      }
      if (params.endDate) {
        query = query.lte('daily_metrics.date', params.endDate.toISOString().split('T')[0])
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching revenue summary:', error)
        throw error
      }

      // Calculate totals
      const summary = (data || []).reduce((acc, sale) => ({
        totalRevenue: acc.totalRevenue + (sale.cash_collected || 0),
        totalUnits: acc.totalUnits + (sale.units_closed || 0),
        totalCloses: acc.totalCloses + (sale.daily_metrics?.closes || 0),
        totalOffers: acc.totalOffers + (sale.daily_metrics?.offers_made || 0),
        totalCalls: acc.totalCalls + (sale.daily_metrics?.live_calls || 0),
        count: acc.count + 1
      }), {
        totalRevenue: 0,
        totalUnits: 0,
        totalCloses: 0,
        totalOffers: 0,
        totalCalls: 0,
        count: 0
      })

      return summary
    },
    enabled: !!context?.organization_id
  })
}

// Hook to fetch revenue by product breakdown
export function useRevenueByProduct(params: RevenueQueryParams = {}) {
  const { context } = useProfile()

  return useQuery({
    queryKey: ['revenue-by-product', context?.organization_id, params],
    queryFn: async () => {
      if (!context?.organization_id) return []

      let query = supabase
        .from('product_sales')
        .select(`
          cash_collected,
          units_closed,
          products:product_id (
            name,
            price
          ),
          daily_metrics:daily_metric_id (
            date
          )
        `)
        .eq('organization_id', context.organization_id)

      // Apply date filters
      if (params.startDate) {
        query = query.gte('daily_metrics.date', params.startDate.toISOString().split('T')[0])
      }
      if (params.endDate) {
        query = query.lte('daily_metrics.date', params.endDate.toISOString().split('T')[0])
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching revenue by product:', error)
        throw error
      }

      // Group by product
      const productMap = new Map()
      
      ;(data || []).forEach(sale => {
        const productName = sale.products?.name || 'Unknown Product'
        const existing = productMap.get(productName) || { 
          product_name: productName, 
          revenue: 0, 
          units: 0 
        }
        
        productMap.set(productName, {
          ...existing,
          revenue: existing.revenue + (sale.cash_collected || 0),
          units: existing.units + (sale.units_closed || 0)
        })
      })

      return Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
    },
    enabled: !!context?.organization_id
  })
}

// Hook to fetch revenue by user/rep breakdown  
export function useRevenueByUser(params: RevenueQueryParams = {}) {
  const { context } = useProfile()

  return useQuery({
    queryKey: ['revenue-by-user', context?.organization_id, params],
    queryFn: async () => {
      if (!context?.organization_id) return []

      let query = supabase
        .from('product_sales')
        .select(`
          cash_collected,
          units_closed,
          daily_metrics:daily_metric_id (
            date,
            closes,
            offers_made,
            user_profiles:user_id (
              id,
              first_name,
              last_name,
              role
            )
          )
        `)
        .eq('organization_id', context.organization_id)

      // Apply date filters
      if (params.startDate) {
        query = query.gte('daily_metrics.date', params.startDate.toISOString().split('T')[0])
      }
      if (params.endDate) {
        query = query.lte('daily_metrics.date', params.endDate.toISOString().split('T')[0])
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching revenue by user:', error)
        throw error
      }

      // Group by user
      const userMap = new Map()
      
      ;(data || []).forEach(sale => {
        const user = sale.daily_metrics?.user_profiles
        if (!user) return
        
        const userId = user.id
        const userName = `${user.first_name} ${user.last_name}`
        const existing = userMap.get(userId) || { 
          user_id: userId,
          user_name: userName,
          role: user.role,
          revenue: 0, 
          units: 0,
          closes: 0,
          offers: 0
        }
        
        userMap.set(userId, {
          ...existing,
          revenue: existing.revenue + (sale.cash_collected || 0),
          units: existing.units + (sale.units_closed || 0),
          closes: existing.closes + (sale.daily_metrics?.closes || 0),
          offers: existing.offers + (sale.daily_metrics?.offers_made || 0)
        })
      })

      return Array.from(userMap.values())
        .sort((a, b) => b.revenue - a.revenue)
    },
    enabled: !!context?.organization_id
  })
}

// Hook to calculate revenue growth over time periods
export function useRevenueGrowth(params: RevenueQueryParams & { 
  periodType?: 'daily' | 'weekly' | 'monthly' | 'yearly' 
} = {}) {
  const { context } = useProfile()
  const { periodType = 'monthly' } = params

  return useQuery({
    queryKey: ['revenue-growth', context?.organization_id, params, periodType],
    queryFn: async () => {
      if (!context?.organization_id) return []

      // Get revenue data for the specified time period and the previous period
      const now = new Date()
      const currentPeriodStart = params.startDate || new Date(now.getFullYear(), now.getMonth(), 1)
      const currentPeriodEnd = params.endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0)
      
      // Calculate previous period
      let previousPeriodStart: Date
      let previousPeriodEnd: Date
      
      switch (periodType) {
        case 'daily':
          previousPeriodStart = new Date(currentPeriodStart.getTime() - 24 * 60 * 60 * 1000)
          previousPeriodEnd = new Date(currentPeriodEnd.getTime() - 24 * 60 * 60 * 1000)
          break
        case 'weekly':
          previousPeriodStart = new Date(currentPeriodStart.getTime() - 7 * 24 * 60 * 60 * 1000)
          previousPeriodEnd = new Date(currentPeriodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'yearly':
          previousPeriodStart = new Date(currentPeriodStart.getFullYear() - 1, currentPeriodStart.getMonth(), currentPeriodStart.getDate())
          previousPeriodEnd = new Date(currentPeriodEnd.getFullYear() - 1, currentPeriodEnd.getMonth(), currentPeriodEnd.getDate())
          break
        default: // monthly
          previousPeriodStart = new Date(currentPeriodStart.getFullYear(), currentPeriodStart.getMonth() - 1, 1)
          previousPeriodEnd = new Date(currentPeriodStart.getFullYear(), currentPeriodStart.getMonth(), 0)
          break
      }

      // Fetch current period data
      const currentQuery = supabase
        .from('product_sales')
        .select('cash_collected, daily_metrics:daily_metric_id (date)')
        .eq('organization_id', context.organization_id)
        .gte('daily_metrics.date', currentPeriodStart.toISOString().split('T')[0])
        .lte('daily_metrics.date', currentPeriodEnd.toISOString().split('T')[0])

      // Fetch previous period data
      const previousQuery = supabase
        .from('product_sales')
        .select('cash_collected, daily_metrics:daily_metric_id (date)')
        .eq('organization_id', context.organization_id)
        .gte('daily_metrics.date', previousPeriodStart.toISOString().split('T')[0])
        .lte('daily_metrics.date', previousPeriodEnd.toISOString().split('T')[0])

      const [currentResult, previousResult] = await Promise.all([
        currentQuery,
        previousQuery
      ])

      if (currentResult.error || previousResult.error) {
        throw currentResult.error || previousResult.error
      }

      const currentRevenue = (currentResult.data || [])
        .reduce((sum, sale) => sum + (sale.cash_collected || 0), 0)
      
      const previousRevenue = (previousResult.data || [])
        .reduce((sum, sale) => sum + (sale.cash_collected || 0), 0)

      const growthRate = previousRevenue > 0 ? 
        ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

      return {
        currentPeriod: {
          start: currentPeriodStart,
          end: currentPeriodEnd,
          revenue: currentRevenue
        },
        previousPeriod: {
          start: previousPeriodStart,
          end: previousPeriodEnd,
          revenue: previousRevenue
        },
        growthRate,
        growthAmount: currentRevenue - previousRevenue
      }
    },
    enabled: !!context?.organization_id
  })
}