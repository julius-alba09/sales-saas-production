-- Multi-Tenant SaaS Database Restructure
-- This migration transforms the current single-tenant structure into proper multi-tenancy

-- First, create new types and enums
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled', 'unpaid');
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE feature_flag AS ENUM ('analytics', 'advanced_reporting', 'api_access', 'custom_integrations', 'priority_support');

-- Create workspaces table (replaces organizations with proper multi-tenancy)
CREATE TABLE workspaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    
    -- Subscription & Billing
    subscription_status subscription_status DEFAULT 'trial',
    plan_type plan_type DEFAULT 'free',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Settings & Configuration
    settings JSONB DEFAULT '{}'::jsonb,
    features FEATURE_FLAG[] DEFAULT '{}',
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Usage tracking
    monthly_active_users INTEGER DEFAULT 0,
    storage_used_mb INTEGER DEFAULT 0,
    api_calls_this_month INTEGER DEFAULT 0
);

-- Create global users table (simplified, extends auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    onboarded_at TIMESTAMP WITH TIME ZONE,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace members table (many-to-many relationship)
CREATE TABLE workspace_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    role workspace_role NOT NULL DEFAULT 'member',
    
    -- Invitation system
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: user can only have one role per workspace
    CONSTRAINT unique_user_workspace UNIQUE (user_id, workspace_id)
);

-- Create workspace invitations table
CREATE TABLE workspace_invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role workspace_role NOT NULL DEFAULT 'member',
    token TEXT NOT NULL UNIQUE,
    
    -- Invitation metadata
    invited_by UUID REFERENCES users(id) NOT NULL,
    accepted_by UUID REFERENCES users(id),
    
    -- Status
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_workspace_email_invite UNIQUE (workspace_id, email)
);

-- Create workspace settings table
CREATE TABLE workspace_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Branding
    logo_url TEXT,
    brand_color TEXT DEFAULT '#3B82F6',
    
    -- Notifications
    email_notifications JSONB DEFAULT '{
        "digest": true,
        "mentions": true,
        "updates": true
    }'::jsonb,
    
    -- Security
    enforce_2fa BOOLEAN DEFAULT false,
    allowed_email_domains TEXT[],
    session_timeout_minutes INTEGER DEFAULT 480,
    
    -- API & Integrations
    api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    webhook_url TEXT,
    webhook_secret TEXT DEFAULT encode(gen_random_bytes(16), 'hex'),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create billing table
CREATE TABLE workspace_billing (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Billing details
    billing_email TEXT,
    company_name TEXT,
    tax_id TEXT,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'US',
    
    -- Payment
    payment_method_id TEXT,
    last_invoice_date TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage tracking table
CREATE TABLE workspace_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    
    -- Usage metrics
    date DATE NOT NULL,
    active_users INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    storage_mb INTEGER DEFAULT 0,
    
    -- Feature usage
    features_used JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_workspace_usage_date UNIQUE (workspace_id, date)
);

-- Create audit log table
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Event details
    event_type TEXT NOT NULL, -- 'user.created', 'workspace.updated', etc.
    resource_type TEXT NOT NULL, -- 'user', 'workspace', 'project', etc.
    resource_id UUID,
    
    -- Event data
    changes JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing tables to reference workspaces instead of organizations

-- Rename organizations to legacy_organizations (for data migration)
ALTER TABLE organizations RENAME TO legacy_organizations;

-- Update user_profiles to reference new users and workspace_members tables
-- We'll handle this in a separate migration to preserve data

-- Create indexes for performance
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_active ON workspaces(is_active) WHERE is_active = true;
CREATE INDEX idx_workspaces_subscription ON workspaces(subscription_status, plan_type);

CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_active ON workspace_members(workspace_id, is_active) WHERE is_active = true;

CREATE INDEX idx_workspace_invitations_token ON workspace_invitations(token);
CREATE INDEX idx_workspace_invitations_email ON workspace_invitations(email);
CREATE INDEX idx_workspace_invitations_expires ON workspace_invitations(expires_at) WHERE accepted_at IS NULL;

CREATE INDEX idx_audit_logs_workspace_time ON audit_logs(workspace_id, created_at);
CREATE INDEX idx_audit_logs_event ON audit_logs(event_type, created_at);

CREATE INDEX idx_workspace_usage_date ON workspace_usage(workspace_id, date);

-- Enable RLS on all new tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Workspaces: Users can only see workspaces they're members of
CREATE POLICY "workspace_member_access" ON workspaces
    FOR ALL USING (
        id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Users: Users can see their own profile and profiles of users in their workspaces
CREATE POLICY "user_own_profile" ON users
    FOR ALL USING (id = auth.uid());

CREATE POLICY "user_workspace_members" ON users
    FOR SELECT USING (
        id IN (
            SELECT DISTINCT wm2.user_id 
            FROM workspace_members wm1
            JOIN workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
            WHERE wm1.user_id = auth.uid() AND wm1.is_active = true AND wm2.is_active = true
        )
    );

-- Workspace members: Can see members of workspaces they belong to
CREATE POLICY "workspace_members_access" ON workspace_members
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Workspace settings: Only admins/owners can access
CREATE POLICY "workspace_settings_admin" ON workspace_settings
    FOR ALL USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND is_active = true
        )
    );

-- Audit logs: Users can see audit logs for their workspaces
CREATE POLICY "audit_logs_workspace_access" ON audit_logs
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Add helpful functions

-- Function to check if user has permission in workspace
CREATE OR REPLACE FUNCTION has_workspace_permission(
    workspace_uuid UUID,
    required_role workspace_role DEFAULT 'member'
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    user_role workspace_role;
    role_hierarchy INTEGER;
    required_hierarchy INTEGER;
BEGIN
    -- Get user's role in the workspace
    SELECT role INTO user_role
    FROM workspace_members
    WHERE workspace_id = workspace_uuid 
    AND user_id = auth.uid() 
    AND is_active = true;
    
    IF user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Define role hierarchy (higher number = more permissions)
    role_hierarchy := CASE user_role
        WHEN 'viewer' THEN 1
        WHEN 'member' THEN 2
        WHEN 'admin' THEN 3
        WHEN 'owner' THEN 4
    END;
    
    required_hierarchy := CASE required_role
        WHEN 'viewer' THEN 1
        WHEN 'member' THEN 2
        WHEN 'admin' THEN 3
        WHEN 'owner' THEN 4
    END;
    
    RETURN role_hierarchy >= required_hierarchy;
END;
$$;

-- Function to get user's workspaces
CREATE OR REPLACE FUNCTION get_user_workspaces()
RETURNS TABLE (
    workspace_id UUID,
    workspace_name TEXT,
    workspace_slug TEXT,
    user_role workspace_role,
    plan_type plan_type,
    is_trial BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.name,
        w.slug,
        wm.role,
        w.plan_type,
        (w.trial_ends_at > NOW()) as is_trial
    FROM workspaces w
    JOIN workspace_members wm ON w.id = wm.workspace_id
    WHERE wm.user_id = auth.uid() 
    AND wm.is_active = true
    AND w.is_active = true
    ORDER BY w.created_at;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION has_workspace_permission(UUID, workspace_role) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_workspaces() TO authenticated;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON workspace_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_settings_updated_at BEFORE UPDATE ON workspace_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();