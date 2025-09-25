-- Data Migration: Convert existing single-tenant data to multi-tenant structure
-- This script migrates data from the old schema to the new multi-tenant schema

-- Step 1: Migrate organizations to workspaces
INSERT INTO workspaces (id, name, slug, created_at, updated_at, created_by)
SELECT 
    id,
    name,
    slug,
    created_at,
    updated_at,
    (SELECT id FROM user_profiles WHERE organization_id = legacy_organizations.id AND role = 'manager' LIMIT 1) as created_by
FROM legacy_organizations
WHERE is_active = true;

-- Step 2: Create workspace settings for each workspace
INSERT INTO workspace_settings (workspace_id)
SELECT id FROM workspaces;

-- Step 3: Create workspace billing records for each workspace
INSERT INTO workspace_billing (workspace_id)
SELECT id FROM workspaces;

-- Step 4: Migrate user_profiles to users table (global users)
INSERT INTO users (id, email, first_name, last_name, avatar_url, phone, timezone, created_at, updated_at)
SELECT DISTINCT ON (id)
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    phone,
    timezone,
    created_at,
    updated_at
FROM user_profiles
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    timezone = COALESCE(EXCLUDED.timezone, users.timezone),
    updated_at = EXCLUDED.updated_at;

-- Step 5: Create workspace memberships from user_profiles
INSERT INTO workspace_members (user_id, workspace_id, role, is_active, created_at, accepted_at)
SELECT 
    up.id,
    up.organization_id, -- This references the workspace (migrated from organizations)
    CASE up.role 
        WHEN 'manager' THEN 'owner'::workspace_role
        WHEN 'sales_rep' THEN 'member'::workspace_role
        WHEN 'setter' THEN 'member'::workspace_role
        ELSE 'member'::workspace_role
    END as role,
    up.is_active,
    up.created_at,
    up.created_at as accepted_at -- Assume existing users have already accepted
FROM user_profiles up
WHERE EXISTS (SELECT 1 FROM workspaces w WHERE w.id = up.organization_id)
ON CONFLICT (user_id, workspace_id) DO NOTHING;

-- Step 6: Update workspace created_by to use the first owner/manager
UPDATE workspaces 
SET created_by = (
    SELECT wm.user_id 
    FROM workspace_members wm 
    WHERE wm.workspace_id = workspaces.id 
    AND wm.role = 'owner' 
    ORDER BY wm.created_at 
    LIMIT 1
)
WHERE created_by IS NULL;

-- Step 7: Update existing tables to reference workspaces instead of organizations
-- Update products table
UPDATE products SET organization_id = organization_id WHERE organization_id IN (SELECT id FROM workspaces);

-- Update daily_metrics table
UPDATE daily_metrics SET organization_id = organization_id WHERE organization_id IN (SELECT id FROM workspaces);

-- Update product_sales table
UPDATE product_sales SET organization_id = organization_id WHERE organization_id IN (SELECT id FROM workspaces);

-- Update questions table
UPDATE questions SET organization_id = organization_id WHERE organization_id IN (SELECT id FROM workspaces);

-- Update reports table
UPDATE reports SET organization_id = organization_id WHERE organization_id IN (SELECT id FROM workspaces);

-- Update goals table
UPDATE goals SET organization_id = organization_id WHERE organization_id IN (SELECT id FROM workspaces);

-- Update notification_settings table
UPDATE notification_settings SET organization_id = organization_id WHERE organization_id IN (SELECT id FROM workspaces);

-- Step 8: Rename organization_id columns to workspace_id in existing tables for clarity
-- We'll do this in separate ALTER statements to maintain clarity

-- Products table
ALTER TABLE products RENAME COLUMN organization_id TO workspace_id;

-- Daily metrics table
ALTER TABLE daily_metrics RENAME COLUMN organization_id TO workspace_id;

-- Product sales table
ALTER TABLE product_sales RENAME COLUMN organization_id TO workspace_id;

-- Questions table
ALTER TABLE questions RENAME COLUMN organization_id TO workspace_id;

