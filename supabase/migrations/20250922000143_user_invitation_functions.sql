-- User Invitation and Management Functions
-- This migration adds functions to allow managers to invite users properly

-- Function to invite users to an organization (called by managers)
CREATE OR REPLACE FUNCTION invite_user_to_organization(
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_role user_role,
  inviting_manager_id UUID DEFAULT auth.uid()
)
RETURNS JSONB AS $$
DECLARE
  _organization_id UUID;
  _inviting_user_role user_role;
  _result JSONB;
BEGIN
  -- Get the inviting user's organization and verify they're a manager
  SELECT organization_id, role INTO _organization_id, _inviting_user_role
  FROM user_profiles 
  WHERE id = inviting_manager_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inviting user not found';
  END IF;
  
  IF _inviting_user_role != 'manager' THEN
    RAISE EXCEPTION 'Only managers can invite users';
  END IF;
  
  IF _organization_id IS NULL THEN
    RAISE EXCEPTION 'Inviting user must belong to an organization';
  END IF;
  
  -- Check if user already exists in this organization
  IF EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE email = user_email AND organization_id = _organization_id
  ) THEN
    RAISE EXCEPTION 'User with this email already exists in your organization';
  END IF;
  
  -- Return success with organization info for the invitation email
  SELECT jsonb_build_object(
    'success', true,
    'organization_id', _organization_id,
    'organization_name', o.name,
    'inviter_name', up.first_name || ' ' || up.last_name,
    'invited_email', user_email,
    'invited_role', user_role
  ) INTO _result
  FROM organizations o, user_profiles up
  WHERE o.id = _organization_id 
    AND up.id = inviting_manager_id;
  
  RETURN _result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle invited user signup (used when they accept invitation)
CREATE OR REPLACE FUNCTION handle_invited_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  _organization_id UUID;
  _user_role user_role;
BEGIN
  -- Check if this is an invited user (has organization metadata)
  IF NEW.raw_user_meta_data ? 'organization_id' THEN
    _organization_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
    _user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales_rep');
    
    -- Verify organization exists
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
      RAISE EXCEPTION 'Invalid organization';
    END IF;
    
    -- Create user profile for invited user
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
      _user_role,
      COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
    );
    
    -- Create default notification settings
    INSERT INTO notification_settings (user_id, organization_id)
    VALUES (NEW.id, _organization_id);
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing new user trigger to handle both regular signups and invitations
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add new trigger for invited users  
CREATE OR REPLACE TRIGGER on_invited_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  WHEN (NEW.raw_user_meta_data ? 'organization_id')
  EXECUTE FUNCTION handle_invited_user_signup();

-- Function to update user status (activate/deactivate)
CREATE OR REPLACE FUNCTION update_user_status(
  target_user_id UUID,
  new_status BOOLEAN,
  updating_manager_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
  _manager_org_id UUID;
  _target_org_id UUID;
  _manager_role user_role;
BEGIN
  -- Get manager's organization and role
  SELECT organization_id, role INTO _manager_org_id, _manager_role
  FROM user_profiles 
  WHERE id = updating_manager_id;
  
  IF NOT FOUND OR _manager_role != 'manager' THEN
    RAISE EXCEPTION 'Only managers can update user status';
  END IF;
  
  -- Get target user's organization
  SELECT organization_id INTO _target_org_id
  FROM user_profiles 
  WHERE id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user not found';
  END IF;
  
  -- Check if manager and target user are in same organization
  IF _manager_org_id != _target_org_id THEN
    RAISE EXCEPTION 'Can only manage users in your organization';
  END IF;
  
  -- Update user status
  UPDATE user_profiles 
  SET is_active = new_status, updated_at = NOW()
  WHERE id = target_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get organization users (for managers)
CREATE OR REPLACE FUNCTION get_organization_users(
  requesting_manager_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role user_role,
  is_active BOOLEAN,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  _manager_org_id UUID;
  _manager_role user_role;
BEGIN
  -- Verify requesting user is a manager
  SELECT organization_id, role INTO _manager_org_id, _manager_role
  FROM user_profiles 
  WHERE id = requesting_manager_id;
  
  IF NOT FOUND OR _manager_role != 'manager' THEN
    RAISE EXCEPTION 'Only managers can view organization users';
  END IF;
  
  -- Return users from the same organization
  RETURN QUERY
  SELECT 
    up.id as user_id,
    up.email,
    up.first_name,
    up.last_name,
    up.role,
    up.is_active,
    up.last_login_at,
    up.created_at
  FROM user_profiles up
  WHERE up.organization_id = _manager_org_id
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION invite_user_to_organization(TEXT, TEXT, TEXT, user_role, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_status(UUID, BOOLEAN, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_organization_users(UUID) TO authenticated;

-- Update RLS policies for better user management
-- Allow managers to insert user profiles for their organization
CREATE POLICY "Managers can create user profiles in their organization" ON user_profiles
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Allow managers to update user profiles in their organization (except role changes)  
DROP POLICY IF EXISTS "Managers can manage users in their organization" ON user_profiles;
CREATE POLICY "Managers can update users in their organization" ON user_profiles
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Allow managers to view all users in their organization
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON user_profiles;
CREATE POLICY "Users can view profiles in their organization" ON user_profiles
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );