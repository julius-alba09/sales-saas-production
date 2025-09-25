-- Complete Production Database Schema
-- This migration contains the complete, production-ready schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE eod_mood AS ENUM ('excellent', 'good', 'average', 'poor', 'terrible');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create workspaces table (multi-tenant)
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace_members table (user-workspace relationships)
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    role workspace_role DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, workspace_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create eod_reports table
CREATE TABLE IF NOT EXISTS eod_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    calls_made INTEGER DEFAULT 0,
    appointments INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    mood eod_mood,
    challenges TEXT,
    wins TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id, report_date)
);

-- Create admin audit table
CREATE TABLE IF NOT EXISTS admin_function_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    workspace_id UUID REFERENCES workspaces(id),
    function_name TEXT NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_active ON workspace_members(is_active);

CREATE INDEX IF NOT EXISTS idx_products_workspace_id ON products(workspace_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_eod_reports_workspace_id ON eod_reports(workspace_id);
CREATE INDEX IF NOT EXISTS idx_eod_reports_user_id ON eod_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_eod_reports_date ON eod_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_eod_reports_created_at ON eod_reports(created_at);

CREATE INDEX IF NOT EXISTS idx_admin_audit_user_id ON admin_function_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_workspace_id ON admin_function_audit(workspace_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_executed_at ON admin_function_audit(executed_at);

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE eod_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_function_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces
DROP POLICY IF EXISTS "workspace_member_access" ON workspaces;
CREATE POLICY "workspace_member_access" ON workspaces
    FOR ALL USING (
        id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    )
    WITH CHECK (
        id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- RLS Policies for workspace_members
DROP POLICY IF EXISTS "workspace_members_access" ON workspace_members;
CREATE POLICY "workspace_members_access" ON workspace_members
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

DROP POLICY IF EXISTS "workspace_admins_manage_members" ON workspace_members;
CREATE POLICY "workspace_admins_manage_members" ON workspace_members
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    )
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    );

-- RLS Policies for products
DROP POLICY IF EXISTS "workspace_members_can_view_products" ON products;
CREATE POLICY "workspace_members_can_view_products" ON products
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

DROP POLICY IF EXISTS "workspace_admins_can_manage_products" ON products;
CREATE POLICY "workspace_admins_can_manage_products" ON products
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    )
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    );

-- RLS Policies for eod_reports
DROP POLICY IF EXISTS "users_can_view_own_eod_reports" ON eod_reports;
CREATE POLICY "users_can_view_own_eod_reports" ON eod_reports
    FOR SELECT USING (
        user_id = auth.uid() 
        AND workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

DROP POLICY IF EXISTS "workspace_admins_can_view_all_eod_reports" ON eod_reports;
CREATE POLICY "workspace_admins_can_view_all_eod_reports" ON eod_reports
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    );

DROP POLICY IF EXISTS "users_can_manage_own_eod_reports" ON eod_reports;
CREATE POLICY "users_can_manage_own_eod_reports" ON eod_reports
    FOR ALL USING (
        user_id = auth.uid()
        AND workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    )
    WITH CHECK (
        user_id = auth.uid()
        AND workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

DROP POLICY IF EXISTS "workspace_admins_can_manage_eod_reports" ON eod_reports;
CREATE POLICY "workspace_admins_can_manage_eod_reports" ON eod_reports
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    )
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    );

-- RLS Policies for admin audit
DROP POLICY IF EXISTS "workspace_admin_audit_access" ON admin_function_audit;
CREATE POLICY "workspace_admin_audit_access" ON admin_function_audit
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at 
    BEFORE UPDATE ON workspaces 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_workspace_members_updated_at ON workspace_members;
CREATE TRIGGER update_workspace_members_updated_at 
    BEFORE UPDATE ON workspace_members 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_eod_reports_updated_at ON eod_reports;
CREATE TRIGGER update_eod_reports_updated_at 
    BEFORE UPDATE ON eod_reports 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Helper functions
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

CREATE OR REPLACE FUNCTION get_workspace_stats(workspace_uuid UUID)
RETURNS TABLE (
    total_members BIGINT,
    active_members BIGINT,
    total_products BIGINT,
    active_products BIGINT,
    total_eod_reports BIGINT,
    this_month_reports BIGINT,
    total_revenue DECIMAL,
    this_month_revenue DECIMAL
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
    (SELECT COUNT(*) FROM workspace_members WHERE workspace_id = workspace_uuid) as total_members,
    (SELECT COUNT(*) FROM workspace_members WHERE workspace_id = workspace_uuid AND is_active = true) as active_members,
    (SELECT COUNT(*) FROM products WHERE workspace_id = workspace_uuid) as total_products,
    (SELECT COUNT(*) FROM products WHERE workspace_id = workspace_uuid AND is_active = true) as active_products,
    (SELECT COUNT(*) FROM eod_reports WHERE workspace_id = workspace_uuid) as total_eod_reports,
    (SELECT COUNT(*) FROM eod_reports WHERE workspace_id = workspace_uuid AND report_date >= date_trunc('month', CURRENT_DATE)) as this_month_reports,
    (SELECT COALESCE(SUM(revenue), 0) FROM eod_reports WHERE workspace_id = workspace_uuid) as total_revenue,
    (SELECT COALESCE(SUM(revenue), 0) FROM eod_reports WHERE workspace_id = workspace_uuid AND report_date >= date_trunc('month', CURRENT_DATE)) as this_month_revenue;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    workspace_id UUID;
BEGIN
    -- Create a workspace for the new user
    INSERT INTO workspaces (name, description)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'organization_name', 'My Workspace'),
        'Auto-created workspace'
    )
    RETURNING id INTO workspace_id;

    -- Add the user as owner of their workspace
    INSERT INTO workspace_members (user_id, workspace_id, role)
    VALUES (NEW.id, workspace_id, 'owner');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_workspace_admin_permission(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_workspace_stats(UUID) TO authenticated;

-- Create storage bucket for avatars (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

COMMIT;