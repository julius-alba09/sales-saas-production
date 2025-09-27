# 🔑 Get Missing Environment Variables - Step by Step

## Missing Variables You Need:
1. ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. ❌ `SUPABASE_SERVICE_ROLE_KEY`  
3. ❌ `NEXT_PUBLIC_APP_URL`

---

## 🎯 Method 1: Get Supabase Keys via CLI (Recommended)

### Step 1: Login to Supabase
```bash
supabase login
```
*This opens your browser - login with your account*

### Step 2: Get API Keys
```bash
supabase projects api-keys --project-ref wnwgxufejwjccdyevntb
```

**Expected Output:**
```
anon: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy These Values:**
- `anon` = Your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` = Your `SUPABASE_SERVICE_ROLE_KEY`

---

## 🌐 Method 2: Get Supabase Keys via Dashboard (Alternative)

### Step 1: Go to Supabase Dashboard
Visit: https://supabase.com/dashboard/project/wnwgxufejwjccdyevntb/settings/api

### Step 2: Copy Keys
- **Project API keys** section:
  - Copy `anon public` → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Copy `service_role secret` → This is `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 Get Vercel App URL

### Step 1: Login to Vercel
```bash
cd frontend
vercel login
```
*This opens your browser - login with your account*

### Step 2: Deploy to Vercel
```bash
vercel
```

**Follow the prompts:**
- Set up and deploy? **Y**
- Which scope? **[Select your account]**
- Link to existing project? **N**
- What's your project's name? **sales-saas-production**
- In which directory is your code located? **./frontend** (or just press Enter)

### Step 3: Copy the App URL
After deployment, Vercel shows:
```
🔗 Preview: https://sales-saas-production-xxx.vercel.app
✅ Production: https://sales-saas-production-xxx.vercel.app
```

**Copy the Production URL** → This is your `NEXT_PUBLIC_APP_URL`

---

## ✅ Complete Variable Summary

Once you have all values, your environment variables will be:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wnwgxufejwjccdyevntb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[from Supabase dashboard/CLI]
SUPABASE_SERVICE_ROLE_KEY=[from Supabase dashboard/CLI]
NEXT_PUBLIC_APP_URL=[from Vercel deployment]
NEXTAUTH_SECRET=heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_APP_NAME=Sales SaaS App
NEXT_PUBLIC_APP_VERSION=2.0.0
```

---

## 🔧 Set Environment Variables in Vercel

After getting all values above, run these commands:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://wnwgxufejwjccdyevntb.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: [your anon key]

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Enter: [your service_role key]

vercel env add NEXT_PUBLIC_APP_URL
# Enter: [your Vercel URL]

vercel env add NEXTAUTH_SECRET
# Enter: heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=

vercel env add NEXT_PUBLIC_MOCK_MODE
# Enter: false

vercel env add NEXT_PUBLIC_APP_NAME
# Enter: Sales SaaS App

vercel env add NEXT_PUBLIC_APP_VERSION
# Enter: 2.0.0
```

## 🎉 Final Step: Deploy to Production

```bash
vercel --prod
```

**Your app will be live!** 🚀

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/wnwgxufejwjccdyevntb
- **GitHub Repository**: https://github.com/julius-alba09/sales-saas-production
- **Project ID**: wnwgxufejwjccdyevntb