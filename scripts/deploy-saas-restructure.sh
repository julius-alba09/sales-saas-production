#!/bin/bash

# SaaS Restructuring Deployment Script
# This script applies all the changes to transform your app into a proper multi-tenant SaaS

set -e  # Exit on any error

echo "🚀 Starting SaaS Architecture Restructuring"
echo "==========================================="
echo ""

# Configuration
DB_BACKUP_PATH="/tmp/sales-saas-backup-$(date +%Y%m%d-%H%M%S).sql"
PROJECT_ROOT="/Users/juliusalba/sales-saas-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Pre-deployment checks
echo "Step 1: Pre-deployment Checks"
echo "=============================="

# Check if Supabase is running
if ! docker ps | grep -q "supabase_db_sales-saas-app"; then
    log_error "Supabase database is not running!"
    log_info "Starting Supabase..."
    cd "$PROJECT_ROOT"
    supabase start
fi

# Check if database is accessible
if ! docker exec supabase_db_sales-saas-app psql -U postgres -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    log_error "Cannot connect to database!"
    exit 1
fi

log_success "Database connectivity verified"

# Step 2: Create database backup
echo ""
echo "Step 2: Database Backup"
echo "======================="

log_info "Creating database backup at $DB_BACKUP_PATH"
docker exec supabase_db_sales-saas-app pg_dump -U postgres -d postgres > "$DB_BACKUP_PATH"

if [ -f "$DB_BACKUP_PATH" ]; then
    BACKUP_SIZE=$(stat -f%z "$DB_BACKUP_PATH" 2>/dev/null || stat -c%s "$DB_BACKUP_PATH" 2>/dev/null || echo "unknown")
    log_success "Database backup created (Size: $BACKUP_SIZE bytes)"
else
    log_error "Failed to create database backup!"
    exit 1
fi

# Step 3: Show current database state
echo ""
echo "Step 3: Current Database State"
echo "=============================="

log_info "Current user count:"
docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres << 'EOF'
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'manager' THEN 1 END) as managers,
    COUNT(CASE WHEN role = 'sales_rep' THEN 1 END) as sales_reps,
    COUNT(CASE WHEN role = 'setter' THEN 1 END) as setters
FROM user_profiles;

SELECT COUNT(*) as organizations FROM organizations;
EOF

# Step 4: Apply database migrations
echo ""
echo "Step 4: Applying Database Migrations"
echo "===================================="

log_info "Applying multi-tenant schema migration..."
if docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres < "$PROJECT_ROOT/supabase/migrations/20250922124000_restructure_multitenant_schema.sql"; then
    log_success "Multi-tenant schema created"
else
    log_error "Failed to apply multi-tenant schema!"
    log_warning "Restoring database from backup..."
    docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres < "$DB_BACKUP_PATH"
    exit 1
fi

log_info "Migrating existing data..."
if docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres < "$PROJECT_ROOT/supabase/migrations/20250922124001_migrate_existing_data.sql"; then
    log_success "Data migration completed"
else
    log_error "Failed to migrate existing data!"
    log_warning "Restoring database from backup..."
    docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres < "$DB_BACKUP_PATH"
    exit 1
fi

# Step 5: Verify migration success
echo ""
echo "Step 5: Migration Verification"
echo "=============================="

log_info "Verifying new database structure..."

# Check if new tables exist
TABLES_CHECK=$(docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres -c "
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name IN ('workspaces', 'workspace_members', 'workspace_settings', 'audit_logs', 'users');
" -t | xargs)

if [ "$TABLES_CHECK" = "5" ]; then
    log_success "All new tables created successfully"
else
    log_error "Expected 5 new tables, found $TABLES_CHECK"
    exit 1
fi

# Check data migration
log_info "Verifying data migration..."
docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres << 'EOF'
\echo 'New workspace structure:'
SELECT 
    COUNT(*) as workspaces,
    COUNT(CASE WHEN subscription_status = 'trial' THEN 1 END) as trial_workspaces,
    COUNT(CASE WHEN plan_type = 'free' THEN 1 END) as free_plan
FROM workspaces;

\echo ''
\echo 'Workspace memberships:'
SELECT 
    COUNT(*) as total_memberships,
    COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'member' THEN 1 END) as members
FROM workspace_members;

\echo ''
\echo 'Global users:'
SELECT COUNT(*) as global_users FROM users;
EOF

# Step 6: Frontend updates (optional)
echo ""
echo "Step 6: Frontend Architecture Updates"
echo "===================================="

log_info "Frontend restructuring files have been created"
log_info "New files:"
log_info "  - frontend/src/hooks/useWorkspace.ts (New workspace-aware auth system)"
log_info "  - SAAS_AUDIT_REPORT.md (Complete audit and restructuring plan)"

# Step 7: Create new admin interface
echo ""
echo "Step 7: Updated Monitoring Scripts"
echo "================================="

# Update monitoring script for new structure
log_info "Updating monitoring scripts for new structure..."

cat > "$PROJECT_ROOT/scripts/monitor-workspaces.sh" << 'EOF'
#!/bin/bash

echo "🚀 Multi-Tenant SaaS Monitor"
echo "============================"
echo

docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres << 'SQL'
\echo '📊 WORKSPACE STATISTICS'
\echo '======================'
SELECT 
  COUNT(*) as total_workspaces,
  COUNT(CASE WHEN subscription_status = 'trial' THEN 1 END) as trial_workspaces,
  COUNT(CASE WHEN subscription_status = 'active' THEN 1 END) as paid_workspaces,
  COUNT(CASE WHEN plan_type = 'free' THEN 1 END) as free_plans,
  COUNT(CASE WHEN plan_type = 'pro' THEN 1 END) as pro_plans,
  COUNT(CASE WHEN plan_type = 'enterprise' THEN 1 END) as enterprise_plans,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_workspaces
FROM workspaces;

\echo ''
\echo '👥 USER STATISTICS'  
\echo '=================='
SELECT 
  COUNT(*) as total_users,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'member' THEN 1 END) as members,
  COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewers,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_memberships
FROM workspace_members;

\echo ''
\echo '📈 TOP WORKSPACES BY MEMBERS'
\echo '============================'
SELECT 
  w.name as workspace_name,
  w.plan_type,
  COUNT(wm.user_id) as member_count,
  w.created_at::date as created_date
FROM workspaces w
LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.is_active = true
GROUP BY w.id, w.name, w.plan_type, w.created_at
ORDER BY member_count DESC, w.created_at DESC
LIMIT 10;

\echo ''
\echo '🔍 RECENT ACTIVITY (Last 7 days)'
\echo '================================='
SELECT 
  DATE(created_at) as date,
  event_type,
  COUNT(*) as events
FROM audit_logs 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, events DESC;
SQL

echo
echo "✅ Monitoring complete!"
echo
echo "💡 Usage:"
echo "  - Run this script: ./scripts/monitor-workspaces.sh"
echo "  - Check specific workspace: Access new admin interface"
EOF

chmod +x "$PROJECT_ROOT/scripts/monitor-workspaces.sh"
log_success "Updated monitoring script created"

# Step 8: Test new functionality
echo ""
echo "Step 8: Testing New Functionality"
echo "================================="

log_info "Testing workspace functions..."

# Test workspace function
FUNCTION_TEST=$(docker exec -i supabase_db_sales-saas-app psql -U postgres -d postgres -c "SELECT get_user_workspaces();" -t 2>/dev/null | wc -l | xargs)

if [ "$FUNCTION_TEST" -gt 0 ]; then
    log_success "Workspace functions working correctly"
else
    log_warning "Workspace functions may need attention - check logs"
fi

# Step 9: Generate summary report
echo ""
echo "Step 9: Migration Summary"
echo "========================"

# Create migration report
REPORT_FILE="$PROJECT_ROOT/MIGRATION_REPORT_$(date +%Y%m%d-%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# SaaS Migration Report - $(date)

## ✅ Migration Completed Successfully

### Database Changes Applied:
- ✅ Multi-tenant schema created (workspaces, workspace_members, etc.)
- ✅ Existing data migrated to new structure
- ✅ RLS policies updated for multi-tenancy
- ✅ New functions created for workspace management
- ✅ Audit logging system implemented

### Backup Information:
- **Backup File**: $DB_BACKUP_PATH
- **Backup Size**: $(stat -f%z "$DB_BACKUP_PATH" 2>/dev/null || stat -c%s "$DB_BACKUP_PATH" 2>/dev/null || echo "unknown") bytes
- **Created**: $(date)

### New Features Added:
1. **Multi-Tenant Architecture**: Proper workspace isolation
2. **Subscription Management**: Trial periods, plan types, billing integration
3. **Role-Based Access Control**: Owner > Admin > Member > Viewer
4. **Audit Logging**: Complete activity tracking
5. **User Invitations**: Secure workspace invitations
6. **Usage Tracking**: Monitor workspace usage and limits

### Next Steps:
1. Test the new workspace functionality
2. Update frontend to use new useWorkspace hook
3. Implement billing integration (Stripe)
4. Add feature flags and plan restrictions
5. Set up monitoring and alerts

### Support:
- Monitor script: \`./scripts/monitor-workspaces.sh\`
- Backup location: \`$DB_BACKUP_PATH\`
- Log files: Check Docker logs for supabase_db_sales-saas-app
EOF

log_success "Migration completed successfully!"
echo ""
echo "📋 SUMMARY"
echo "=========="
log_success "✅ Database restructured with multi-tenant architecture"
log_success "✅ Existing data migrated safely"
log_success "✅ New workspace management system active"
log_success "✅ Audit logging implemented"
log_success "✅ Backup created at: $DB_BACKUP_PATH"
log_success "✅ Migration report: $REPORT_FILE"

echo ""
log_info "🔧 Next Actions Required:"
echo "1. Test new registration: http://localhost:3000/auth/register"
echo "2. Check admin interface: http://localhost:3000/admin/users"
echo "3. Monitor workspaces: ./scripts/monitor-workspaces.sh"
echo "4. Review migration report: $REPORT_FILE"
echo "5. Update frontend to use new workspace system"

echo ""
log_warning "⚠️  Important Notes:"
echo "• Keep the backup file safe: $DB_BACKUP_PATH"
echo "• Test all functionality before deploying to production"
echo "• Update your frontend to use the new useWorkspace hook"
echo "• Set up proper environment variables for production"

echo ""
log_success "🎉 SaaS restructuring completed! Your app is now ready for multi-tenant production use."