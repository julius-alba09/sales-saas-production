-- Seed data for development and testing
-- This file contains sample data for organizations, users, products, and metrics

-- Create sample organizations
INSERT INTO organizations (id, name, slug, settings, is_active) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Alpha Sales Agency', 'alpha-sales', '{"theme": "blue", "features": ["reporting", "analytics"]}', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Beta Marketing Co', 'beta-marketing', '{"theme": "green", "features": ["reporting"]}', true)
ON CONFLICT (id) DO NOTHING;

-- Create sample products for Alpha Sales Agency
INSERT INTO products (id, organization_id, name, description, price, is_active) VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Premium Consultation Package', 'High-value consultation service', 5000.00, true),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Basic Coaching Program', 'Entry-level coaching service', 1500.00, true),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'VIP Mastermind', 'Exclusive high-ticket program', 10000.00, true)
ON CONFLICT (id) DO NOTHING;

-- Create sample products for Beta Marketing Co
INSERT INTO products (id, organization_id, name, description, price, is_active) VALUES 
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Marketing Audit Service', 'Comprehensive marketing analysis', 2000.00, true),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Social Media Management', 'Monthly social media package', 800.00, true)
ON CONFLICT (id) DO NOTHING;

-- Create sample default questions for EOD reports
INSERT INTO questions (id, organization_id, report_type, section, question_text, question_type, question_order, is_required, is_active) VALUES 
  -- Alpha Sales Agency questions
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'eod', 'Daily Reflection', 'What was your biggest win today?', 'text', 1, true, true),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'eod', 'Daily Reflection', 'What was your biggest challenge today?', 'text', 2, true, true),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'eod', 'Daily Reflection', 'Rate your energy level (1-10)', 'number', 3, true, true),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'eod', 'Daily Reflection', 'Did you achieve your daily goal?', 'boolean', 4, true, true),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'eod', 'Tomorrow Planning', 'What is your top priority for tomorrow?', 'text', 5, true, true),
  
  -- Beta Marketing Co questions
  ('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'eod', 'Daily Reflection', 'Describe your most productive activity today', 'text', 1, true, true),
  ('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'eod', 'Daily Reflection', 'How satisfied are you with today''s results? (1-10)', 'scale', 2, true, true),
  ('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'eod', 'Tomorrow Planning', 'What will you focus on tomorrow?', 'text', 3, true, true)
ON CONFLICT (id) DO NOTHING;

-- Note: User profiles and daily metrics will be created when actual users sign up
-- The auth trigger will handle user profile creation automatically

-- Create sample goals (these would normally be created by users/managers)
-- We'll skip this for now since it requires actual user IDs

-- Create notification settings templates (these are created automatically by the trigger)

-- Sample daily metrics data would also be created by users in real usage
-- For testing purposes, you can create test data after creating test users

-- Insert some sample weekly/monthly questions
INSERT INTO questions (id, organization_id, report_type, section, question_text, question_type, question_order, is_required, is_active) VALUES 
  -- Weekly questions for Alpha Sales Agency
  ('770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', 'eow', 'Weekly Review', 'What were your top 3 accomplishments this week?', 'text', 1, true, true),
  ('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'eow', 'Weekly Review', 'What challenges did you face and how did you overcome them?', 'text', 2, true, true),
  ('770e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'eow', 'Weekly Review', 'Rate your overall performance this week (1-10)', 'scale', 3, true, true),
  ('770e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'eow', 'Next Week Planning', 'What are your top 3 goals for next week?', 'text', 4, true, true),
  
  -- Monthly questions for Alpha Sales Agency
  ('770e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'eom', 'Monthly Review', 'What was your biggest achievement this month?', 'text', 1, true, true),
  ('770e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440001', 'eom', 'Monthly Review', 'What skills did you develop or improve this month?', 'text', 2, true, true),
  ('770e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440001', 'eom', 'Monthly Review', 'How would you rate your overall satisfaction this month? (1-10)', 'scale', 3, true, true),
  ('770e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440001', 'eom', 'Next Month Planning', 'What are your top priorities for next month?', 'text', 4, true, true)
ON CONFLICT (id) DO NOTHING;