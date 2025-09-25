import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookies()
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization context
    const { data: context, error: contextError } = await supabase
      .rpc('get_user_organization_context')
      .single()

    if (contextError) {
      console.error('Error fetching organization context:', contextError)
      return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 })
    }

    // Get organization details
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', context.organization_id)
      .single()

    if (orgError) {
      console.error('Error fetching organization:', orgError)
      return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 })
    }

    // Get team members if user is a manager
    let teamMembers = null
    if (context.is_manager) {
      const { data: members, error: membersError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          is_active,
          avatar_url,
          phone,
          timezone,
          created_at,
          last_login_at
        `)
        .eq('organization_id', context.organization_id)
        .order('created_at', { ascending: true })

      if (membersError) {
        console.error('Error fetching team members:', membersError)
      } else {
        teamMembers = members
      }
    }

    return NextResponse.json({
      organization,
      context,
      teamMembers
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookies()
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a manager
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single()

    if (profileError || profile.role !== 'manager') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const { name, settings } = body

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 })
    }

    // Update organization
    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update({
        name,
        settings: settings || {}
      })
      .eq('id', profile.organization_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating organization:', updateError)
      return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Organization updated successfully',
      organization: updatedOrg
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}