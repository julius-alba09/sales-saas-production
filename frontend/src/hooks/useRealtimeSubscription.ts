'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { useProfile } from './useProfile'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

interface SubscriptionConfig {
  table: TableName
  filter?: string
  invalidateQueries?: string[]
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
}

export function useRealtimeSubscription(config: SubscriptionConfig) {
  const queryClient = useQueryClient()
  const { context } = useProfile()
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    if (!context?.organization_id) return

    const { table, filter, invalidateQueries, onInsert, onUpdate, onDelete } = config

    // Create subscription
    let subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table as string,
          filter: filter || `organization_id=eq.${context.organization_id}`
        },
        (payload) => {
          console.log(`Real-time ${payload.eventType} on ${table}:`, payload)

          // Call specific handlers
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload)
              break
            case 'UPDATE':
              onUpdate?.(payload)
              break
            case 'DELETE':
              onDelete?.(payload)
              break
          }

          // Invalidate specified queries
          if (invalidateQueries) {
            invalidateQueries.forEach(queryKey => {
              queryClient.invalidateQueries({ queryKey: [queryKey] })
            })
          }

          // Default invalidations based on table
          switch (table) {
            case 'daily_metrics':
              queryClient.invalidateQueries({ queryKey: ['metrics'] })
              queryClient.invalidateQueries({ queryKey: ['dashboard'] })
              queryClient.invalidateQueries({ queryKey: ['revenue-data'] })
              queryClient.invalidateQueries({ queryKey: ['revenue-summary'] })
              break
            case 'product_sales':
              queryClient.invalidateQueries({ queryKey: ['revenue-data'] })
              queryClient.invalidateQueries({ queryKey: ['revenue-summary'] })
              queryClient.invalidateQueries({ queryKey: ['revenue-by-product'] })
              queryClient.invalidateQueries({ queryKey: ['revenue-by-user'] })
              queryClient.invalidateQueries({ queryKey: ['revenue-growth'] })
              queryClient.invalidateQueries({ queryKey: ['dashboard'] })
              break
            case 'user_profiles':
              queryClient.invalidateQueries({ queryKey: ['profile'] })
              queryClient.invalidateQueries({ queryKey: ['organization'] })
              break
            case 'organizations':
              queryClient.invalidateQueries({ queryKey: ['organization'] })
              break
            case 'products':
              queryClient.invalidateQueries({ queryKey: ['products'] })
              queryClient.invalidateQueries({ queryKey: ['revenue-by-product'] })
              break
            case 'reports':
              queryClient.invalidateQueries({ queryKey: ['reports'] })
              break
            case 'goals':
              queryClient.invalidateQueries({ queryKey: ['goals'] })
              break
          }
        }
      )
      .subscribe()

    subscriptionRef.current = subscription

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [context?.organization_id, config, queryClient])

  return {
    isConnected: subscriptionRef.current?.state === 'SUBSCRIBED'
  }
}

// Convenience hooks for common subscriptions
export function useMetricsSubscription() {
  return useRealtimeSubscription({
    table: 'daily_metrics',
    invalidateQueries: ['metrics', 'dashboard', 'team-metrics']
  })
}

export function useTeamSubscription() {
  return useRealtimeSubscription({
    table: 'user_profiles',
    invalidateQueries: ['organization', 'team-members']
  })
}

export function useReportsSubscription() {
  return useRealtimeSubscription({
    table: 'reports',
    invalidateQueries: ['reports', 'dashboard']
  })
}

export function useGoalsSubscription() {
  return useRealtimeSubscription({
    table: 'goals',
    invalidateQueries: ['goals', 'dashboard']
  })
}

// Hook to subscribe to multiple tables at once
export function useDashboardSubscriptions() {
  useMetricsSubscription()
  useTeamSubscription() 
  useReportsSubscription()
  useGoalsSubscription()

  return {
    message: 'Dashboard real-time subscriptions active'
  }
}