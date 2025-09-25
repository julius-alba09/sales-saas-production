-- Admin Monitoring Functions
-- These functions provide data for the admin user monitoring dashboard

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
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
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'manager' THEN 1 END) as managers,
    COUNT(CASE WHEN role = 'sales_rep' THEN 1 END) as sales_reps,
    COUNT(CASE WHEN role = 'setter' THEN 1 END) as setters,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users
  FROM user_profiles;
END;
$$ LANGUAGE plpgsql;

-- Function to get organization statistics
CREATE OR REPLACE FUNCTION get_org_stats()
RETURNS TABLE (
  total_organizations BIGINT,
  active_orgs BIGINT,
  inactive_orgs BIGINT
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_organizations,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_orgs,
    COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_orgs
  FROM organizations;
END;
$$ LANGUAGE plpgsql;

-- Function to get all users for admin view
CREATE OR REPLACE FUNCTION get_all_users_admin()
RETURNS TABLE (
  email TEXT,
  full_name TEXT,
  role user_role,
  organization TEXT,
  is_active BOOLEAN,
  joined_date DATE,
  last_login DATE
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.email,
    (up.first_name || ' ' || up.last_name) as full_name,
    up.role,
    o.name as organization,
    up.is_active,
    up.created_at::DATE as joined_date,
    up.last_login_at::DATE as last_login
  FROM user_profiles up
  JOIN organizations o ON up.organization_id = o.id
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent registrations
CREATE OR REPLACE FUNCTION get_recent_registrations(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  registration_date DATE,
  new_users BIGINT,
  users TEXT
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.created_at::DATE as registration_date,
    COUNT(*) as new_users,
    STRING_AGG(up.first_name || ' ' || up.last_name || ' (' || up.role || ')', ', ') as users
  FROM user_profiles up
  WHERE up.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY up.created_at::DATE
  ORDER BY registration_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to authenticated users (you can restrict this further if needed)
GRANT EXECUTE ON FUNCTION get_user_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_registrations(INTEGER) TO authenticated;