-- Reports table
ALTER TABLE reports RENAME COLUMN organization_id TO workspace_id;

-- Goals table
ALTER TABLE goals RENAME COLUMN organization_id TO workspace_id;

-- Notification settings table
ALTER TABLE notification_settings RENAME COLUMN organization_id TO workspace_id;

-- Step 9: Add foreign key constraints to reference workspaces
ALTER TABLE products ADD CONSTRAINT fk_products_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE daily_metrics ADD CONSTRAINT fk_daily_metrics_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE product_sales ADD CONSTRAINT fk_product_sales_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE questions ADD CONSTRAINT fk_questions_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE reports ADD CONSTRAINT fk_reports_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE goals ADD CONSTRAINT fk_goals_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

ALTER TABLE notification_settings ADD CONSTRAINT fk_notification_settings_workspace 
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

-- Step 10: Update RLS policies for existing tables to use workspaces

-- Drop old organization-based policies
DROP POLICY IF EXISTS "Users can view their organization" ON legacy_organizations;
DROP POLICY IF EXISTS "Managers can update their organization" ON legacy_organizations;

-- Update existing table policies to use workspace_members
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "New users can insert their profile" ON user_profiles;
DROP POLICY IF EXISTS "Managers can create user profiles in their organization" ON user_profiles;
DROP POLICY IF EXISTS "Managers can update users in their organization" ON user_profiles;

-- Create new workspace-based policies for products
DROP POLICY IF EXISTS "Users can view products in their workspace" ON products;
CREATE POLICY "workspace_products_access" ON products
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Create new workspace-based policies for daily_metrics
DROP POLICY IF EXISTS "Users can view metrics in their workspace" ON daily_metrics;
CREATE POLICY "workspace_daily_metrics_access" ON daily_metrics
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Create workspace-based policies for other tables
CREATE POLICY "workspace_product_sales_access" ON product_sales
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "workspace_questions_access" ON questions
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "workspace_reports_access" ON reports
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "workspace_goals_access" ON goals
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "workspace_notification_settings_access" ON notification_settings
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Step 11: Create initial audit log entries for the migration
INSERT INTO audit_logs (workspace_id, event_type, resource_type, metadata)
SELECT 
    w.id,
    'workspace.migrated',
    'workspace',
    jsonb_build_object(
        'migration_date', NOW(),
        'original_organization_id', w.id,
        'members_count', (
            SELECT COUNT(*) FROM workspace_members wm WHERE wm.workspace_id = w.id
        )
    )
FROM workspaces w;

-- Step 12: Update existing functions to work with new schema
DROP FUNCTION IF EXISTS get_user_stats();
DROP FUNCTION IF EXISTS get_org_stats();
DROP FUNCTION IF EXISTS get_all_users_admin();

-- New workspace-aware admin functions
CREATE OR REPLACE FUNCTION get_workspace_stats(workspace_uuid UUID DEFAULT NULL)
RETURNS TABLE (
    total_users BIGINT,
    owners BIGINT,
    admins BIGINT,
    members BIGINT,
    viewers BIGINT,
    active_users BIGINT,
    inactive_users BIGINT
) 
SECURITY DEFINER
AS $$
BEGIN
    -- If no workspace specified, use first workspace user has access to
    IF workspace_uuid IS NULL THEN
        SELECT workspace_id INTO workspace_uuid
        FROM workspace_members 
        WHERE user_id = auth.uid() AND is_active = true
        LIMIT 1;
    END IF;
    
    -- Check if user has access to this workspace
    IF NOT has_workspace_permission(workspace_uuid, 'member') THEN
        RAISE EXCEPTION 'Access denied to workspace';
    END IF;
    
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
        COUNT(CASE WHEN role = 'member' THEN 1 END) as members,
        COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewers,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users
    FROM workspace_members wm
    WHERE wm.workspace_id = workspace_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_all_workspace_members(workspace_uuid UUID DEFAULT NULL)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    full_name TEXT,
    role workspace_role,
    is_active BOOLEAN,
    joined_date DATE,
    last_seen DATE
) 
SECURITY DEFINER
AS $$
BEGIN
    -- If no workspace specified, use first workspace user has access to
    IF workspace_uuid IS NULL THEN
        SELECT workspace_id INTO workspace_uuid
        FROM workspace_members 
        WHERE user_id = auth.uid() AND is_active = true
        LIMIT 1;
    END IF;
    
    -- Check if user has access to this workspace
    IF NOT has_workspace_permission(workspace_uuid, 'member') THEN
        RAISE EXCEPTION 'Access denied to workspace';
    END IF;
    
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        (u.first_name || ' ' || u.last_name) as full_name,
        wm.role,
        wm.is_active,
        wm.created_at::DATE as joined_date,
        u.last_seen_at::DATE as last_seen
    FROM workspace_members wm
    JOIN users u ON wm.user_id = u.id
    WHERE wm.workspace_id = workspace_uuid
    ORDER BY wm.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_workspace_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_workspace_members(UUID) TO authenticated;

