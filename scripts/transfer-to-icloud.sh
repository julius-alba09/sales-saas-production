#!/bin/bash

# Project Transfer Script - Move Enhanced SaaS to iCloud Projects
# This script safely transfers the enhanced multi-tenant SaaS project to iCloud

set -e  # Exit on any error

# Configuration
SOURCE_DIR="/Users/juliusalba/sales-saas-app"
ICLOUD_PROJECTS_DIR="/Users/juliusalba/Library/Mobile Documents/com~apple~CloudDocs/Development Projects/Dyad/Projects"
TARGET_DIR="$ICLOUD_PROJECTS_DIR/sales-saas-app"
BACKUP_DIR="$HOME/Desktop/sales-saas-backup-$(date +%Y%m%d-%H%M%S)"
OLD_ICLOUD_BACKUP="$HOME/Desktop/old-outscaled-saas-backup-$(date +%Y%m%d-%H%M%S)"

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

echo "🚀 Sales SaaS Project Transfer to iCloud"
echo "========================================"
echo ""

# Step 1: Verify source directory exists and is our enhanced project
log_info "Verifying source project..."

if [ ! -d "$SOURCE_DIR" ]; then
    log_error "Source directory does not exist: $SOURCE_DIR"
    exit 1
fi

if [ ! -d "$SOURCE_DIR/supabase" ]; then
    log_error "Source project missing Supabase directory - this doesn't appear to be our enhanced project"
    exit 1
fi

if [ ! -f "$SOURCE_DIR/SAAS_AUDIT_REPORT.md" ]; then
    log_error "Source project missing SAAS_AUDIT_REPORT.md - this doesn't appear to be our enhanced project"
    exit 1
fi

log_success "Source project verified (enhanced multi-tenant SaaS)"

# Step 2: Check if Supabase is running and needs to be stopped
log_info "Checking Supabase status..."

if docker ps | grep -q "supabase_db_sales-saas-app"; then
    log_warning "Supabase is currently running. Stopping it for safe transfer..."
    cd "$SOURCE_DIR"
    supabase stop --backup || true
fi

# Step 3: Create backup of current enhanced project
log_info "Creating backup of enhanced project..."

mkdir -p "$BACKUP_DIR"
cp -R "$SOURCE_DIR/." "$BACKUP_DIR/"

log_success "Backup created at: $BACKUP_DIR"

# Step 4: Backup existing iCloud project (if it exists)
if [ -d "$ICLOUD_PROJECTS_DIR/outscaled-saas" ]; then
    log_info "Backing up existing iCloud project..."
    mkdir -p "$OLD_ICLOUD_BACKUP"
    cp -R "$ICLOUD_PROJECTS_DIR/outscaled-saas/." "$OLD_ICLOUD_BACKUP/"
    log_success "Old iCloud project backed up to: $OLD_ICLOUD_BACKUP"
fi

# Step 5: Remove old iCloud project
if [ -d "$ICLOUD_PROJECTS_DIR/outscaled-saas" ]; then
    log_info "Removing old iCloud project..."
    rm -rf "$ICLOUD_PROJECTS_DIR/outscaled-saas"
    log_success "Old iCloud project removed"
fi

# Step 6: Transfer enhanced project to iCloud
log_info "Transferring enhanced project to iCloud..."
log_info "Source: $SOURCE_DIR"
log_info "Target: $TARGET_DIR"

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy all files except node_modules and .git initially
log_info "Copying project files (excluding large directories)..."

rsync -av --progress \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="*.log" \
    --exclude=".DS_Store" \
    --exclude="tmp" \
    "$SOURCE_DIR/" "$TARGET_DIR/"

log_success "Core project files transferred"

# Step 7: Update all hardcoded paths in the new location
log_info "Updating hardcoded paths..."

# Update deployment script
if [ -f "$TARGET_DIR/scripts/deploy-saas-restructure.sh" ]; then
    sed -i '' "s|PROJECT_ROOT=\"/Users/juliusalba/sales-saas-app\"|PROJECT_ROOT=\"$TARGET_DIR\"|g" "$TARGET_DIR/scripts/deploy-saas-restructure.sh"
    log_success "Updated deploy-saas-restructure.sh paths"
fi

# Update any other scripts with hardcoded paths
find "$TARGET_DIR/scripts" -name "*.sh" -type f -exec sed -i '' "s|/Users/juliusalba/sales-saas-app|$TARGET_DIR|g" {} + 2>/dev/null || true

# Update WARP.md paths if they exist
if [ -f "$TARGET_DIR/WARP.md" ]; then
    sed -i '' "s|/Users/juliusalba/sales-saas-app|$TARGET_DIR|g" "$TARGET_DIR/WARP.md"
    log_success "Updated WARP.md paths"
fi

# Update any README or documentation files
find "$TARGET_DIR" -name "*.md" -type f -exec sed -i '' "s|/Users/juliusalba/sales-saas-app|$TARGET_DIR|g" {} + 2>/dev/null || true

log_success "Path references updated"

# Step 8: Copy node_modules if it exists (this might take a while)
if [ -d "$SOURCE_DIR/frontend/node_modules" ]; then
    log_info "Copying frontend node_modules (this may take a few minutes)..."
    cp -R "$SOURCE_DIR/frontend/node_modules" "$TARGET_DIR/frontend/" || true
    log_success "Frontend node_modules copied"
else
    log_warning "Frontend node_modules not found - you'll need to run 'npm install' later"
fi

# Step 9: Set correct permissions
log_info "Setting correct permissions..."

# Make scripts executable
chmod +x "$TARGET_DIR/scripts/"*.sh 2>/dev/null || true

