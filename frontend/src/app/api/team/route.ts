import { Database } from '@/types/supabase'
import { inviteTeamMemberSchema } from '@/lib/validation'
import { withValidation, withRoleAuth, executeQuery, successResponse, logSecurityEvent, parsePaginationParams } from '@/lib/api-utils'

// GET /api/team - List team members
export const GET = withRoleAuth(
  ['owner', 'admin', 'member'], // Allow members to see team list
  async (req, user, workspaceMember, supabase) => {
    try {
      const { searchParams } = new URL(req.url)
      const pagination = parsePaginationParams(searchParams)
      
      // Get team members for the workspace
      const query = supabase
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
        .eq('workspace_id', workspaceMember.workspace.id)
        .order(pagination.sortBy || 'created_at', { 
          ascending: pagination.sortOrder === 'asc' 
        })
        .range(
          (pagination.page - 1) * pagination.limit, 
          pagination.page * pagination.limit - 1
        )

      const { data: members, error } = await query

      if (error) {
        throw new Error('Failed to fetch team members')
      }

      // Get total count
      const { count } = await supabase
        .from('workspace_members')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceMember.workspace.id)

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_MEMBERS_ACCESSED',
        resource: '/api/team',
        metadata: { memberCount: members?.length },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse({
        members: members?.map(member => ({
          id: member.id,
          userId: member.user_id,
          email: member.user?.email,
          fullName: member.user?.raw_user_meta_data?.full_name || member.user?.email,
          role: member.role,
          isActive: member.is_active,
          joinedAt: member.created_at,
        })),
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / pagination.limit),
        }
      })
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'TEAM_ACCESS_ERROR',
        resource: '/api/team',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)

// POST /api/team - Invite team member
export const POST = withValidation(
  inviteTeamMemberSchema,
  withRoleAuth(
    ['owner', 'admin'], // Only owners and admins can invite
    async (req, user, workspaceMember, supabase) => {
      const inviteData = await req.json()
      
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('workspace_members')
          .select('id, user:users(email)')
          .eq('workspace_id', workspaceMember.workspace.id)
          .eq('user.email', inviteData.email)
          .single()

        if (existingUser) {
          return successResponse(null, 'User is already a member of this workspace', 400)
        }

        // Create invitation (this will be handled by the auth system)
        const inviteUrl = new URL('/auth/invite', process.env.NEXT_PUBLIC_APP_URL)
        inviteUrl.searchParams.set('email', inviteData.email)
        inviteUrl.searchParams.set('workspace', workspaceMember.workspace.id)
        inviteUrl.searchParams.set('role', inviteData.role)

        // In a real app, you'd send an email here
        // For now, we'll just log the invitation
        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'TEAM_MEMBER_INVITED',
          resource: '/api/team',
          metadata: { 
            invitedEmail: inviteData.email,
            role: inviteData.role,
            inviteUrl: inviteUrl.toString()
          },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        })

        return successResponse({
          inviteUrl: inviteUrl.toString(),
          email: inviteData.email,
          role: inviteData.role
        }, 'Team member invitation created successfully')
      } catch (error) {
        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'TEAM_INVITE_ERROR',
          resource: '/api/team',
          metadata: { 
            error: error instanceof Error ? error.message : 'Unknown error',
            invitedEmail: inviteData.email
          },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'error')
        throw error
      }
    }
  )
)