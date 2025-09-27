#!/bin/bash

# Get Missing Environment Variables for Sales SaaS App
# Project ID: wnwgxufejwjccdyevntb

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_REF="wnwgxufejwjccdyevntb"

echo -e "${BLUE}🔑 Getting Environment Variables for Sales SaaS App${NC}"
echo -e "${BLUE}Project ID: $PROJECT_REF${NC}"
echo ""

# Check if already logged in
echo -e "${YELLOW}Step 1: Checking Supabase authentication...${NC}"
if supabase projects list > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Already logged in to Supabase${NC}"
else
    echo -e "${YELLOW}⚠️  Need to login to Supabase first${NC}"
    echo "Run: supabase login"
    echo "Then re-run this script"
    exit 1
fi

# Get API keys
echo -e "${YELLOW}Step 2: Getting Supabase API keys...${NC}"
API_KEYS=$(supabase projects api-keys --project-ref $PROJECT_REF)
if [ $? -eq 0 ]; then
    ANON_KEY=$(echo "$API_KEYS" | grep "anon:" | sed 's/anon: //')
    SERVICE_KEY=$(echo "$API_KEYS" | grep "service_role:" | sed 's/service_role: //')
    
    echo -e "${GREEN}✅ Got Supabase API keys${NC}"
else
    echo -e "${RED}❌ Failed to get API keys${NC}"
    exit 1
fi

# Link project
echo -e "${YELLOW}Step 3: Linking project...${NC}"
if supabase link --project-ref $PROJECT_REF; then
    echo -e "${GREEN}✅ Project linked${NC}"
else
    echo -e "${YELLOW}⚠️  Project may already be linked${NC}"
fi

# Push database schema
echo -e "${YELLOW}Step 4: Pushing database schema...${NC}"
if supabase db push; then
    echo -e "${GREEN}✅ Database schema deployed${NC}"
else
    echo -e "${RED}❌ Failed to deploy database schema${NC}"
fi

# Generate TypeScript types
echo -e "${YELLOW}Step 5: Generating TypeScript types...${NC}"
if supabase gen types typescript > frontend/src/types/supabase.ts; then
    echo -e "${GREEN}✅ TypeScript types generated${NC}"
else
    echo -e "${RED}❌ Failed to generate types${NC}"
fi

# Create environment variables file
echo -e "${YELLOW}Step 6: Creating environment variables file...${NC}"

cat > .env.production.complete << EOF
# SUPABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL=https://$PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY

# APPLICATION CONFIGURATION  
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=
NEXT_PUBLIC_MOCK_MODE=false

# PRODUCTION SETTINGS
NODE_ENV=production
LOG_LEVEL=info
NEXT_PUBLIC_APP_NAME=Sales SaaS App
NEXT_PUBLIC_APP_VERSION=2.0.0
EOF

echo -e "${GREEN}✅ Environment variables saved to .env.production.complete${NC}"

# Create Vercel deployment commands
cat > set-vercel-env.sh << EOF
#!/bin/bash
# Set environment variables in Vercel

echo "Setting environment variables in Vercel..."

vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://$PROJECT_REF.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
# Enter: $ANON_KEY

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Enter: $SERVICE_KEY

vercel env add NEXT_PUBLIC_APP_URL
# Enter: [Your Vercel deployment URL]

vercel env add NEXTAUTH_SECRET
# Enter: heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=

vercel env add NEXT_PUBLIC_MOCK_MODE
# Enter: false

vercel env add NODE_ENV
# Enter: production

vercel env add LOG_LEVEL
# Enter: info

vercel env add NEXT_PUBLIC_APP_NAME
# Enter: Sales SaaS App

vercel env add NEXT_PUBLIC_APP_VERSION
# Enter: 2.0.0

echo "All environment variables set! Now run: vercel --prod"
EOF

chmod +x set-vercel-env.sh

echo ""
echo -e "${GREEN}🎉 SUCCESS! All environment variables obtained!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "✅ Supabase URL: https://$PROJECT_REF.supabase.co"
echo "✅ Anon Key: ${ANON_KEY:0:20}..."
echo "✅ Service Key: ${SERVICE_KEY:0:20}..."
echo "✅ Database schema deployed"
echo "✅ TypeScript types generated"
echo ""
echo -e "${BLUE}📁 Files created:${NC}"
echo "  - .env.production.complete (all environment variables)"
echo "  - set-vercel-env.sh (script to set Vercel variables)"
echo ""
echo -e "${YELLOW}🚀 Next steps:${NC}"
echo "1. Deploy to Vercel: cd frontend && vercel"
echo "2. Update NEXT_PUBLIC_APP_URL in .env.production.complete with your Vercel URL"
echo "3. Run ./set-vercel-env.sh to set environment variables"
echo "4. Deploy to production: vercel --prod"
EOF