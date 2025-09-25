#!/bin/bash

# Sales SaaS Production Deployment Script
# This script automates the entire deployment process

set -e  # Exit on any error

echo "🚀 Starting Sales SaaS Production Deployment..."
echo "GitHub Repository: https://github.com/julius-alba09/sales-saas-production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Verify GitHub deployment
print_step "Verifying GitHub repository..."
if git remote -v | grep -q "julius-alba09/sales-saas-production"; then
    print_success "GitHub repository is set up correctly"
    echo "   Repository: https://github.com/julius-alba09/sales-saas-production"
else
    print_error "GitHub repository not found. Please run: gh repo create sales-saas-production --public --source=. --remote=origin --push"
    exit 1
fi

# Step 2: Supabase Setup Instructions
print_step "Supabase Setup Required..."
echo ""
echo "Please run these commands manually (requires interactive login):"
echo ""
echo "1. Login to Supabase:"
echo "   supabase login"
echo ""
echo "2. Create new project:"
echo "   supabase projects create sales-saas-production"
echo ""
echo "3. Link to project (use project-ref from step 2):"
echo "   supabase link --project-ref YOUR_PROJECT_REF"
echo ""
echo "4. Push database schema:"
echo "   supabase db push"
echo ""
echo "5. Generate TypeScript types:"
echo "   supabase gen types typescript > frontend/src/types/supabase.ts"
echo ""
echo "6. Get your credentials:"
echo "   supabase projects api-keys --project-ref YOUR_PROJECT_REF"
echo ""

# Step 3: Prepare Vercel deployment
print_step "Preparing Vercel deployment..."
cd frontend

# Create vercel.json if it doesn't exist in frontend
if [ ! -f "vercel.json" ]; then
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "sales-saas-production",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "functions": {
    "**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
    print_success "Created frontend/vercel.json"
fi

cd ..

print_step "Vercel Deployment Instructions..."
echo ""
echo "After completing Supabase setup, deploy to Vercel:"
echo ""
echo "1. Navigate to frontend directory:"
echo "   cd frontend"
echo ""
echo "2. Login to Vercel (if not already logged in):"
echo "   vercel login"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel"
echo ""
echo "4. Set environment variables:"
echo "   vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   vercel env add SUPABASE_SERVICE_ROLE_KEY"
echo "   vercel env add NEXT_PUBLIC_MOCK_MODE"
echo "   vercel env add NEXTAUTH_SECRET"
echo "   vercel env add NEXT_PUBLIC_APP_URL"
echo ""
echo "5. Deploy to production:"
echo "   vercel --prod"
echo ""

# Step 4: Generate environment variable template
print_step "Creating environment variable templates..."

cat > .env.production.template << 'EOF'
# Copy these values after creating your Supabase project
# Get these from: supabase projects api-keys --project-ref YOUR_PROJECT_REF

# Supabase Configuration (REPLACE WITH YOUR VALUES)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NEXT_PUBLIC_APP_NAME="Sales SaaS App"
NEXT_PUBLIC_APP_VERSION="2.0.0"
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Security (GENERATE A RANDOM 32+ CHARACTER STRING)
NEXTAUTH_SECRET=your_super_secret_32_character_string_here

# Mock Mode (MUST be false for production)
NEXT_PUBLIC_MOCK_MODE=false
EOF

print_success "Created .env.production.template"

# Step 5: Create quick setup commands file
cat > quick-setup-commands.sh << 'EOF'
#!/bin/bash
# Quick setup commands after manual Supabase login

echo "Run these commands after 'supabase login':"
echo ""
echo "# Create and link Supabase project"
echo "supabase projects create sales-saas-production"
echo "read -p 'Enter your project-ref from above: ' PROJECT_REF"
echo "supabase link --project-ref \$PROJECT_REF"
echo ""
echo "# Deploy database and generate types"
echo "supabase db push"
echo "supabase gen types typescript > frontend/src/types/supabase.ts"
echo ""
echo "# Get API keys"
echo "supabase projects api-keys --project-ref \$PROJECT_REF"
echo ""
echo "# Deploy to Vercel"
echo "cd frontend"
echo "vercel"
echo "# Follow prompts, then set environment variables with the keys from above"
EOF

chmod +x quick-setup-commands.sh
print_success "Created quick-setup-commands.sh"

echo ""
print_success "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Run Supabase setup manually (requires browser login)"
echo "2. Use the generated templates for environment variables" 
echo "3. Deploy to Vercel with the prepared configuration"
echo ""
echo "📁 Files created:"
echo "   - .env.production.template (environment variables template)"
echo "   - frontend/vercel.json (Vercel configuration)"
echo "   - quick-setup-commands.sh (helper script)"
echo ""
echo "🔗 Your GitHub repository: https://github.com/julius-alba09/sales-saas-production"
echo ""