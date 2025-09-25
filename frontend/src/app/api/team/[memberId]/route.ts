import { Database } from '@/types/supabase'
import { withRoleAuth, executeQuery, successResponse, logSecurityEvent, APIError } from '@/lib/api-utils'
import { z } from 'zod'

const updateMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']).optional(),
  isActive: z.boolean().optional(),
})

interface RouteParams {
  params: { memberId: string }
}

// GET /api/team/[memberId] - Get specific team member
export const GET = withRoleAuth(
  ['owner', 'admin', 'member'],
  async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
    try {
      const member = await executeQuery(
        () => supabase
          .from('workspace_members')
          .select(`
            id,
            user_id,
            role,
            is_active,
            created_at,
            updated_at,
            user:users(email, raw_user_meta_data)
          `)
          .eq('id', params.memberId)
          .eq('workspace_id', workspaceMember.workspace.id)
          .single(),
        'Team member not found'
      )

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_MEMBER_ACCESSED',
        resource: `/api/team/${params.memberId}`,
        metadata: { targetMemberId: params.memberId },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse({
        id: member.id,
        userId: member.user_id,
        email: member.user?.email,
        fullName: member.user?.raw_user_meta_data?.full_name || member.user?.email,
        role: member.role,
        isActive: member.is_active,
        joinedAt: member.created_at,
      })
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_MEMBER_ACCESS_ERROR',
        resource: `/api/team/${params.memberId}`,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)

// PUT /api/team/[memberId] - Update team member
export const PUT = withRoleAuth(
  ['owner', 'admin'],
  async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
    try {
      const body = await req.json()
      const validation = updateMemberSchema.safeParse(body)
      
      if (!validation.success) {
        throw new APIError('Invalid input data', 400)
      }

      const updateData = validation.data

      // Prevent self-deactivation for owners
      if (params.memberId === workspaceMember.id && updateData.isActive === false) {
        throw new APIError('You cannot deactivate yourself', 400)
      }

      // Prevent role change for self unless owner
      if (params.memberId === workspaceMember.id && updateData.role && workspaceMember.role !== 'owner') {
        throw new APIError('You cannot change your own role', 403)
      }

      // Update the member
      const { data: updatedMember, error } = await supabase
        .from('workspace_members')
        .update({
          ...(updateData.role && { role: updateData.role }),
          ...(updateData.isActive !== undefined && { is_active: updateData.isActive }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.memberId)
        .eq('workspace_id', workspaceMember.workspace.id)
        .select(`
          id,
          user_id,
          role,
          is_active,
          created_at,
          updated_at,
          user:users(email, raw_user_meta_data)
        `)
        .single()

      if (error) {
        throw new Error('Failed to update team member')
      }

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_MEMBER_UPDATED',
        resource: `/api/team/${params.memberId}`,
        metadata: { 
          targetMemberId: params.memberId,
          changes: updateData,
          newRole: updatedMember?.role
        },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse({
        id: updatedMember.id,
        userId: updatedMember.user_id,
        email: updatedMember.user?.email,
        fullName: updatedMember.user?.raw_user_meta_data?.full_name || updatedMember.user?.email,
        role: updatedMember.role,
        isActive: updatedMember.is_active,
        joinedAt: updatedMember.created_at,
      }, 'Team member updated successfully')
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_MEMBER_UPDATE_ERROR',
        resource: `/api/team/${params.memberId}`,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)

// DELETE /api/team/[memberId] - Remove team member
export const DELETE = withRoleAuth(
  ['owner'], // Only owners can remove members
  async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
    try {
      // Prevent self-removal
      if (params.memberId === workspaceMember.id) {
        throw new APIError('You cannot remove yourself from the workspace', 400)
      }

      // Deactivate the member instead of deleting (for audit purposes)
      const { error } = await supabase
        .from('workspace_members')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.memberId)
        .eq('workspace_id', workspaceMember.workspace.id)

      if (error) {
        throw new Error('Failed to remove team member')
      }

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_MEMBER_REMOVED',
        resource: `/api/team/${params.memberId}`,
        metadata: { targetMemberId: params.memberId },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse(null, 'Team member removed successfully')
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_MEMBER_REMOVE_ERROR',
        resource: `/api/team/${params.memberId}`,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)