-- Step 13: Update the user registration trigger to work with new schema
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    _workspace_id UUID;
    _workspace_slug TEXT;
    _workspace_name TEXT;
    _user_role workspace_role;
BEGIN
    RAISE LOG 'handle_new_user triggered for user: %', NEW.email;
    
    -- Create user record in users table
    INSERT INTO users (id, email, first_name, last_name, timezone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'First'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Last'),
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
    );
    
    -- Check if this is an invited user (has workspace_id in metadata)
    IF NEW.raw_user_meta_data ? 'workspace_id' THEN
        -- This is an invited user
        _workspace_id := (NEW.raw_user_meta_data->>'workspace_id')::UUID;
        
        -- Verify workspace exists
        IF NOT EXISTS (SELECT 1 FROM workspaces WHERE id = _workspace_id) THEN
            RAISE EXCEPTION 'Invalid workspace ID: %', _workspace_id;
        END IF;
        
        -- Get role from invitation or default to member
        _user_role := COALESCE((NEW.raw_user_meta_data->>'role')::workspace_role, 'member');
        
    ELSE
        -- This is a new workspace creation (first user becomes owner)
        _workspace_name := COALESCE(NEW.raw_user_meta_data->>'workspace_name', NEW.email || '''s Workspace');
        _workspace_slug := COALESCE(NEW.raw_user_meta_data->>'workspace_slug', LOWER(REPLACE(NEW.email, '@', '-')));
        
        -- Create new workspace
        INSERT INTO workspaces (name, slug, created_by)
        VALUES (_workspace_name, _workspace_slug, NEW.id)
        RETURNING id INTO _workspace_id;
        
        -- Create workspace settings
        INSERT INTO workspace_settings (workspace_id) VALUES (_workspace_id);
        
        -- Create workspace billing record
        INSERT INTO workspace_billing (workspace_id) VALUES (_workspace_id);
        
        -- First user becomes owner
        _user_role := 'owner';
    END IF;
    
    -- Create workspace membership
    INSERT INTO workspace_members (user_id, workspace_id, role, accepted_at)
    VALUES (NEW.id, _workspace_id, _user_role, NOW());
    
    -- Create audit log entry
    INSERT INTO audit_logs (workspace_id, user_id, event_type, resource_type, resource_id, metadata)
    VALUES (
        _workspace_id,
        NEW.id,
        'user.created',
        'user',
        NEW.id,
        jsonb_build_object(
            'email', NEW.email,
            'role', _user_role,
            'registration_method', CASE WHEN NEW.raw_user_meta_data ? 'workspace_id' THEN 'invitation' ELSE 'signup' END
        )
    );
    
    RAISE LOG 'Successfully created user and workspace membership for: %', NEW.email;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user for %: % %', NEW.email, SQLERRM, SQLSTATE;
        RAISE;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

RAISE NOTICE 'Data migration completed successfully. Existing data has been migrated to the new multi-tenant structure.';