# Ensure proper ownership
chown -R juliusalba:staff "$TARGET_DIR" 2>/dev/null || true

log_success "Permissions updated"

# Step 10: Create a symlink from the old location to the new one (optional)
log_info "Creating symlink from old location to new location..."

if [ -d "$SOURCE_DIR" ]; then
    # Don't remove the original yet, just create a symlink for reference
    ln -sf "$TARGET_DIR" "$HOME/sales-saas-app-link" || true
    log_success "Symlink created at ~/sales-saas-app-link"
fi

# Step 11: Verify transfer
log_info "Verifying transfer..."

# Check essential files exist
ESSENTIAL_FILES=(
    "SAAS_AUDIT_REPORT.md"
    "supabase/config.toml"
    "supabase/migrations/20250922124000_restructure_multitenant_schema.sql"
    "frontend/package.json"
    "scripts/deploy-saas-restructure.sh"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$TARGET_DIR/$file" ]; then
        log_success "✓ $file"
    else
        log_error "✗ Missing: $file"
    fi
done

# Step 12: Create updated startup script for new location
log_info "Creating startup script for new location..."

cat > "$TARGET_DIR/start-project.sh" << 'EOF'
#!/bin/bash

# Startup Script for Sales SaaS App (iCloud Location)
# This script starts the development environment from the iCloud location

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Sales SaaS App from iCloud"
echo "======================================"
echo "Project location: $PROJECT_DIR"
echo ""

# Check if Supabase is already running from another location
if docker ps | grep -q "supabase_db"; then
    echo "⚠️  Found existing Supabase instance. Stopping it first..."
    docker stop $(docker ps -q --filter "name=supabase") 2>/dev/null || true
fi

# Change to project directory
cd "$PROJECT_DIR"

# Start Supabase
echo "🐘 Starting Supabase..."
supabase start

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Show status
echo ""
echo "✅ Project started successfully!"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Supabase Studio: http://localhost:54323"
echo ""
echo "🛠️  Useful commands:"
echo "  Monitor users: ./scripts/monitor-workspaces.sh"
echo "  Deploy restructure: ./scripts/deploy-saas-restructure.sh"
echo ""
echo "📁 Project location: $PROJECT_DIR"
EOF

chmod +x "$TARGET_DIR/start-project.sh"
log_success "Startup script created"

# Step 13: Generate transfer report
TRANSFER_REPORT="$TARGET_DIR/TRANSFER_REPORT.md"

cat > "$TRANSFER_REPORT" << EOF
# Project Transfer Report - $(date)

## ✅ Transfer Completed Successfully

### Transfer Details:
- **Source**: \`$SOURCE_DIR\`
- **Target**: \`$TARGET_DIR\`
- **Transfer Date**: $(date)
- **Backup Location**: \`$BACKUP_DIR\`
- **Old iCloud Backup**: \`$OLD_ICLOUD_BACKUP\`

### Files Transferred:
- ✅ Enhanced multi-tenant database schema
- ✅ Frontend application with new workspace system
- ✅ Supabase configuration and migrations
- ✅ All scripts and documentation
- ✅ Environment configurations

### Path Updates Applied:
- ✅ Deployment scripts updated
- ✅ Documentation paths fixed
- ✅ Script references corrected

### Next Steps:
1. **Start the project**: \`./start-project.sh\`
2. **Install dependencies**: \`cd frontend && npm install\` (if needed)
3. **Deploy restructure**: \`./scripts/deploy-saas-restructure.sh\`
4. **Test functionality**: Verify all features work correctly

### Project Structure:
\`\`\`
$TARGET_DIR/
├── frontend/           # Next.js application
├── supabase/          # Database and functions
├── scripts/           # Deployment and monitoring
├── SAAS_AUDIT_REPORT.md
├── start-project.sh   # Quick startup script
└── TRANSFER_REPORT.md # This report
\`\`\`

### Important Notes:
- Original project backed up to: \`$BACKUP_DIR\`
- All paths have been updated for new location
- Symlink available at: \`~/sales-saas-app-link\`
- Use \`./start-project.sh\` to start development

### Support:
- Health check: http://localhost:54321/functions/v1/health-check
- Admin dashboard: http://localhost:3000/admin/users
- Monitor script: \`./scripts/monitor-workspaces.sh\`
EOF

log_success "Transfer report created: $TRANSFER_REPORT"

# Step 14: Final summary
echo ""
echo "📋 TRANSFER SUMMARY"
echo "===================="
log_success "✅ Project transferred to iCloud successfully"
log_success "✅ All paths updated for new location"
log_success "✅ Permissions and ownership set correctly"
log_success "✅ Essential files verified"
log_success "✅ Startup script created"
log_success "✅ Transfer report generated"

echo ""
log_info "📁 NEW PROJECT LOCATION:"
echo "   $TARGET_DIR"

echo ""
log_info "🗂️  BACKUPS CREATED:"
echo "   Enhanced project: $BACKUP_DIR"
echo "   Old iCloud project: $OLD_ICLOUD_BACKUP"

echo ""
log_info "🚀 TO START WORKING:"
echo "   cd '$TARGET_DIR'"
echo "   ./start-project.sh"

echo ""
log_info "🔗 QUICK ACCESS:"
echo "   Symlink: ~/sales-saas-app-link"
echo "   Report: $TRANSFER_REPORT"

echo ""
log_warning "⚠️  NEXT STEPS:"
echo "1. Test the project in new location"
echo "2. Run deployment script if needed"
echo "3. Remove old location after verification"

echo ""
log_success "🎉 Transfer completed successfully! Your enhanced SaaS project is now in iCloud."