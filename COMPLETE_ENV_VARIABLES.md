# 🔍 COMPLETE Environment Variables List

## ✅ **Variables You Already Have:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://wnwgxufejwjccdyevntb.supabase.co
NEXTAUTH_SECRET=heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=
NEXT_PUBLIC_MOCK_MODE=false
```

## ❌ **REQUIRED - Still Missing:**
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=GET_FROM_SUPABASE
SUPABASE_SERVICE_ROLE_KEY=GET_FROM_SUPABASE
NEXT_PUBLIC_APP_URL=GET_FROM_VERCEL_DEPLOYMENT
```

## 🔧 **OPTIONAL - But Recommended:**
```env
NODE_ENV=production
LOG_LEVEL=info
SENTRY_DSN=[optional - for error tracking]
NEXT_PUBLIC_APP_NAME=Sales SaaS App
NEXT_PUBLIC_APP_VERSION=2.0.0
```

---

## 🎯 **Step-by-Step Guide to Get ALL Missing Variables**

### **Step 1: Get Supabase Keys**
**Method A - CLI (Fastest):**
```bash
supabase login
supabase projects api-keys --project-ref wnwgxufejwjccdyevntb
```

**Method B - Dashboard:**
1. Go to: https://supabase.com/dashboard/project/wnwgxufejwjccdyevntb/settings/api
2. Copy:
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### **Step 2: Deploy to Vercel & Get URL**
```bash
cd frontend
vercel login
vercel
```
**Copy the deployment URL** → `NEXT_PUBLIC_APP_URL`

### **Step 3: Set ALL Variables in Vercel**
```bash
# REQUIRED Variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://wnwgxufejwjccdyevntb.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: [from step 1]

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Enter: [from step 1]

vercel env add NEXT_PUBLIC_APP_URL
# Enter: [from step 2]

vercel env add NEXTAUTH_SECRET
# Enter: heBNc5S3HQ5tsnCR9lV4uE58vwVVMGER9Mqygq94H4w=

vercel env add NEXT_PUBLIC_MOCK_MODE
# Enter: false

# RECOMMENDED Variables
vercel env add NODE_ENV
# Enter: production

vercel env add LOG_LEVEL
# Enter: info

vercel env add NEXT_PUBLIC_APP_NAME
# Enter: Sales SaaS App

vercel env add NEXT_PUBLIC_APP_VERSION
# Enter: 2.0.0
```

### **Step 4: Deploy to Production**
```bash
vercel --prod
```

---

## 📋 **Complete Variable Checklist**

### **Critical (App won't work without these):**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `NEXT_PUBLIC_APP_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXT_PUBLIC_MOCK_MODE`

### **Important (For production quality):**
- ❌ `NODE_ENV` (should be "production")
- ❌ `LOG_LEVEL` (should be "info" or "error")
- ❌ `NEXT_PUBLIC_APP_NAME`
- ❌ `NEXT_PUBLIC_APP_VERSION`

### **Optional (For monitoring):**
- ❌ `SENTRY_DSN` (error tracking - can skip for now)

---

## 🚨 **What Happens Without Missing Variables:**

- **Without Supabase keys**: Authentication will fail completely
- **Without APP_URL**: Email invitations won't work (broken links)
- **Without NODE_ENV**: Development mode in production (security risk)
- **Without LOG_LEVEL**: Verbose logging in production (performance impact)

---

## ✅ **Final Environment Count:**
- **Total Variables**: 10
- **You Have**: 3 ✅
- **Still Need**: 7 ❌

**The 3 most critical missing ones are the Supabase keys and App URL!**