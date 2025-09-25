import { Database } from '@/types/supabase'
import { eodReportSchema } from '@/lib/validation'
import { withValidation, withRoleAuth, executeQuery, successResponse, logSecurityEvent, APIError } from '@/lib/api-utils'

interface RouteParams {
  params: { reportId: string }
}

// GET /api/eod/[reportId] - Get specific EOD report
export const GET = withRoleAuth(
  ['owner', 'admin', 'member', 'viewer'],
  async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
    try {
      let query = supabase
        .from('eod_reports')
        .select(`
          *,
          user:users!eod_reports_user_id_fkey(id, email, raw_user_meta_data)
        `)
        .eq('id', params.reportId)
        .eq('workspace_id', workspaceMember.workspace.id)

      // Regular members can only access their own reports
      if (workspaceMember.role === 'member' || workspaceMember.role === 'viewer') {
        query = query.eq('user_id', user.id)
      }

      const report = await executeQuery(
        () => query.single(),
        'EOD report not found or access denied'
      )

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'EOD_REPORT_ACCESSED',
        resource: `/api/eod/${params.reportId}`,
        metadata: { 
          reportId: params.reportId,
          reportDate: report.report_date,
          reportOwner: report.user_id
        },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse({
        id: report.id,
        date: report.report_date,
        callsMade: report.calls_made,
        appointments: report.appointments,
        sales: report.sales,
        revenue: report.revenue,
        notes: report.notes,
        mood: report.mood,
        challenges: report.challenges,
        wins: report.wins,
        user: {
          id: report.user?.id,
          email: report.user?.email,
          fullName: report.user?.raw_user_meta_data?.full_name || report.user?.email
        },
        createdAt: report.created_at,
        updatedAt: report.updated_at,
      })
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'EOD_REPORT_ACCESS_ERROR',
        resource: `/api/eod/${params.reportId}`,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)

// PUT /api/eod/[reportId] - Update EOD report
export const PUT = withValidation(
  eodReportSchema.partial(), // Allow partial updates
  withRoleAuth(
    ['owner', 'admin', 'member'],
    async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
      const updateData = await req.json()
      
      try {
        let query = supabase
          .from('eod_reports')
          .select('id, user_id, report_date')
          .eq('id', params.reportId)
          .eq('workspace_id', workspaceMember.workspace.id)

        // Regular members can only update their own reports
        if (workspaceMember.role === 'member') {
          query = query.eq('user_id', user.id)
        }

        const existingReport = await executeQuery(
          () => query.single(),
          'EOD report not found or access denied'
        )

        // Prepare update data
        const updateFields: any = {
          updated_at: new Date().toISOString(),
        }

        if (updateData.callsMade !== undefined) updateFields.calls_made = updateData.callsMade
        if (updateData.appointments !== undefined) updateFields.appointments = updateData.appointments
        if (updateData.sales !== undefined) updateFields.sales = updateData.sales
        if (updateData.revenue !== undefined) updateFields.revenue = updateData.revenue
        if (updateData.notes !== undefined) updateFields.notes = updateData.notes
        if (updateData.mood !== undefined) updateFields.mood = updateData.mood
        if (updateData.challenges !== undefined) updateFields.challenges = updateData.challenges
        if (updateData.wins !== undefined) updateFields.wins = updateData.wins

        const { data: updatedReport, error } = await supabase
          .from('eod_reports')
          .update(updateFields)
          .eq('id', params.reportId)
          .eq('workspace_id', workspaceMember.workspace.id)
          .select(`
            *,
            user:users!eod_reports_user_id_fkey(id, email, raw_user_meta_data)
          `)
          .single()

        if (error) {
          throw new Error('Failed to update EOD report')
        }

        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'EOD_REPORT_UPDATED',
          resource: `/api/eod/${params.reportId}`,
          metadata: { 
            reportId: params.reportId,
            reportDate: existingReport.report_date,
            changes: Object.keys(updateData),
            reportOwner: existingReport.user_id
          },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        })

        return successResponse({
          id: updatedReport.id,
          date: updatedReport.report_date,
          callsMade: updatedReport.calls_made,
          appointments: updatedReport.appointments,
          sales: updatedReport.sales,
          revenue: updatedReport.revenue,
          notes: updatedReport.notes,
          mood: updatedReport.mood,
          challenges: updatedReport.challenges,
          wins: updatedReport.wins,
          user: {
            id: updatedReport.user?.id,
            email: updatedReport.user?.email,
            fullName: updatedReport.user?.raw_user_meta_data?.full_name || updatedReport.user?.email
          },
          createdAt: updatedReport.created_at,
          updatedAt: updatedReport.updated_at,
        }, 'EOD report updated successfully')
      } catch (error) {
        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'EOD_REPORT_UPDATE_ERROR',
          resource: `/api/eod/${params.reportId}`,
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'error')
        throw error
      }
    }
  )
)

// DELETE /api/eod/[reportId] - Delete EOD report
export const DELETE = withRoleAuth(
  ['owner', 'admin'], // Only admins and owners can delete reports
  async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
    try {
      const existingReport = await executeQuery(
        () => supabase
          .from('eod_reports')
          .select('id, user_id, report_date')
          .eq('id', params.reportId)
          .eq('workspace_id', workspaceMember.workspace.id)
          .single(),
        'EOD report not found'
      )

      const { error } = await supabase
        .from('eod_reports')
        .delete()
        .eq('id', params.reportId)
        .eq('workspace_id', workspaceMember.workspace.id)

      if (error) {
        throw new Error('Failed to delete EOD report')
      }

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'EOD_REPORT_DELETED',
        resource: `/api/eod/${params.reportId}`,
        metadata: { 
          reportId: params.reportId,
          reportDate: existingReport.report_date,
          reportOwner: existingReport.user_id
        },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse(null, 'EOD report deleted successfully')
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'EOD_REPORT_DELETE_ERROR',
        resource: `/api/eod/${params.reportId}`,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)