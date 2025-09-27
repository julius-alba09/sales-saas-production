#!/bin/bash

# Set All Environment Variables in Vercel
# Sales SaaS App - Production Deployment

echo "🔧 Setting environment variables in Vercel..."
echo "Project: Sales SaaS App"
echo "Supabase Project ID: wnwgxufejwjccdyevntb"
echo ""

# Supabase Configuration
echo "Setting Supabase configuration..."
echo "NEXT_PUBLIC_SUPABASE_URL" | vercel env add
echo "https://wnwgxufejwjccdyevntb.supabase.co"

echo "NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add  
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2d4dWZlandqY2NkeWV2bnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTI1MjUsImV4cCI6MjA3NDAyODUyNX0.elW5gsun5LUZeHy6U3qPzRmMV_EpMn1R6LHFKWKG_BE"

echo "SUPABASE_SERVICE_ROLE_KEY" | vercel env add
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2d4dWZlandqY2NkeWV2bnRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ1MjUyNSwiZXhwIjoyMDc0MDI4NTI1fQ.6MLwYWbWZSCdg1cAJAaHnzK4rQsu2L2-s2x8PLHNSjg"

# Application Configuration
echo "Setting application configuration..."
echo "NEXT_PUBLIC_APP_URL" | vercel env add
read -p "Enter your Vercel deployment URL: " APP_URL
echo "$APP_URL"

echo "NEXTAUTH_SECRET" | vercel env add
echo "heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w="

echo "NEXT_PUBLIC_MOCK_MODE" | vercel env add
echo "false"

echo "NEXT_PUBLIC_APP_NAME" | vercel env add
echo "Sales SaaS App"

echo "NEXT_PUBLIC_APP_VERSION" | vercel env add
echo "2.0.0"

# Production Settings
echo "Setting production configuration..."
echo "NODE_ENV" | vercel env add
echo "production"

echo "LOG_LEVEL" | vercel env add
echo "info"

echo ""
echo "✅ All environment variables set!"
echo "🚀 Now run: vercel --prod"