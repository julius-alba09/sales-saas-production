-- Seed Data for Sales SaaS Application

-- Default EOD Questions (these will be inserted for new organizations)
-- Pipeline Management Section
INSERT INTO eod_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'pipeline', 'Is my Sales Pipeline 100% Updated?', 'boolean', 1, true),
    ('00000000-0000-0000-0000-000000000000', 'pipeline', 'Is my Conversations Tab 100% Updated?', 'boolean', 2, true),
    ('00000000-0000-0000-0000-000000000000', 'pipeline', 'How Many Warm Leads Do I Still Need to Call?', 'number', 3, true);

-- Consults Section
INSERT INTO eod_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'consults', 'List Consults (objections, why they\'re not moving forward, plan for follow-up)', 'text', 4, true);

-- Reflection Section
INSERT INTO eod_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'reflection', 'How Would I Rate Myself?', 'scale', 5, true),
    ('00000000-0000-0000-0000-000000000000', 'reflection', 'Did I uncover the true pain on my calls?', 'boolean', 6, true),
    ('00000000-0000-0000-0000-000000000000', 'reflection', 'Did I isolate and overcome objections?', 'boolean', 7, true),
    ('00000000-0000-0000-0000-000000000000', 'reflection', 'Did I have positive energy on my calls?', 'boolean', 8, true),
    ('00000000-0000-0000-0000-000000000000', 'reflection', 'Did I operate at my full potential today?', 'boolean', 9, true),
    ('00000000-0000-0000-0000-000000000000', 'reflection', 'Am I going to hit projections this week/month?', 'boolean', 10, true),
    ('00000000-0000-0000-0000-000000000000', 'reflection', 'My overall performance:', 'text', 11, true);

-- Summary Section
INSERT INTO eod_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'summary', 'How was your day?', 'text', 12, true),
    ('00000000-0000-0000-0000-000000000000', 'summary', 'Where do you need help?', 'text', 13, true);

-- Default Weekly Questions
-- Weekly Goal Section
INSERT INTO weekly_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'weekly_goal', 'What was your weekly goal? Did you reach it?', 'text', 1, true),
    ('00000000-0000-0000-0000-000000000000', 'weekly_goal', 'What helped you succeed / What would you have needed to do differently to succeed?', 'text', 2, true),
    ('00000000-0000-0000-0000-000000000000', 'weekly_goal', 'What is your goal for next week?', 'text', 3, true),
    ('00000000-0000-0000-0000-000000000000', 'weekly_goal', 'What will you do differently next week to reach your goal?', 'text', 4, true);

-- Weekly Summary Section
INSERT INTO weekly_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'summary', 'How was your week?', 'text', 5, true),
    ('00000000-0000-0000-0000-000000000000', 'summary', 'Where do you need help?', 'text', 6, true);

-- Default Monthly Questions
-- Monthly Goal Section
INSERT INTO monthly_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'monthly_goal', 'What was your monthly goal? Did you reach it?', 'text', 1, true),
    ('00000000-0000-0000-0000-000000000000', 'monthly_goal', 'What helped you succeed / What would you have needed to do differently to succeed?', 'text', 2, true),
    ('00000000-0000-0000-0000-000000000000', 'monthly_goal', 'What is your goal for next month?', 'text', 3, true),
    ('00000000-0000-0000-0000-000000000000', 'monthly_goal', 'What will you do differently next month to reach your goal?', 'text', 4, true);

-- Monthly Summary Section
INSERT INTO monthly_questions (organization_id, section, question_text, question_type, question_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000000', 'summary', 'How was your month?', 'text', 5, true),
    ('00000000-0000-0000-0000-000000000000', 'summary', 'Where do you need help?', 'text', 6, true);

-- Function to create default questions for new organizations
CREATE OR REPLACE FUNCTION create_default_questions_for_organization(org_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Copy default EOD questions
    INSERT INTO eod_questions (organization_id, section, question_text, question_type, question_order, is_active)
    SELECT org_id, section, question_text, question_type, question_order, is_active
    FROM eod_questions 
    WHERE organization_id = '00000000-0000-0000-0000-000000000000';
    
    -- Copy default weekly questions
    INSERT INTO weekly_questions (organization_id, section, question_text, question_type, question_order, is_active)
    SELECT org_id, section, question_text, question_type, question_order, is_active
    FROM weekly_questions 
    WHERE organization_id = '00000000-0000-0000-0000-000000000000';
    
    -- Copy default monthly questions
    INSERT INTO monthly_questions (organization_id, section, question_text, question_type, question_order, is_active)
    SELECT org_id, section, question_text, question_type, question_order, is_active
    FROM monthly_questions 
    WHERE organization_id = '00000000-0000-0000-0000-000000000000';
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create default questions for new organizations
CREATE OR REPLACE FUNCTION create_default_questions_trigger()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_default_questions_for_organization(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_default_questions_on_organization_insert
    AFTER INSERT ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION create_default_questions_trigger();