'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Database } from '@/types/supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type UserRole = Database['public']['Enums']['user_role']

interface ProfileData {
  profile: UserProfile
  context: {
    user_id: string
    organization_id: string
    organization_name: string
    organization_slug: string
    user_role: UserRole
    is_manager: boolean
  }
  user: {
    id: string
    email: string
    email_confirmed_at: string | null
    last_sign_in_at: string | null
  }
}

interface UpdateProfileData {
  first_name: string
  last_name: string
  phone?: string
  timezone?: string
  avatar_url?: string
}

export function useProfile() {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: UpdateProfileData) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload avatar')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Avatar updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deleteAvatarMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/upload/avatar', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete avatar')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Avatar deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    // Data
    profile: data?.profile,
    context: data?.context,
    user: data?.user,
    
    // Loading states
    isLoading,
    isUpdating: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isDeletingAvatar: deleteAvatarMutation.isPending,
    
    // Error
    error,
    
    // Actions
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    deleteAvatar: deleteAvatarMutation.mutate,
    refetch,
    
    // Helper functions
    isManager: data?.context?.is_manager || false,
    fullName: data?.profile ? `${data.profile.first_name} ${data.profile.last_name}` : '',
  }
}

export function useOrganization() {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const response = await fetch('/api/organization')
      if (!response.ok) {
        throw new Error('Failed to fetch organization')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  const updateOrganizationMutation = useMutation({
    mutationFn: async (orgData: { name: string; settings?: any }) => {
      const response = await fetch('/api/organization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orgData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update organization')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      toast.success('Organization updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    // Data
    organization: data?.organization,
    context: data?.context,
    teamMembers: data?.teamMembers,
    
    // Loading states
    isLoading,
    isUpdating: updateOrganizationMutation.isPending,
    
    // Error
    error,
    
    // Actions
    updateOrganization: updateOrganizationMutation.mutate,
    refetch,
    
    // Helper functions
    canManageTeam: data?.context?.is_manager || false,
  }
}