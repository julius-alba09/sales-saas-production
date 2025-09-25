-- Fix User Creation Triggers
-- This migration fixes the conflicting triggers that were causing signup errors

-- First, drop the existing conflicting triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_invited_user_created ON auth.users;

-- Update the handle_new_user function to handle both regular and invited users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _organization_id UUID;
  _organization_slug TEXT;
  _user_role user_role;
BEGIN
  -- Check if this is an invited user (has organization_id in metadata)
  IF NEW.raw_user_meta_data ? 'organization_id' THEN
    -- This is an invited user
    _organization_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
    _user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales_rep');
    
    -- Verify organization exists
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
      RAISE EXCEPTION 'Invalid organization';
    END IF;
    
  ELSE
    -- This is a regular signup - extract organization info if provided
    IF NEW.raw_user_meta_data ? 'organization_slug' THEN
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
    
    -- Set role (default to sales_rep for join, manager for new org)
    _user_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role, 
      CASE 
        WHEN NEW.raw_user_meta_data ? 'organization_name' THEN 'manager'::user_role
        ELSE 'sales_rep'::user_role 
      END
    );
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
    _user_role,
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );

  -- Create default notification settings
  INSERT INTO notification_settings (user_id, organization_id)
  VALUES (NEW.id, _organization_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a single trigger that handles all user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Remove the old handle_invited_user_signup function since it's no longer needed
DROP FUNCTION IF EXISTS handle_invited_user_signup();