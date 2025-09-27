# 🚀 Complete Deployment Commands for Project: wnwgxufejwjccdyevntb

## Your Specific Values:
- **Project ID**: `wnwgxufejwjccdyevntb`
- **Supabase URL**: `https://wnwgxufejwjccdyevntb.supabase.co`
- **NextAuth Secret**: `heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=`
- **GitHub Repo**: https://github.com/julius-alba09/sales-saas-production

## Step-by-Step Commands:

### 1. Link to Supabase & Deploy Database
```bash
# Link to your project
supabase link --project-ref wnwgxufejwjccdyevntb

# Deploy database schema
supabase db push

# Generate TypeScript types
supabase gen types typescript > frontend/src/types/supabase.ts
```

### 2. Get API Keys
```bash
supabase projects api-keys --project-ref wnwgxufejwjccdyevntb
```
**Save these values:**
- `anon` = Your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` = Your `SUPABASE_SERVICE_ROLE_KEY`

### 3. Deploy to Vercel
```bash
cd frontend
vercel login
vercel
```
**Note the deployment URL (something like: `https://sales-saas-production-xxx.vercel.app`)**

### 4. Set Environment Variables in Vercel

Run each command and enter the specified value:

```bash
# Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://wnwgxufejwjccdyevntb.supabase.co

# Supabase Anon Key (from step 2)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: [your anon key from step 2]

# Supabase Service Role Key (from step 2)
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Enter: [your service_role key from step 2]

# Your Vercel App URL (from step 3)
vercel env add NEXT_PUBLIC_APP_URL
# Enter: [your vercel deployment URL]

# Auth Secret (already generated)
vercel env add NEXTAUTH_SECRET
# Enter: heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=

# Disable mock mode
vercel env add NEXT_PUBLIC_MOCK_MODE
# Enter: false

# App metadata
vercel env add NEXT_PUBLIC_APP_NAME
# Enter: Sales SaaS App

vercel env add NEXT_PUBLIC_APP_VERSION
# Enter: 2.0.0
```

### 5. Deploy to Production
```bash
vercel --prod
```

## 🎉 Complete Environment Variables Summary

After getting your API keys from step 2, your complete environment will be:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wnwgxufejwjccdyevntb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from supabase projects api-keys command]
SUPABASE_SERVICE_ROLE_KEY=[from supabase projects api-keys command]
NEXT_PUBLIC_APP_URL=[your vercel deployment URL]
NEXTAUTH_SECRET=heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_APP_NAME=Sales SaaS App
NEXT_PUBLIC_APP_VERSION=2.0.0
```

## 🔗 Quick Copy Commands

```bash
# All in one - copy and paste these commands:
supabase link --project-ref wnwgxufejwjccdyevntb
supabase db push
supabase gen types typescript > frontend/src/types/supabase.ts
supabase projects api-keys --project-ref wnwgxufejwjccdyevntb
cd frontend && vercel login && vercel
```

**After deployment, your Sales SaaS app will be live with full authentication!** 🚀