'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserCircleIcon, CameraIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useProfile } from '@/hooks/useProfile'

const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  timezone: z.string().default('UTC'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileManager() {
  const { 
    profile, 
    context,
    user,
    isLoading, 
    isUpdating,
    isUploadingAvatar,
    isDeletingAvatar,
    updateProfile,
    uploadAvatar,
    deleteAvatar
  } = useProfile()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
      timezone: profile?.timezone || 'UTC'
    }
  })

  // Reset form when profile data loads
  useState(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone || '',
        timezone: profile.timezone || 'UTC'
      })
    }
  }, [profile, reset])

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadAvatar(file)
  }

  const handleDeleteAvatar = () => {
    if (confirm('Are you sure you want to delete your avatar?')) {
      deleteAvatar()
      setAvatarPreview(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--border-visible)] border-t-[var(--primary)]"></div>
      </div>
    )
  }

  const currentAvatar = avatarPreview || profile?.avatar_url

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="p-8" variant="elevated">
        <div className="flex items-start space-x-8">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[var(--accent)] ring-1 ring-[var(--border-soft)]">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-full h-full text-[var(--foreground-subtle)]" />
              )}
            </div>
            
            {/* Avatar Controls */}
            <div className="absolute -bottom-1 -right-1 flex space-x-2">
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="btn-primary p-2 rounded-full shadow-[var(--shadow-soft)] disabled:opacity-50 transition-all"
                title="Upload avatar"
              >
                <CameraIcon className="w-4 h-4" />
              </button>
              
              {currentAvatar && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={isDeletingAvatar}
                  className="bg-[var(--error)] text-white p-2 rounded-full hover:bg-[var(--error)]/90 disabled:opacity-50 shadow-[var(--shadow-soft)] transition-all"
                  title="Delete avatar"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type=\"file\"
              accept=\"image/*\"
              onChange={handleFileChange}
              className=\"hidden\"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-2">
              {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
            </h1>
            <p className="text-[var(--foreground-muted)] text-lg mb-4">{user?.email}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="px-3 py-1 bg-[var(--accent)] rounded-full text-[var(--foreground-muted)] capitalize">
                {context?.user_role?.replace('_', ' ')}
              </span>
              <span className="text-[var(--foreground-subtle)]">{context?.organization_name}</span>
              {context?.is_manager && (
                <span className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-full font-medium text-xs">
                  Manager
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="p-8">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-6">Personal Information</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                First Name *
              </label>
              <input
                {...register('first_name')}
                type="text"
                id="first_name"
                className="input w-full"
                placeholder="Enter your first name"
              />
              {errors.first_name && (
                <p className="mt-2 text-sm status-error px-3 py-1 rounded-md">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Last Name *
              </label>
              <input
                {...register('last_name')}
                type="text"
                id="last_name"
                className="input w-full"
                placeholder="Enter your last name"
              />
              {errors.last_name && (
                <p className="mt-2 text-sm status-error px-3 py-1 rounded-md">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Phone Number
              </label>
              <input
                {...register('phone')}
                type="tel"
                id="phone"
                className="input w-full"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-2 text-sm status-error px-3 py-1 rounded-md">{errors.phone.message}</p>
              )}
            </div>

            {/* Timezone */}
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Timezone
              </label>
              <select
                {...register('timezone')}
                id="timezone"
                className="input w-full"
              >
                <option value=\"UTC\">UTC</option>
                <option value=\"America/New_York\">Eastern Time</option>
                <option value=\"America/Chicago\">Central Time</option>
                <option value=\"America/Denver\">Mountain Time</option>
                <option value=\"America/Los_Angeles\">Pacific Time</option>
                <option value=\"Europe/London\">London</option>
                <option value=\"Europe/Paris\">Paris</option>
                <option value=\"Asia/Tokyo\">Tokyo</option>
                <option value=\"Australia/Sydney\">Sydney</option>
              </select>
              {errors.timezone && (
                <p className="mt-2 text-sm status-error px-3 py-1 rounded-md">{errors.timezone.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={!isDirty || isUpdating}
              size="lg"
            >
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Information */}
      <Card className="p-8" variant="ghost">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-6">Account Information</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-sm text-[var(--foreground-subtle)]">User ID</span>
            <span className="block font-mono text-sm text-[var(--foreground-muted)] bg-[var(--accent)] px-3 py-2 rounded-md">
              {user?.id}
            </span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-[var(--foreground-subtle)]">Email Status</span>
            <span className={`block text-sm px-3 py-2 rounded-md ${
              user?.email_confirmed_at ? 'status-success' : 'status-error'
            }`}>
              {user?.email_confirmed_at ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-[var(--foreground-subtle)]">Last Sign In</span>
            <span className="block text-sm text-[var(--foreground-muted)] bg-[var(--accent)] px-3 py-2 rounded-md">
              {user?.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleDateString()
                : 'Never'
              }
            </span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-[var(--foreground-subtle)]">Organization</span>
            <span className="block text-sm text-[var(--foreground-muted)] bg-[var(--accent)] px-3 py-2 rounded-md">
              {context?.organization_name}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}