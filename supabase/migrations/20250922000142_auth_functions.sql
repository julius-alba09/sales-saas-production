-- Auth Functions and Triggers
-- This migration creates functions for handling user registration and profile management

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _organization_id UUID;
  _organization_slug TEXT;
BEGIN
  -- Extract organization info from user metadata if provided
  IF NEW.raw_user_meta_data ? 'organization_id' THEN
    _organization_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
  ELSIF NEW.raw_user_meta_data ? 'organization_slug' THEN
    _organization_slug := NEW.raw_user_meta_data->>'organization_slug';
    SELECT id INTO _organization_id FROM organizations WHERE slug = _organization_slug;
  END IF;

  -- If no organization provided, create a new one (for first-time managers)
  IF _organization_id IS NULL THEN
    INSERT INTO organizations (name, slug)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'organization_name', NEW.email || '''s Organization'),
      COALESCE(NEW.raw_user_meta_data->>'organization_slug', LOWER(REPLACE(NEW.email, '@', '-')))
    )
    RETURNING id INTO _organization_id;
  END IF;

  -- Create user profile
  INSERT INTO user_profiles (
    id,
    organization_id,
    email,
    first_name,
    last_name,
    role,
    timezone
  ) VALUES (
    NEW.id,
    _organization_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'First'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Last'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales_rep'),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );

  -- Create default notification settings
  INSERT INTO notification_settings (user_id, organization_id)
  VALUES (NEW.id, _organization_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get user's organization context
CREATE OR REPLACE FUNCTION get_user_organization_context()
RETURNS TABLE (
  user_id UUID,
  organization_id UUID,
  organization_name TEXT,
  organization_slug TEXT,
  user_role user_role,
  is_manager BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.organization_id,
    o.name as organization_name,
    o.slug as organization_slug,
    up.role,
    (up.role = 'manager') as is_manager
  FROM user_profiles up
  JOIN organizations o ON up.organization_id = o.id
  WHERE up.id = auth.uid() AND up.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get team metrics summary
CREATE OR REPLACE FUNCTION get_team_metrics_summary(
  org_id UUID DEFAULT NULL,
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_role user_role,
  total_calls INTEGER,
  total_offers INTEGER,
  total_closes INTEGER,
  total_deposits INTEGER,
  close_rate NUMERIC,
  avatar_url TEXT
) AS $$
DECLARE
  _org_id UUID;
BEGIN
  -- Use provided org_id or get from current user
  IF org_id IS NOT NULL THEN
    _org_id := org_id;
  ELSE
    SELECT up.organization_id INTO _org_id
    FROM user_profiles up
    WHERE up.id = auth.uid();
  END IF;

  -- Check if user has permission to view organization data
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND organization_id = _org_id
    AND (role = 'manager' OR id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    up.id,
    (up.first_name || ' ' || up.last_name) as user_name,
    up.role,
    COALESCE(SUM(dm.scheduled_calls + dm.live_calls), 0)::INTEGER as total_calls,
    COALESCE(SUM(dm.offers_made), 0)::INTEGER as total_offers,
    COALESCE(SUM(dm.closes), 0)::INTEGER as total_closes,
    COALESCE(SUM(dm.deposits), 0)::INTEGER as total_deposits,
    CASE 
      WHEN SUM(dm.offers_made) > 0 THEN 
        ROUND((SUM(dm.closes)::NUMERIC / SUM(dm.offers_made)::NUMERIC) * 100, 2)
      ELSE 0 
    END as close_rate,
    up.avatar_url
  FROM user_profiles up
  LEFT JOIN daily_metrics dm ON up.id = dm.user_id 
    AND dm.date BETWEEN start_date AND end_date
  WHERE up.organization_id = _org_id 
    AND up.is_active = true
  GROUP BY up.id, up.first_name, up.last_name, up.role, up.avatar_url
  ORDER BY up.role, total_closes DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  profile_data JSONB
)
RETURNS user_profiles AS $$
DECLARE
  updated_profile user_profiles;
BEGIN
  -- Check if user can update this profile
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Profile not found or access denied';
  END IF;

  -- Update the profile
  UPDATE user_profiles 
  SET 
    first_name = COALESCE(profile_data->>'first_name', first_name),
    last_name = COALESCE(profile_data->>'last_name', last_name),
    phone = COALESCE(profile_data->>'phone', phone),
    timezone = COALESCE(profile_data->>'timezone', timezone),
    avatar_url = COALESCE(profile_data->>'avatar_url', avatar_url),
    updated_at = NOW()
  WHERE id = auth.uid()
  RETURNING * INTO updated_profile;

  RETURN updated_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_user_organization_context() TO authenticated;
GRANT EXECUTE ON FUNCTION get_team_metrics_summary(UUID, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_profile(JSONB) TO authenticated;