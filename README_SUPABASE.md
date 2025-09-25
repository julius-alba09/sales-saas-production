# Supabase Integration Guide

This document provides a comprehensive overview of the Supabase integration for the Sales SaaS application.

## 🚀 Quick Start

To get your Sales SaaS application up and running with Supabase:

```bash
# Run the setup script
./setup.sh

# Start the frontend (in a new terminal)
cd frontend && npm run dev
```

The setup script will:
- Start all Supabase services
- Apply database migrations
- Create storage buckets
- Seed sample data
- Generate TypeScript types
- Configure environment variables

## 📊 Database Schema Overview

### Core Tables

1. **organizations** - Multi-tenant structure for companies
2. **user_profiles** - Extended user data linked to auth.users
3. **products** - Company products/offers with pricing
4. **daily_metrics** - Daily KPI tracking for sales reps and setters
5. **product_sales** - Individual product performance tracking
6. **questions** - Customizable EOD/EOW/EOM report questions
7. **reports** - Report submissions (EOD/EOW/EOM)
8. **report_responses** - Answers to specific questions
9. **goals** - Individual and team performance targets
10. **notification_settings** - User notification preferences

### Key Features

- **Multi-tenant RLS**: Complete data isolation between organizations
- **Role-based access**: Manager, Sales Rep, and Setter roles
- **Automatic triggers**: Profile creation, timestamp updates
- **Storage integration**: Avatar and logo uploads with RLS
- **Real-time subscriptions**: Live dashboard updates

## 🔧 API Routes

### Profile Management
- `GET /api/profile` - Get user profile and context
- `PUT /api/profile` - Update user profile
- `POST /api/upload/avatar` - Upload user avatar
- `DELETE /api/upload/avatar` - Delete user avatar

### Organization Management
- `GET /api/organization` - Get organization and team data
- `PUT /api/organization` - Update organization settings

## 🎣 React Hooks

### useProfile()
Manages user profile data and operations:

```typescript
const {
  profile,
  context,
  user,
  isLoading,
  isManager,
  fullName,
  updateProfile,
  uploadAvatar,
  deleteAvatar
} = useProfile()
```

### useOrganization()
Handles organization and team management:

```typescript
const {
  organization,
  teamMembers,
  canManageTeam,
  updateOrganization
} = useOrganization()
```

### Real-time Subscriptions
Live data updates for dashboards:

```typescript
// Individual subscriptions
useMetricsSubscription()
useTeamSubscription()
useReportsSubscription()

// Or subscribe to all dashboard data
useDashboardSubscriptions()
```

## 🗃️ Database Functions

### Core Functions
- `handle_new_user()` - Automatic user profile creation on signup
- `get_user_organization_context()` - User context and permissions
- `get_team_metrics_summary()` - Aggregated team performance data
- `update_user_profile()` - Safe profile updates with validation

### Usage Examples

```sql
-- Get current user's organization context
SELECT * FROM get_user_organization_context();

-- Get team metrics for the last 30 days
SELECT * FROM get_team_metrics_summary();

-- Update user profile
SELECT update_user_profile('{"first_name": "John", "last_name": "Doe"}');
```

## 📁 Storage Buckets

### Avatars Bucket
- **Path**: `avatars/{user_id}/{timestamp}.{ext}`
- **Policies**: Users can manage their own avatars
- **Max size**: 5MB
- **Allowed types**: PNG, JPEG, WebP, GIF

### Organization Logos Bucket
- **Path**: `organization-logos/{org_id}/{timestamp}.{ext}`
- **Policies**: Only managers can upload/manage logos
- **Max size**: 5MB
- **Allowed types**: PNG, JPEG, WebP, GIF, SVG

## 🔐 Row Level Security (RLS)

All tables use RLS for data isolation:

- **Organization-level isolation**: Users can only access data from their organization
- **Role-based permissions**: Managers have broader access than regular users
- **Self-service**: Users can always manage their own data
- **Secure by default**: No data leakage between organizations

## 📧 Email Templates

Custom email templates are configured for:
- **User invitations**: `supabase/templates/invite.html`
- **Email confirmation**: `supabase/templates/confirmation.html`

Templates include:
- Modern, responsive design
- Company branding
- Clear call-to-action buttons
- Professional styling

## 🔄 Real-time Features

Real-time subscriptions are set up for:
- **Metrics updates**: Live dashboard updates when team members submit data
- **Team changes**: Instant updates when users join/leave
- **Report submissions**: Real-time notification of new reports
- **Goal progress**: Live goal tracking updates

## 📈 Sample Data

The seed file includes:
- 2 sample organizations (Alpha Sales Agency, Beta Marketing Co)
- Sample products for each organization
- Default EOD/EOW/EOM questions
- Customizable report templates

## 🛠️ Development Workflow

### Local Development
```bash
# Start Supabase services
supabase start

# Apply new migrations
supabase db reset

# Generate types after schema changes
supabase gen types typescript --local > frontend/src/types/supabase.ts

# Start frontend
cd frontend && npm run dev
```

### Database Changes
```bash
# Create a new migration
supabase migration new add_new_feature

# Edit the migration file
# Apply changes
supabase db reset

# Generate new types
supabase gen types typescript --local > frontend/src/types/supabase.ts
```

### Adding New Tables
1. Create migration with table definition
2. Add RLS policies for data security
3. Update TypeScript types
4. Create API routes if needed
5. Add React hooks for data management
6. Update real-time subscriptions

## 📋 Environment Variables

### Local Development (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production
Replace with your production Supabase project URL and keys.

## 🚀 Deployment

### Supabase Project Setup
1. Create a new Supabase project
2. Run migrations: `supabase db push`
3. Update environment variables
4. Configure email templates in Supabase dashboard

### Storage Configuration
Storage buckets are created automatically via migrations, but you can also set them up via the Supabase dashboard.

## 🔍 Monitoring and Logs

### Supabase Logs
```bash
# View all logs
supabase logs

# View specific service logs
supabase logs --db
supabase logs --auth
supabase logs --realtime
```

### Dashboard URLs (Local Development)
- **Supabase Studio**: http://localhost:54323
- **Email Testing (Inbucket)**: http://localhost:54324
- **Database Direct**: postgresql://postgres:postgres@localhost:54322/postgres

## 🆘 Troubleshooting

### Common Issues

**Migration Errors**
```bash
# Reset and reapply all migrations
supabase db reset

# Check migration status
supabase migration list
```

**Type Errors**
```bash
# Regenerate types after schema changes
supabase gen types typescript --local > frontend/src/types/supabase.ts
```

**Real-time Not Working**
- Check that realtime is enabled in config.toml
- Verify RLS policies allow the user to access the data
- Ensure proper table subscription filters

**Storage Upload Issues**
- Verify file size limits (5MB default)
- Check file type restrictions
- Ensure RLS policies allow upload for the user

### Support
- Check the Supabase documentation: https://supabase.com/docs
- Review the project's database schema in Supabase Studio
- Monitor logs for detailed error messages

## 🎯 Next Steps

With this Supabase integration, you now have:
- ✅ Complete multi-tenant database schema
- ✅ Secure authentication and authorization
- ✅ File storage with proper access controls
- ✅ Real-time data synchronization
- ✅ Production-ready API routes
- ✅ Type-safe database operations
- ✅ Professional email templates

Your Sales SaaS application is now ready for:
- User registration and management
- Sales metrics tracking
- Team collaboration
- Real-time dashboards
- Secure file uploads
- Customizable reporting