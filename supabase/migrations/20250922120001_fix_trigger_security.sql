-- Fix trigger function with proper security context
-- The issue might be that the function needs to be called as the service role user

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS handle_new_user();

-- Create the function with proper security and error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  _organization_id UUID;
  _organization_slug TEXT;
  _user_role user_role;
  _org_name TEXT;
BEGIN
  RAISE LOG 'handle_new_user triggered for user: %', NEW.email;
  
  -- Extract role early
  _user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales_rep');
  
  -- Check if this is an invited user (has organization_id in metadata)
  IF NEW.raw_user_meta_data ? 'organization_id' THEN
    -- This is an invited user
    _organization_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
    
    -- Verify organization exists
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
      RAISE EXCEPTION 'Invalid organization ID: %', _organization_id;
    END IF;
    
  ELSE
    -- This is a regular signup - extract organization info if provided
    IF NEW.raw_user_meta_data ? 'organization_slug' THEN
      _organization_slug := NEW.raw_user_meta_data->>'organization_slug';
      SELECT id INTO _organization_id FROM organizations WHERE slug = _organization_slug;
    END IF;

    -- If no organization provided, create a new one (for first-time managers)
    IF _organization_id IS NULL THEN
      _org_name := COALESCE(NEW.raw_user_meta_data->>'organization_name', NEW.email || ' Organization');
      _organization_slug := COALESCE(NEW.raw_user_meta_data->>'organization_slug', LOWER(REPLACE(NEW.email, '@', '-')));
      
      INSERT INTO organizations (name, slug)
      VALUES (_org_name, _organization_slug)
      RETURNING id INTO _organization_id;
      
      -- Set role to manager when creating new organization
      IF NEW.raw_user_meta_data ? 'organization_name' THEN
        _user_role := 'manager'::user_role;
      END IF;
    END IF;
  END IF;

  -- Ensure we have an organization
  IF _organization_id IS NULL THEN
    RAISE EXCEPTION 'No organization ID could be determined';
  END IF;

  RAISE LOG 'Creating user profile for user: % in organization: %', NEW.email, _organization_id;

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

  RAISE LOG 'Creating notification settings for user: %', NEW.email;

  -- Create default notification settings
  INSERT INTO notification_settings (user_id, organization_id)
  VALUES (NEW.id, _organization_id);

  RAISE LOG 'Successfully created user profile for: %', NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user for %: % %', NEW.email, SQLERRM, SQLSTATE;
    RAISE;
END;
$$;

-- Grant execute permission to the service role
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();