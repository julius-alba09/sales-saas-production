import { Database } from '@/types/supabase'
import { eodReportSchema } from '@/lib/validation'
import { withValidation, withRoleAuth, executeQuery, successResponse, logSecurityEvent, parsePaginationParams } from '@/lib/api-utils'

// GET /api/eod - List EOD reports
export const GET = withRoleAuth(
  ['owner', 'admin', 'member', 'viewer'],
  async (req, user, workspaceMember, supabase) => {
    try {
      const { searchParams } = new URL(req.url)
      const pagination = parsePaginationParams(searchParams)
      const startDate = searchParams.get('startDate')
      const endDate = searchParams.get('endDate')
      const userId = searchParams.get('userId') // For managers to view specific user's reports
      const period = searchParams.get('period') // 'week', 'month', 'quarter'
      
      // Build query
      let query = supabase
        .from('eod_reports')
        .select(`
          *,
          user:users!eod_reports_user_id_fkey(id, email, raw_user_meta_data)
        `, { count: 'exact' })
        .eq('workspace_id', workspaceMember.workspace.id)
        .order(pagination.sortBy || 'report_date', { 
          ascending: pagination.sortOrder === 'asc' 
        })

      // Apply filters based on user role
      if (workspaceMember.role === 'member' || workspaceMember.role === 'viewer') {
        // Regular members can only see their own reports
        query = query.eq('user_id', user.id)
      } else if (userId && (workspaceMember.role === 'owner' || workspaceMember.role === 'admin')) {
        // Managers can view specific user's reports
        query = query.eq('user_id', userId)
      }

      // Date filters
      if (startDate) {
        query = query.gte('report_date', startDate)
      }
      if (endDate) {
        query = query.lte('report_date', endDate)
      }

      // Period filter
      if (period) {
        const now = new Date()
        let filterDate = new Date()
        
        switch (period) {
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setMonth(now.getMonth() - 1)
            break
          case 'quarter':
            filterDate.setMonth(now.getMonth() - 3)
            break
        }
        
        query = query.gte('report_date', filterDate.toISOString().split('T')[0])
      }

      // Apply pagination
      query = query.range(
        (pagination.page - 1) * pagination.limit,
        pagination.page * pagination.limit - 1
      )

      const { data: reports, count, error } = await query

      if (error) {
        throw new Error('Failed to fetch EOD reports')
      }

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'EOD_REPORTS_ACCESSED',
        resource: '/api/eod',
        metadata: { 
          reportCount: reports?.length,
          filters: { startDate, endDate, userId, period },
          role: workspaceMember.role
        },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse({
        reports: reports?.map(report => ({
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
        action: 'EOD_REPORTS_ACCESS_ERROR',
        resource: '/api/eod',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)

// POST /api/eod - Create EOD report
export const POST = withValidation(
  eodReportSchema,
  withRoleAuth(
    ['owner', 'admin', 'member'], // All active members can submit EOD reports
    async (req, user, workspaceMember, supabase) => {
      const reportData = await req.json()
      
      try {
        // Check if report already exists for this date
        const { data: existingReport } = await supabase
          .from('eod_reports')
          .select('id')
          .eq('user_id', user.id)
          .eq('workspace_id', workspaceMember.workspace.id)
          .eq('report_date', reportData.date)
          .single()

        if (existingReport) {
          // Update existing report instead of creating new one
          const { data: updatedReport, error } = await supabase
            .from('eod_reports')
            .update({
              calls_made: reportData.callsMade,
              appointments: reportData.appointments,
              sales: reportData.sales,
              revenue: reportData.revenue,
              notes: reportData.notes,
              mood: reportData.mood,
              challenges: reportData.challenges,
              wins: reportData.wins,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingReport.id)
            .select('*')
            .single()

          if (error) {
            throw new Error('Failed to update EOD report')
          }

          logSecurityEvent({
            userId: user.id,
            workspaceId: workspaceMember.workspace.id,
            action: 'EOD_REPORT_UPDATED',
            resource: '/api/eod',
            metadata: { 
              reportId: updatedReport.id,
              date: reportData.date,
              revenue: reportData.revenue
            },
            ip: req.ip,
            userAgent: req.headers.get('user-agent') || undefined,
          })

          return successResponse(updatedReport, 'EOD report updated successfully')
        } else {
          // Create new report
          const { data: newReport, error } = await supabase
            .from('eod_reports')
            .insert({
              user_id: user.id,
              workspace_id: workspaceMember.workspace.id,
              report_date: reportData.date,
              calls_made: reportData.callsMade,
              appointments: reportData.appointments,
              sales: reportData.sales,
              revenue: reportData.revenue,
              notes: reportData.notes,
              mood: reportData.mood,
              challenges: reportData.challenges,
              wins: reportData.wins,
            })
            .select('*')
            .single()

          if (error) {
            throw new Error('Failed to create EOD report')
          }

          logSecurityEvent({
            userId: user.id,
            workspaceId: workspaceMember.workspace.id,
            action: 'EOD_REPORT_CREATED',
            resource: '/api/eod',
            metadata: { 
              reportId: newReport.id,
              date: reportData.date,
              revenue: reportData.revenue
            },
            ip: req.ip,
            userAgent: req.headers.get('user-agent') || undefined,
          })

          return successResponse(newReport, 'EOD report submitted successfully', 201)
        }
      } catch (error) {
        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'EOD_REPORT_CREATE_ERROR',
          resource: '/api/eod',
          metadata: { 
            error: error instanceof Error ? error.message : 'Unknown error',
            date: reportData.date
          },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'error')
        throw error
      }
    }
  )
)