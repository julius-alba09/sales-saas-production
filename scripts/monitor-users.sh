#!/bin/bash

# User Base Monitor Script
# Use this to check your SaaS app's user base and recent activity

echo "🚀 Sales SaaS App - User Base Monitor"
echo "===================================="
echo

# Check if Supabase is running
if ! docker ps | grep -q "supabase_db_sales-saas-app"; then
    echo "❌ Supabase database is not running"
    echo "Run: supabase start"
    exit 1
fi

# Execute monitoring queries
docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres << 'EOF'
-- Overall Statistics
\echo '📊 USER BASE STATISTICS'
\echo '======================'
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'manager' THEN 1 END) as managers,
  COUNT(CASE WHEN role = 'sales_rep' THEN 1 END) as sales_reps,
  COUNT(CASE WHEN role = 'setter' THEN 1 END) as setters,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_users
FROM user_profiles;

\echo ''
\echo '🏢 ORGANIZATION STATISTICS'
\echo '=========================='
SELECT 
  COUNT(*) as total_organizations,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_orgs,
  COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_orgs
FROM organizations;

\echo ''
\echo '📈 RECENT ACTIVITY (Last 7 days)'
\echo '================================='
SELECT 
  DATE(created_at) as registration_date,
  COUNT(*) as new_users,
  STRING_AGG(first_name || ' ' || last_name || ' (' || role || ')', ', ') as users
FROM user_profiles 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

\echo ''
\echo '👥 ALL USERS'
\echo '============'
SELECT 
  up.email,
  up.first_name || ' ' || up.last_name as full_name,
  up.role,
  o.name as organization,
  up.is_active,
  up.created_at::date as joined_date,
  up.last_login_at::date as last_login
FROM user_profiles up
JOIN organizations o ON up.organization_id = o.id
ORDER BY up.created_at DESC;

\echo ''
\echo '🔐 AUTH USERS (from auth.users table)'
\echo '====================================='
SELECT 
  email,
  email_confirmed_at IS NOT NULL as email_verified,
  created_at::date as created_date,
  last_sign_in_at::date as last_sign_in
FROM auth.users
ORDER BY created_at DESC;
EOF

echo
echo "✅ Monitor complete!"
echo
echo "💡 Usage tips:"
echo "  - Run this script anytime: ./scripts/monitor-users.sh"
echo "  - For real-time monitoring, add: watch -n 30 ./scripts/monitor-users.sh"
echo "  - Check Supabase Studio: http://localhost:54323"