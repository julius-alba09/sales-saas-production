#!/bin/bash

# Sales SaaS Development Setup Script
echo "🚀 Starting Sales SaaS Development Environment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Start Supabase local development
echo "🔧 Starting Supabase local stack..."
supabase start

# Get the local Supabase configuration
echo "📝 Getting local Supabase configuration..."
supabase status

echo ""
echo "✅ Supabase is now running!"
echo "📊 Supabase Studio: http://localhost:54323"
echo "🔗 API URL: http://127.0.0.1:54321"
echo "🗄️  Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
echo ""

# Generate TypeScript types
echo "🔧 Generating TypeScript types..."
supabase gen types typescript --local > frontend/src/types/supabase.ts

echo "📦 Installing frontend dependencies..."
cd frontend && npm install

echo ""
echo "🎉 Setup complete! You can now:"
echo "   1. Run 'npm run dev' in the frontend directory"
echo "   2. Visit http://localhost:3000 to see your application"
echo "   3. Visit http://localhost:54323 to manage your database"
echo ""
echo "🔥 Happy coding!"