-- Fix Admin Function Security - CRITICAL SECURITY PATCH
-- This migration adds proper authorization checks to admin functions

-- Create helper function to check if user has super admin privileges
CREATE OR REPLACE FUNCTION check_super_admin_permission()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has super admin privileges
  -- For now, we'll check if user is an owner of a workspace
  -- In production, you might want a separate super_admin table
  RETURN EXISTS (
    SELECT 1 FROM workspace_members wm
    JOIN workspaces w ON wm.workspace_id = w.id
    WHERE wm.user_id = auth.uid() 
    AND wm.role = 'owner'
    AND wm.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check workspace admin permissions
CREATE OR REPLACE FUNCTION check_workspace_admin_permission(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.user_id = auth.uid() 
    AND wm.workspace_id = workspace_uuid
    AND wm.role IN ('owner', 'admin')
    AND wm.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SECURE VERSION: Function to get user statistics (workspace-scoped)
CREATE OR REPLACE FUNCTION get_workspace_user_stats(workspace_uuid UUID)
RETURNS TABLE (
  total_users BIGINT,
  managers BIGINT,
  sales_reps BIGINT,
  setters BIGINT,
  active_users BIGINT,
  inactive_users BIGINT
) 
SECURITY DEFINER
AS $$
BEGIN
  -- Check authorization
  IF NOT check_workspace_admin_permission(workspace_uuid) THEN
    RAISE EXCEPTION 'Insufficient privileges to access workspace statistics';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN wm.role = 'owner' THEN 1 END) as managers,
    COUNT(CASE WHEN wm.role = 'member' THEN 1 END) as sales_reps,
    COUNT(CASE WHEN wm.role = 'viewer' THEN 1 END) as setters,
    COUNT(CASE WHEN wm.is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN wm.is_active = false THEN 1 END) as inactive_users
  FROM workspace_members wm
  WHERE wm.workspace_id = workspace_uuid;
END;
$$ LANGUAGE plpgsql;

-- SECURE VERSION: Function to get workspace members for admin view
CREATE OR REPLACE FUNCTION get_workspace_members_admin(workspace_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role workspace_role,
  is_active BOOLEAN,
  joined_date DATE,
  last_login DATE
) 
SECURITY DEFINER
AS $$
BEGIN
  -- Check authorization
  IF NOT check_workspace_admin_permission(workspace_uuid) THEN
    RAISE EXCEPTION 'Insufficient privileges to access workspace members';
  END IF;

  RETURN QUERY
  SELECT 
    wm.user_id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as full_name,
    wm.role,
    wm.is_active,
    wm.created_at::DATE as joined_date,
    u.last_sign_in_at::DATE as last_login
  FROM workspace_members wm
  JOIN auth.users u ON wm.user_id = u.id
  WHERE wm.workspace_id = workspace_uuid
  ORDER BY wm.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- SECURE VERSION: Function to get recent workspace registrations
CREATE OR REPLACE FUNCTION get_workspace_recent_registrations(workspace_uuid UUID, days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  registration_date DATE,
  new_users BIGINT
) 
SECURITY DEFINER
AS $$
BEGIN
  -- Check authorization
  IF NOT check_workspace_admin_permission(workspace_uuid) THEN
    RAISE EXCEPTION 'Insufficient privileges to access workspace registration data';
  END IF;

  RETURN QUERY
  SELECT 
    wm.created_at::DATE as registration_date,
    COUNT(*) as new_users
  FROM workspace_members wm
  WHERE wm.workspace_id = workspace_uuid
    AND wm.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY wm.created_at::DATE
  ORDER BY registration_date DESC;
END;
$$ LANGUAGE plpgsql;

-- REVOKE dangerous permissions from old functions
REVOKE EXECUTE ON FUNCTION get_user_stats() FROM authenticated;
REVOKE EXECUTE ON FUNCTION get_org_stats() FROM authenticated;
REVOKE EXECUTE ON FUNCTION get_all_users_admin() FROM authenticated;
REVOKE EXECUTE ON FUNCTION get_recent_registrations(INTEGER) FROM authenticated;

-- Grant permissions to new secure functions
GRANT EXECUTE ON FUNCTION get_workspace_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_workspace_members_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_workspace_recent_registrations(UUID, INTEGER) TO authenticated;

-- Grant permission to helper functions
GRANT EXECUTE ON FUNCTION check_super_admin_permission() TO authenticated;
GRANT EXECUTE ON FUNCTION check_workspace_admin_permission(UUID) TO authenticated;

-- Add audit logging for admin function access
CREATE TABLE IF NOT EXISTS admin_function_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    workspace_id UUID REFERENCES workspaces(id),
    function_name TEXT NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Enable RLS on audit table
ALTER TABLE admin_function_audit ENABLE ROW LEVEL SECURITY;

-- Policy: Only workspace admins can see their workspace's audit logs
CREATE POLICY "workspace_admin_audit_access" ON admin_function_audit
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    );

-- Function to log admin function access
CREATE OR REPLACE FUNCTION log_admin_function_access(
    func_name TEXT,
    workspace_uuid UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_function_audit (user_id, workspace_id, function_name)
    VALUES (auth.uid(), workspace_uuid, func_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION log_admin_function_access(TEXT, UUID) TO authenticated;