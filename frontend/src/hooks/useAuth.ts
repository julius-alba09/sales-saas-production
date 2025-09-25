'use client'

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { MOCK_MODE, MOCK_USER, MOCK_WORKSPACE_MEMBER, mockAuth } from '@/lib/mock-mode'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    let mounted = true

    if (MOCK_MODE) {
      // Mock mode initialization
      setTimeout(() => {
        if (mounted) {
          setAuthState({
            user: MOCK_USER as any,
            profile: null, // We'll use workspace member role instead
            session: null,
            loading: false,
          })
        }
      }, 500)
      return
    }

    // Real Supabase mode
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }))
        
        if (session?.user) {
          fetchUserProfile(session.user.id)
        }
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session?.user ?? null,
            loading: false,
          }))

          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            setAuthState(prev => ({ ...prev, profile: null }))
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setAuthState(prev => ({
        ...prev,
        profile,
      }))
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (MOCK_MODE) {
      const result = await mockAuth.signIn({ email, password })
      if (result.user) {
        setAuthState({
          user: result.user as any,
          profile: null,
          session: null,
          loading: false,
        })
      }
      return result
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (
    email: string, 
    password: string, 
    userData: {
      first_name: string
      last_name: string
      organization_name?: string
      role?: 'manager' | 'sales_rep' | 'setter'
    }
  ) => {
    if (MOCK_MODE) {
      const result = await mockAuth.signUp({ email, password, ...userData })
      if (result.user) {
        setAuthState({
          user: result.user as any,
          profile: null,
          session: null,
          loading: false,
        })
      }
      return result
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          organization_name: userData.organization_name,
          role: userData.role || 'sales_rep',
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    if (MOCK_MODE) {
      const result = await mockAuth.signOut()
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
      })
      return result
    }

    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', authState.user.id)
      .select()
      .single()

    if (!error && data) {
      setAuthState(prev => ({ ...prev, profile: data }))
    }

    return { data, error }
  }

  // Role-based access helpers
  const mockRole = MOCK_MODE ? MOCK_WORKSPACE_MEMBER.role : null
  const isManager = MOCK_MODE ? mockRole === 'owner' : authState.profile?.role === 'manager'
  const isSalesRep = MOCK_MODE ? mockRole === 'member' : authState.profile?.role === 'sales_rep'
  const isSetter = MOCK_MODE ? mockRole === 'viewer' : authState.profile?.role === 'setter'
  const organizationId = MOCK_MODE ? MOCK_WORKSPACE_MEMBER.workspace.id : authState.profile?.organization_id

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isManager,
    isSalesRep,
    isSetter,
    organizationId,
    refetch: () => {
      if (authState.user) {
        fetchUserProfile(authState.user.id)
      }
    }
  }
}