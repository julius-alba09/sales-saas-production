import { Database } from '@/types/supabase'
import { withAuth, executeQuery, successResponse, logSecurityEvent } from '@/lib/api-utils'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export const GET = withAuth(async (req, user, supabase) => {
  try {
    // Get workspace member info with workspace context
    const workspaceMember = await executeQuery(
      () => supabase
        .from('workspace_members')
        .select(`
          role,
          is_active,
          workspace:workspaces(
            id,
            name,
            description,
            settings,
            is_active,
            plan_type,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single(),
      'Failed to fetch workspace context'
    )

    // Log profile access
    logSecurityEvent({
      userId: user.id,
      workspaceId: workspaceMember.workspace.id,
      action: 'PROFILE_ACCESSED',
      resource: '/api/profile',
      ip: req.ip,
      userAgent: req.headers.get('user-agent') || undefined,
    })

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at
      },
      workspace: workspaceMember.workspace,
      membership: {
        role: workspaceMember.role,
        is_active: workspaceMember.is_active
      }
    })
  } catch (error) {
    logSecurityEvent({
      userId: user.id,
      action: 'PROFILE_ACCESS_ERROR',
      resource: '/api/profile',
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      ip: req.ip,
      userAgent: req.headers.get('user-agent') || undefined,
    }, 'error')
    throw error
  }
})

import { profileUpdateSchema } from '@/lib/validation'
import { withValidation } from '@/lib/api-utils'

export const PUT = withValidation(
  profileUpdateSchema,
  withAuth(async (req, user, supabase) => {
    const body = await req.json()
    
    try {
      // Update auth user metadata if email needs updating
      if (body.firstName || body.lastName) {
        const fullName = `${body.firstName} ${body.lastName}`
        await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            first_name: body.firstName,
            last_name: body.lastName
          }
        })
      }

      // Get workspace context for the user
      const { data: workspaceMember } = await supabase
        .from('workspace_members')
        .select('workspace_id, role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      // Log profile update
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember?.workspace_id,
        action: 'PROFILE_UPDATED',
        resource: '/api/profile',
        metadata: { 
          updatedFields: Object.keys(body),
          role: workspaceMember?.role 
        },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse(
        { user: { id: user.id, email: user.email } },
        'Profile updated successfully'
      )
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        action: 'PROFILE_UPDATE_ERROR',
        resource: '/api/profile',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  })
)