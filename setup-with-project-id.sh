#!/bin/bash

# Sales SaaS Setup with Project ID: wnwgxufejwjccdyevntb
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Setting up Sales SaaS with Project ID: wnwgxufejwjccdyevntb${NC}"
echo ""

PROJECT_REF="wnwgxufejwjccdyevntb"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

echo -e "${BLUE}Step 1: Link to your Supabase project${NC}"
echo "Run: supabase link --project-ref $PROJECT_REF"
echo ""

echo -e "${BLUE}Step 2: Deploy database schema${NC}"
echo "Run: supabase db push"
echo ""

echo -e "${BLUE}Step 3: Generate TypeScript types${NC}"
echo "Run: supabase gen types typescript > frontend/src/types/supabase.ts"
echo ""

echo -e "${BLUE}Step 4: Get your API keys${NC}"
echo "Run: supabase projects api-keys --project-ref $PROJECT_REF"
echo ""
echo "This will give you:"
echo "- anon key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)"
echo "- service_role key (for SUPABASE_SERVICE_ROLE_KEY)"
echo ""

echo -e "${BLUE}Step 5: Generate auth secret${NC}"
echo "Run: openssl rand -base64 32"
echo "Use output for NEXTAUTH_SECRET"
echo ""

echo -e "${BLUE}Step 6: Deploy to Vercel${NC}"
echo "cd frontend"
echo "vercel login"
echo "vercel"
echo ""

echo -e "${BLUE}Step 7: Set environment variables in Vercel${NC}"
echo "vercel env add NEXT_PUBLIC_SUPABASE_URL"
echo "Enter: $SUPABASE_URL"
echo ""
echo "vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "Enter: [anon key from step 4]"
echo ""
echo "vercel env add SUPABASE_SERVICE_ROLE_KEY"
echo "Enter: [service_role key from step 4]"
echo ""
echo "vercel env add NEXT_PUBLIC_APP_URL"
echo "Enter: [your Vercel URL from step 6]"
echo ""
echo "vercel env add NEXTAUTH_SECRET"
echo "Enter: [secret from step 5]"
echo ""
echo "vercel env add NEXT_PUBLIC_MOCK_MODE"
echo "Enter: false"
echo ""

echo -e "${BLUE}Step 8: Deploy to production${NC}"
echo "vercel --prod"
echo ""

echo -e "${GREEN}✅ Your Supabase URL: $SUPABASE_URL${NC}"
echo -e "${GREEN}✅ GitHub Repository: https://github.com/julius-alba09/sales-saas-production${NC}"
echo ""
echo -e "${YELLOW}💡 After completing these steps, your app will be live!${NC}"