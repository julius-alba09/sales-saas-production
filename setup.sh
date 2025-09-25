#!/bin/bash

# Sales SaaS Setup Script
# This script sets up the Supabase database and initializes the project

set -e  # Exit on any error

echo "🚀 Setting up Sales SaaS Application..."
echo "======================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ supabase/config.toml not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Supabase CLI found"

# Start Supabase (this will start all services)
echo "🔄 Starting Supabase services..."
supabase start

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 5

# Reset the database to ensure clean state
echo "🗄️  Resetting database with fresh migrations..."
supabase db reset

# Generate fresh types
echo "🔧 Generating TypeScript types..."
cd frontend
supabase gen types typescript --local > src/types/supabase.ts
cd ..

# Check if .env.local exists in frontend
if [ ! -f "frontend/.env.local" ]; then
    echo "⚙️  Creating environment file..."
    cat > frontend/.env.local << EOF
# Supabase Configuration (Local Development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=\$(supabase status --output env | grep SUPABASE_ANON_KEY | cut -d'=' -f2)
SUPABASE_SERVICE_ROLE_KEY=\$(supabase status --output env | grep SUPABASE_SERVICE_ROLE_KEY | cut -d'=' -f2)

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    
    # Get the actual keys and update the file
    ANON_KEY=$(supabase status --output env | grep SUPABASE_ANON_KEY | cut -d'=' -f2)
    SERVICE_KEY=$(supabase status --output env | grep SUPABASE_SERVICE_ROLE_KEY | cut -d'=' -f2)
    
    cat > frontend/.env.local << EOF
# Supabase Configuration (Local Development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    
    echo "✅ Environment file created"
else
    echo "✅ Environment file exists"
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo "=============================="
echo ""
echo "📋 What was set up:"
echo "  ✅ Supabase services started (Database, Auth, Storage, etc.)"
echo "  ✅ Database migrations applied"
echo "  ✅ Storage buckets created for avatars and logos"
echo "  ✅ Row Level Security (RLS) policies configured"
echo "  ✅ Sample data seeded"
echo "  ✅ TypeScript types generated"
echo "  ✅ Environment variables configured"
echo ""
echo "🌐 Access URLs:"
echo "  📊 Supabase Studio: http://localhost:54323"
echo "  📧 Inbucket (Email Testing): http://localhost:54324"
echo "  🗄️  Database: postgresql://postgres:postgres@localhost:54322/postgres"
echo ""
echo "🚀 Next steps:"
echo "  1. Start the frontend development server:"
echo "     cd frontend && npm run dev"
echo "  2. Open your browser to: http://localhost:3000"
echo "  3. Create your first user account through the signup flow"
echo ""
echo "📚 Additional commands:"
echo "  • View Supabase logs: supabase logs"
echo "  • Stop Supabase: supabase stop"
echo "  • Reset database: supabase db reset"
echo "  • Generate new types: supabase gen types typescript --local"
echo ""
echo "💡 The database includes sample organizations and products."
echo "   When you create your first account, it will automatically"
echo "   create a new organization for you, or you can join an existing one."
echo ""