# 🚀 Sales SaaS App - Complete Deployment Guide

## Overview
This guide will help you deploy your Sales SaaS application to production using Supabase and Vercel/Netlify.

## Prerequisites
- [Supabase Account](https://supabase.com)
- [Vercel Account](https://vercel.com) or [Netlify Account](https://netlify.com)
- [GitHub Account](https://github.com)
- Node.js 18+ and npm

## 📋 Deployment Checklist

### Phase 1: Supabase Setup

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com/dashboard
   # Click "New Project"
   # Choose your organization
   # Fill in project details:
   #   - Name: sales-saas-app
   #   - Database Password: [Generate strong password]
   #   - Region: Choose closest to your users
   ```

2. **Get Supabase Credentials**
   ```bash
   # From your Supabase Dashboard > Settings > API
   # Copy these values:
   PROJECT_URL=https://your-project-ref.supabase.co
   ANON_KEY=eyJhbGci... (public key)
   SERVICE_ROLE_KEY=eyJhbGci... (secret key)
   ```

3. **Run Database Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Push database schema
   supabase db push
   ```

### Phase 2: Environment Configuration

1. **Update Production Environment**
   ```bash
   # Create .env.production in the root directory
   cp .env.example .env.production
   ```

2. **Configure Production Variables**
   ```env
   # Application Settings
   NEXT_PUBLIC_APP_NAME="Sales SaaS App"
   NEXT_PUBLIC_APP_VERSION="2.0.0"
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ENVIRONMENT="production"
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-production-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-production-service-role-key"
   
   # Disable Mock Mode
   NEXT_PUBLIC_MOCK_MODE="false"
   
   # Security
   NEXTAUTH_SECRET="your-super-secret-nextauth-secret-32-chars-min"
   ```

### Phase 3: GitHub Setup

1. **Initialize Git Repository**
   ```bash
   # If not already done
   git init
   git add .
   git commit -m "Initial commit: Production-ready Sales SaaS app"
   ```

2. **Create GitHub Repository**
   ```bash
   # Go to https://github.com/new
   # Create repository: sales-saas-app
   # Add remote origin
   git remote add origin https://github.com/yourusername/sales-saas-app.git
   git branch -M main
   git push -u origin main
   ```

### Phase 4: Vercel Deployment

1. **Deploy to Vercel**
   ```bash
   # Option 1: Via Vercel Dashboard
   # - Go to https://vercel.com/dashboard
   # - Click "New Project"
   # - Import from GitHub: sales-saas-app
   # - Framework Preset: Next.js
   # - Root Directory: ./frontend
   ```

2. **Configure Environment Variables in Vercel**
   ```bash
   # In Vercel Dashboard > Project > Settings > Environment Variables
   # Add all variables from .env.production:
   
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_MOCK_MODE=false
   NEXTAUTH_SECRET=your-secret-key
   ```

### Phase 5: Domain Configuration

1. **Custom Domain (Optional)**
   ```bash
   # In Vercel Dashboard > Project > Settings > Domains
   # Add your custom domain: yoursaasapp.com
   # Configure DNS records as instructed by Vercel
   ```

2. **Update Supabase Auth Settings**
   ```bash
   # In Supabase Dashboard > Authentication > Settings
   # Update Site URL: https://yoursaasapp.com
   # Add Redirect URLs:
   #   - https://yoursaasapp.com/auth/callback
   #   - https://yoursaasapp.com
   ```

## 🛠️ Database Schema

The following tables will be created automatically via migrations:

### Core Tables
- `workspaces` - Multi-tenant workspace management
- `workspace_members` - User-workspace relationships with roles
- `products` - Product catalog management
- `eod_reports` - End-of-day performance reports
- `admin_function_audit` - Security audit logging

### Security Features
- **Row Level Security (RLS)** on all tables
- **Multi-tenant data isolation**
- **Role-based access control**
- **Audit logging** for all admin operations

## 🔐 Security Checklist

- [ ] **Environment Variables**: All secrets properly configured
- [ ] **HTTPS Only**: SSL/TLS certificates active
- [ ] **CSP Headers**: Content Security Policy implemented
- [ ] **Rate Limiting**: API rate limiting active
- [ ] **Input Validation**: All forms validated with Zod
- [ ] **Authentication**: Supabase auth properly configured
- [ ] **Database Security**: RLS policies active
- [ ] **CORS**: Cross-origin requests properly configured

## 🧪 Testing Your Deployment

### 1. Basic Functionality
```bash
# Test these URLs in your browser:
https://yourdomain.com                    # Landing page
https://yourdomain.com/auth/register      # User registration
https://yourdomain.com/auth/login         # User login
https://yourdomain.com/dashboard          # Dashboard (after login)
```

### 2. API Endpoints
```bash
# Test API endpoints (after authentication):
GET  /api/profile       # User profile
GET  /api/team          # Team members
GET  /api/products      # Product catalog
GET  /api/eod           # EOD reports
```

### 3. Security Headers
```bash
# Check security headers:
curl -I https://yourdomain.com
# Should include:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...
```

## 📊 Monitoring & Analytics

### 1. Setup Error Tracking
```bash
# Add Sentry for error monitoring (optional):
npm install @sentry/nextjs
# Configure in next.config.js
```

### 2. Setup Analytics
```bash
# Add Google Analytics (optional):
# Configure in .env.production:
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Run build and security checks
- Apply environment variables
- Update production site

## 🛟 Troubleshooting

### Common Issues:

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Common fixes:
   npm run build  # Test locally first
   ```

2. **Authentication Issues**
   ```bash
   # Check Supabase configuration:
   # - Site URL matches your domain
   # - Redirect URLs are correct
   # - Environment variables are set
   ```

3. **Database Connection Issues**
   ```bash
   # Verify environment variables:
   # - NEXT_PUBLIC_SUPABASE_URL
   # - NEXT_PUBLIC_SUPABASE_ANON_KEY
   # - Check Supabase project status
   ```

4. **API Rate Limiting**
   ```bash
   # If hitting rate limits:
   # - Check middleware.ts configuration
   # - Adjust rate limits if needed
   # - Monitor usage patterns
   ```

## 📚 Post-Deployment Steps

1. **Create Admin User**
   ```bash
   # Register first user via /auth/register
   # This user becomes workspace owner automatically
   ```

2. **Configure Workspace**
   ```bash
   # Login and set up:
   # - Workspace settings
   # - Team member roles
   # - Product catalog
   ```

3. **Test All Features**
   ```bash
   # Test complete user journey:
   # - Registration → Login → Dashboard
   # - Team management → Product management
   # - EOD report submission → Analytics
   ```

## 🎯 Success Metrics

After deployment, your app should achieve:
- **Lighthouse Score**: 90+ performance
- **Security Headers**: All green on securityheaders.com
- **Load Time**: <2 seconds initial load
- **API Response Time**: <200ms average
- **Error Rate**: <0.1%

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel and Supabase logs
3. Verify all environment variables
4. Test locally with production config

---

**Your Sales SaaS application is now ready for production! 🎉**