'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export interface Workspace {
  workspace_id: string
  workspace_name: string
  workspace_slug: string
  user_role: 'owner' | 'admin' | 'member' | 'viewer'
  plan_type: 'free' | 'pro' | 'enterprise'
  is_trial: boolean
}

export interface WorkspaceUser {
  user_id: string
  email: string
  full_name: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  is_active: boolean
  joined_date: string
  last_seen: string | null
}

export interface WorkspaceStats {
  total_users: number
  owners: number
  admins: number
  members: number
  viewers: number
  active_users: number
  inactive_users: number
}

interface WorkspaceContextType {
  // Current user
  user: User | null
  loading: boolean
  
  // Current workspace
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  
  // Workspace management
  switchWorkspace: (workspaceSlug: string) => Promise<void>
  createWorkspace: (name: string, slug?: string) => Promise<Workspace>
  
  // User management
  inviteUser: (email: string, role: 'admin' | 'member' | 'viewer') => Promise<void>
  updateUserRole: (userId: string, role: 'admin' | 'member' | 'viewer') => Promise<void>
  removeUser: (userId: string) => Promise<void>
  
  // Data fetching
  getWorkspaceStats: () => Promise<WorkspaceStats>
  getWorkspaceMembers: () => Promise<WorkspaceUser[]>
  
  // Permissions
  hasPermission: (requiredRole: 'owner' | 'admin' | 'member' | 'viewer') => boolean
  canManageUsers: boolean
  canManageWorkspace: boolean
  
  // Auth
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: { first_name: string, last_name: string, workspace_name?: string }) => Promise<void>
  signOut: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

export function WorkspaceProvider({ 
  children,
  initialWorkspaceSlug 
}: { 
  children: React.ReactNode
  initialWorkspaceSlug?: string 
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  // Initialize authentication and workspace state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user && mounted) {
          setUser(session.user)
          await loadWorkspaces(session.user.id, initialWorkspaceSlug)
        } else if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await loadWorkspaces(session.user.id, initialWorkspaceSlug)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setCurrentWorkspace(null)
          setWorkspaces([])
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [initialWorkspaceSlug])

  const loadWorkspaces = async (userId: string, preferredSlug?: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_workspaces')
      
      if (error) throw error

      const userWorkspaces = data as Workspace[]
      setWorkspaces(userWorkspaces)

      // Set current workspace
      if (userWorkspaces.length > 0) {
        let workspace = userWorkspaces[0] // Default to first

        // Try to find preferred workspace by slug
        if (preferredSlug) {
          const preferred = userWorkspaces.find(w => w.workspace_slug === preferredSlug)
          if (preferred) {
            workspace = preferred
          }
        }

        setCurrentWorkspace(workspace)
      }
    } catch (error) {
      console.error('Error loading workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchWorkspace = useCallback(async (workspaceSlug: string) => {
    const workspace = workspaces.find(w => w.workspace_slug === workspaceSlug)
    if (workspace) {
      setCurrentWorkspace(workspace)
      router.push(`/w/${workspaceSlug}/dashboard`)
    }
  }, [workspaces, router])

  const createWorkspace = useCallback(async (name: string, slug?: string): Promise<Workspace> => {
    if (!user) throw new Error('User not authenticated')

    const workspaceSlug = slug || name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        name,
        slug: workspaceSlug,
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    // Create workspace membership
    await supabase
      .from('workspace_members')
      .insert({
        workspace_id: data.id,
        user_id: user.id,
        role: 'owner',
        accepted_at: new Date().toISOString()
      })

    // Create workspace settings
    await supabase
      .from('workspace_settings')
      .insert({ workspace_id: data.id })

    // Reload workspaces
    await loadWorkspaces(user.id, workspaceSlug)

    const newWorkspace: Workspace = {
      workspace_id: data.id,
      workspace_name: data.name,
      workspace_slug: data.slug,
      user_role: 'owner',
      plan_type: 'free',
      is_trial: true
    }

    return newWorkspace
  }, [user])

  const inviteUser = useCallback(async (email: string, role: 'admin' | 'member' | 'viewer') => {
    if (!currentWorkspace || !hasPermission('admin')) {
      throw new Error('Insufficient permissions')
    }

    const { error } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: currentWorkspace.workspace_id,
        email,
        role,
        invited_by: user?.id,
        token: crypto.randomUUID()
      })

    if (error) throw error
  }, [currentWorkspace, user])

  const updateUserRole = useCallback(async (userId: string, role: 'admin' | 'member' | 'viewer') => {
    if (!currentWorkspace || !hasPermission('admin')) {
      throw new Error('Insufficient permissions')
    }

    const { error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('workspace_id', currentWorkspace.workspace_id)
      .eq('user_id', userId)

    if (error) throw error
  }, [currentWorkspace])

  const removeUser = useCallback(async (userId: string) => {
    if (!currentWorkspace || !hasPermission('admin')) {
      throw new Error('Insufficient permissions')
    }

    const { error } = await supabase
      .from('workspace_members')
      .update({ is_active: false })
      .eq('workspace_id', currentWorkspace.workspace_id)
      .eq('user_id', userId)

    if (error) throw error
  }, [currentWorkspace])

  const getWorkspaceStats = useCallback(async (): Promise<WorkspaceStats> => {
    if (!currentWorkspace) throw new Error('No workspace selected')

    const { data, error } = await supabase.rpc('get_workspace_stats', {
      workspace_uuid: currentWorkspace.workspace_id
    })

    if (error) throw error
    
    return data[0] as WorkspaceStats
  }, [currentWorkspace])

  const getWorkspaceMembers = useCallback(async (): Promise<WorkspaceUser[]> => {
    if (!currentWorkspace) throw new Error('No workspace selected')

    const { data, error } = await supabase.rpc('get_all_workspace_members', {
      workspace_uuid: currentWorkspace.workspace_id
    })

    if (error) throw error
    
    return data as WorkspaceUser[]
  }, [currentWorkspace])

  const hasPermission = useCallback((requiredRole: 'owner' | 'admin' | 'member' | 'viewer'): boolean => {
    if (!currentWorkspace) return false

    const roleHierarchy = { viewer: 1, member: 2, admin: 3, owner: 4 }
    const userLevel = roleHierarchy[currentWorkspace.user_role]
    const requiredLevel = roleHierarchy[requiredRole]

    return userLevel >= requiredLevel
  }, [currentWorkspace])

  const canManageUsers = hasPermission('admin')
  const canManageWorkspace = hasPermission('owner')

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    userData: { first_name: string, last_name: string, workspace_name?: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const value: WorkspaceContextType = {
    user,
    loading,
    currentWorkspace,
    workspaces,
    switchWorkspace,
    createWorkspace,
    inviteUser,
    updateUserRole,
    removeUser,
    getWorkspaceStats,
    getWorkspaceMembers,
    hasPermission,
    canManageUsers,
    canManageWorkspace,
    signIn,
    signUp,
    signOut
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}