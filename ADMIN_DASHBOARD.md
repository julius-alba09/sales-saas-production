# Admin Dashboard Setup Guide

## 🚀 Quick Start

### Option 1: Automated Startup Script
```bash
cd /Users/juliusalba/sales-saas-app
./scripts/start-dashboard.sh
```

### Option 2: Manual Startup
```bash
# 1. Start Supabase (if not running)
cd /Users/juliusalba/sales-saas-app
supabase start

# 2. Check current user base
./scripts/monitor-users.sh

# 3. Start frontend
cd frontend
npm run dev
```

## 📊 Accessing the Dashboard

1. **Start the development server** (using either option above)
2. **Open your browser** and go to: `http://localhost:3000`
3. **Sign in** with one of your manager accounts:
   - `julius@notionalize.com` (password: whatever you set)
   - `newuser@example.com` (password: `testpassword123`)
   - Any other manager account you created

4. **Navigate to Admin Dashboard**:
   - Click on **"Admin"** in the navigation menu
   - Select **"User Monitor"**
   - Or go directly to: `http://localhost:3000/admin/users`

## 🔍 What You'll See

### User Statistics Card
- Total Users: 4
- Managers: 4 
- Sales Reps: 0
- Setters: 0
- Active Users: 4

### Organization Statistics Card
- Total Organizations: 6
- Active Organizations: 6
- Inactive Organizations: 0

### Activity Status Card
- Active Users: 4
- Inactive Users: 0

### Users Table
Complete list of all users with:
- Name and email
- Role (Manager/Sales Rep/Setter)
- Organization
- Status (Active/Inactive)
- Join date
- Last login

## 🛠️ Features

- **Real-time Data**: Click "Refresh Data" to update statistics
- **Role-based Access**: Only managers can access admin area
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Toggle in navigation

## 📍 Important URLs

- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/users
- **Supabase Studio**: http://localhost:54323
- **Registration**: http://localhost:3000/auth/register

## 🔐 Security Notes

- Admin dashboard is protected - only users with `manager` role can access
- Database functions use `SECURITY DEFINER` for proper permissions
- All queries are protected by Supabase RLS (Row Level Security)

## 🐛 Troubleshooting

### If you get authentication errors:
1. Make sure you're logged in as a manager
2. Clear browser cache and cookies
3. Check browser console for specific errors

### If data doesn't load:
1. Verify Supabase is running: `supabase status`
2. Check database functions: `./scripts/monitor-users.sh`
3. Look at browser network tab for failed requests

### If navigation doesn't show Admin menu:
1. Make sure your user has `role = 'manager'` in the database
2. Refresh the page after logging in
3. Check browser console for auth errors

## 📈 Monitoring Your SaaS Growth

Use the dashboard to track:
- New user registrations
- Organization growth
- User role distribution
- Active vs inactive users

The dashboard updates in real-time when you click "Refresh Data"!