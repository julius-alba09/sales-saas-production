-- Create missing tables for products and EOD reports
-- This migration creates the core business logic tables

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

-- Create indexes for products
CREATE INDEX idx_products_workspace_id ON products(workspace_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Create EOD reports table
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
    mood TEXT CHECK (mood IN ('excellent', 'good', 'average', 'poor', 'terrible')),
    challenges TEXT,
    wins TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id, report_date) -- One report per user per day per workspace
);

-- Create indexes for EOD reports
CREATE INDEX idx_eod_reports_workspace_id ON eod_reports(workspace_id);
CREATE INDEX idx_eod_reports_user_id ON eod_reports(user_id);
CREATE INDEX idx_eod_reports_date ON eod_reports(report_date);
CREATE INDEX idx_eod_reports_created_at ON eod_reports(created_at);

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS policies for products
CREATE POLICY "workspace_members_can_view_products" ON products
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

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

-- Enable RLS on EOD reports table
ALTER TABLE eod_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for EOD reports
CREATE POLICY "users_can_view_own_eod_reports" ON eod_reports
    FOR SELECT USING (
        user_id = auth.uid() 
        AND workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "workspace_admins_can_view_all_eod_reports" ON eod_reports
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
            AND is_active = true
        )
    );

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

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_eod_reports_updated_at 
    BEFORE UPDATE ON eod_reports 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create workspace statistics functions
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_workspace_stats(UUID) TO authenticated;

-- Create function to get team performance
CREATE OR REPLACE FUNCTION get_team_performance(workspace_uuid UUID, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL)
RETURNS TABLE (
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    total_calls INTEGER,
    total_appointments INTEGER,
    total_sales INTEGER,
    total_revenue DECIMAL,
    reports_count BIGINT,
    avg_calls_per_day DECIMAL,
    avg_revenue_per_day DECIMAL
) 
SECURITY DEFINER
AS $$
BEGIN
  -- Check authorization
  IF NOT check_workspace_admin_permission(workspace_uuid) THEN
    RAISE EXCEPTION 'Insufficient privileges to access team performance data';
  END IF;

  -- Set default date range if not provided
  IF start_date IS NULL THEN
    start_date := date_trunc('month', CURRENT_DATE)::DATE;
  END IF;
  
  IF end_date IS NULL THEN
    end_date := CURRENT_DATE;
  END IF;

  RETURN QUERY
  SELECT 
    wm.user_id,
    u.email as user_email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as user_name,
    COALESCE(SUM(er.calls_made)::INTEGER, 0) as total_calls,
    COALESCE(SUM(er.appointments)::INTEGER, 0) as total_appointments,
    COALESCE(SUM(er.sales)::INTEGER, 0) as total_sales,
    COALESCE(SUM(er.revenue), 0) as total_revenue,
    COUNT(er.id) as reports_count,
    CASE 
      WHEN COUNT(er.id) > 0 THEN ROUND(SUM(er.calls_made)::DECIMAL / COUNT(er.id), 2)
      ELSE 0
    END as avg_calls_per_day,
    CASE 
      WHEN COUNT(er.id) > 0 THEN ROUND(SUM(er.revenue) / COUNT(er.id), 2)
      ELSE 0
    END as avg_revenue_per_day
  FROM workspace_members wm
  JOIN auth.users u ON wm.user_id = u.id
  LEFT JOIN eod_reports er ON er.user_id = wm.user_id 
    AND er.workspace_id = workspace_uuid
    AND er.report_date >= start_date 
    AND er.report_date <= end_date
  WHERE wm.workspace_id = workspace_uuid 
    AND wm.is_active = true
  GROUP BY wm.user_id, u.email, u.raw_user_meta_data->>'full_name'
  ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION get_team_performance(UUID, DATE, DATE) TO authenticated;