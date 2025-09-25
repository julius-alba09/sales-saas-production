-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('manager', 'sales_rep', 'setter');
CREATE TYPE report_type AS ENUM ('eod', 'eow', 'eom');
CREATE TYPE question_type AS ENUM ('boolean', 'text', 'number', 'scale');
CREATE TYPE goal_period AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');

-- Create Organizations table
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true
);

-- Create custom user profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'sales_rep',
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT unique_email_per_org UNIQUE (organization_id, email)
);

-- Create Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id)
);

-- Create Daily Metrics table (for both sales reps and setters)
CREATE TABLE daily_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    
    -- Sales Rep Metrics
    scheduled_calls INTEGER DEFAULT 0,
    live_calls INTEGER DEFAULT 0,
    offers_made INTEGER DEFAULT 0,
    closes INTEGER DEFAULT 0,
    deposits INTEGER DEFAULT 0,
    
    -- Setter Metrics  
    outbound_calls INTEGER DEFAULT 0,
    minutes_messaging INTEGER DEFAULT 0,
    triage_offers_made INTEGER DEFAULT 0,
    triage_calls_booked INTEGER DEFAULT 0,
    consult_offers_made INTEGER DEFAULT 0,
    consult_calls_booked INTEGER DEFAULT 0,
    scheduled_sets INTEGER DEFAULT 0,
    closed_sets INTEGER DEFAULT 0,
    
    -- Additional metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- Create Product Sales table (for tracking individual product performance)
CREATE TABLE product_sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daily_metric_id UUID REFERENCES daily_metrics(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    units_closed INTEGER DEFAULT 0,
    cash_collected DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Questions table (for customizable EOD/EOW/EOM questions)
CREATE TABLE questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    report_type report_type NOT NULL,
    section TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL DEFAULT 'text',
    question_order INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id)
);

-- Create Reports table (for EOD/EOW/EOM submissions)
CREATE TABLE reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    report_type report_type NOT NULL,
    report_date DATE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    is_submitted BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_report_period UNIQUE (user_id, report_type, period_start, period_end)
);

-- Create Report Responses table (for answers to questions)
CREATE TABLE report_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    response_text TEXT,
    response_number DECIMAL,
    response_boolean BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Goals table
CREATE TABLE goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    goal_period goal_period NOT NULL,
    metric_name TEXT NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id)
);

-- Create Notifications Settings table
CREATE TABLE notification_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    eod_reminders JSONB DEFAULT '{"enabled": true, "time": "18:00"}'::jsonb,
    performance_reports JSONB DEFAULT '{"enabled": true, "frequency": "weekly"}'::jsonb,
    team_updates JSONB DEFAULT '{"enabled": false, "frequency": "daily"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_notifications UNIQUE (user_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_org_id ON user_profiles(organization_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date);
CREATE INDEX idx_daily_metrics_org_date ON daily_metrics(organization_id, date);
CREATE INDEX idx_products_org_active ON products(organization_id, is_active);
CREATE INDEX idx_reports_user_type ON reports(user_id, report_type);
CREATE INDEX idx_reports_org_date ON reports(organization_id, report_date);
CREATE INDEX idx_goals_user_period ON goals(user_id, period_start, period_end);

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organizations
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Managers can update their organization" ON organizations
    FOR UPDATE USING (
        id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view profiles in their organization" ON user_profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Managers can manage users in their organization" ON user_profiles
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

CREATE POLICY "New users can insert their profile" ON user_profiles
    FOR INSERT WITH CHECK (id = auth.uid());

-- Create RLS policies for products
CREATE POLICY "Users can view products in their organization" ON products
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Managers can manage products in their organization" ON products
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- Create RLS policies for daily_metrics
CREATE POLICY "Users can view metrics in their organization" ON daily_metrics
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own metrics" ON daily_metrics
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Managers can view all metrics in their organization" ON daily_metrics
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- Create RLS policies for product_sales
CREATE POLICY "Users can view product sales in their organization" ON product_sales
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own product sales" ON product_sales
    FOR ALL USING (
        daily_metric_id IN (
            SELECT id FROM daily_metrics WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for questions
CREATE POLICY "Users can view questions in their organization" ON questions
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Managers can manage questions in their organization" ON questions
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- Create RLS policies for reports
CREATE POLICY "Users can view reports in their organization" ON reports
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own reports" ON reports
    FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for report_responses
CREATE POLICY "Users can view responses in their organization" ON report_responses
    FOR SELECT USING (
        report_id IN (
            SELECT id FROM reports WHERE organization_id IN (
                SELECT organization_id FROM user_profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage their own report responses" ON report_responses
    FOR ALL USING (
        report_id IN (
            SELECT id FROM reports WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for goals
CREATE POLICY "Users can view goals in their organization" ON goals
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own goals" ON goals
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Managers can manage all goals in their organization" ON goals
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- Create RLS policies for notification_settings
CREATE POLICY "Users can manage their own notification settings" ON notification_settings
    FOR ALL USING (user_id = auth.uid());

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_daily_metrics_updated_at
    BEFORE UPDATE ON daily_metrics
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_product_sales_updated_at
    BEFORE UPDATE ON product_sales
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_report_responses_updated_at
    BEFORE UPDATE ON report_responses
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_notification_settings_updated_at
    BEFORE UPDATE ON notification_settings
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();