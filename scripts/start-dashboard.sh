#!/bin/bash

echo "🚀 Starting Sales SaaS App Development"
echo "======================================"

# Check if Supabase is running
if ! docker ps | grep -q "supabase_db_sales-saas-app"; then
    echo "⚠️  Starting Supabase first..."
    cd /Users/juliusalba/sales-saas-app
    supabase start
    echo "✅ Supabase is running"
fi

echo "📊 Current User Base:"
cd /Users/juliusalba/sales-saas-app && ./scripts/monitor-users.sh

echo ""
echo "🌐 Starting Frontend Development Server..."
echo "   Frontend: http://localhost:3000"
echo "   Admin Dashboard: http://localhost:3000/admin/users"
echo "   Supabase Studio: http://localhost:54323"
echo ""
echo "📝 Login with one of your manager accounts:"
echo "   - julius@notionalize.com"
echo "   - newuser@example.com"
echo ""

# Navigate to frontend directory and start dev server
cd /Users/juliusalba/sales-saas-app/frontend

# Start the development server
npm run dev