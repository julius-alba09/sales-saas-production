# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture Overview

This is a multi-tenant Sales SaaS application with three distinct dashboard types:
- **Agency Dashboard**: Complete team management for sales agency owners/managers
- **Sales Rep Dashboard**: Individual performance tracking and EOD reporting
- **Appointment Setter Dashboard**: Specialized KPI tracking for call metrics and booking rates

### Tech Stack
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time + Edge Functions)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with role-based access control
- **Real-time**: Supabase real-time subscriptions

### Key Dependencies
- **Frontend**: @tanstack/react-query, @headlessui/react, @heroicons/react, @supabase/supabase-js, recharts, zod
- **Backend**: Supabase client libraries, @supabase/auth-helpers-nextjs

## Project Structure

```
├── supabase/             # Supabase configuration
│   ├── migrations/       # Database migrations
│   ├── functions/        # Edge Functions
│   └── config.toml       # Local dev config
├── frontend/             # Next.js app (primary application)
│   └── src/
│       ├── app/          # App router pages
│       ├── components/   # React components
│       ├── lib/          # Supabase client and utilities
│       └── types/        # TypeScript types
├── docs/                 # Project documentation
└── scripts/              # Deployment and utility scripts
```

## Development Commands

### Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Start Supabase locally (recommended)
supabase start

# Install and run frontend
cd frontend && npm install && npm run dev
```

### Supabase Development
```bash
# Start local Supabase stack
supabase start

# Reset local database
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > frontend/src/types/supabase.ts

# Database migrations
supabase migration new <migration_name>
supabase db push

# Deploy Edge Functions
supabase functions deploy <function_name>

# View logs
supabase logs
```

### Frontend Development  
```bash
cd frontend

# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

### Database Management
```bash
# Connect to local Supabase DB
psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'

# Access Supabase Studio (local)
# http://localhost:54323

# Access Supabase Studio (production)
# https://supabase.com/dashboard/project/<project-ref>
```

## Application Architecture

### Multi-Dashboard System
The application serves three distinct user roles with different permissions and data access patterns:

1. **Manager/Agency Dashboard**: Full CRUD access, team analytics, product management
2. **Sales Rep Dashboard**: Personal metrics submission, EOD/EOW/EOM reporting  
3. **Appointment Setter Dashboard**: Call metrics, booking rates, specialized KPIs

### Core Data Models
- **Organizations**: Multi-tenant structure
- **Users**: Role-based (manager, sales_rep, setter)
- **Products/Offers**: Customizable with pricing
- **Daily Metrics**: Sales rep and setter KPIs
- **Reports**: EOD/EOW/EOM with customizable questions
- **Goals**: Individual and team targets

### API Structure
Supabase auto-generated REST API and real-time subscriptions:
- **Auth**: Supabase Auth (built-in authentication)
- **Tables**: Auto-generated REST endpoints for all tables
- **RPC**: Custom database functions for complex queries
- **Real-time**: WebSocket subscriptions for live data
- **Edge Functions**: Custom serverless functions for business logic
- **Storage**: File uploads and management

### Key Metrics Tracked

**Sales Reps**: Calls, offers, closes, deposits, product-specific revenue
**Appointment Setters**: Outbound calls, messaging time, booking rates, set quality

All metrics support calculated fields like show rates, close rates, and percentage collected.

## Environment Configuration

### Required Environment Variables
```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Local Development (auto-configured)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon-key
SUPABASE_SERVICE_ROLE_KEY=local-service-role-key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Strategy

- **Database**: Supabase local testing with `supabase test`
- **Frontend**: Next.js testing with Jest and React Testing Library
- **Edge Functions**: Deno testing for serverless functions
- Run `npm test` in frontend directory
- Use `supabase test` for database function testing

## Development URLs

- **Frontend**: http://localhost:3000
- **Supabase API**: http://127.0.0.1:54321
- **Supabase Studio**: http://localhost:54323
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Auth**: http://127.0.0.1:54321/auth/v1
- **Storage**: http://127.0.0.1:54321/storage/v1

## Supabase Integration

The application uses Supabase's built-in features:
- **Authentication**: Email/password, OAuth providers
- **Database**: PostgreSQL with Row Level Security
- **Real-time**: WebSocket subscriptions for live updates
- **Storage**: File uploads for user avatars and documents
- **Edge Functions**: Custom business logic and background jobs
