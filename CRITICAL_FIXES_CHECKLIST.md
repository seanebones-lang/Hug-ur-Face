# 🚨 CRITICAL FIXES - DO TODAY

## ⚠️ URGENT: Your .env File is in Git

**WHAT:** Your production secrets are exposed in the repository
**RISK:** Anyone with access can steal your database, Stripe account, and API keys
**WHO CAN SEE:** Anyone who has cloned or accessed this repo

### IMMEDIATE ACTION REQUIRED:

```bash
# 1. Remove .env from git (RIGHT NOW)
echo ".env" >> .gitignore
git rm --cached .env
git commit -m "chore: remove sensitive .env file"
git push

# 2. Create .env.example (safe template)
cat > .env.example << 'EOF'
# App
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=your_supabase_connection_string_here
DIRECT_URL=your_supabase_direct_url_here

# Auth
AUTH_SECRET=generate_with_openssl_rand_base64_32
AUTH_URL=https://your-domain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# HuggingFace
HF_SPACE_ID=your_username/space_name
HF_TOKEN=hf_your_token_here

# Email
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=your_email@domain.com
EOF

git add .env.example .gitignore
git commit -m "chore: add env example file"
git push
```

### 3. ROTATE ALL CREDENTIALS (Critical!):

#### Supabase Database:
1. Go to: https://app.supabase.com/project/_/settings/database
2. Click "Reset database password"
3. Copy new password
4. Update Vercel env vars:
   ```bash
   vercel env rm DATABASE_URL production
   vercel env add DATABASE_URL production
   # Paste new connection string

   vercel env rm DIRECT_URL production
   vercel env add DIRECT_URL production
   # Paste new direct URL
   ```

#### Stripe Keys:
1. Go to: https://dashboard.stripe.com/apikeys
2. Click "Roll" on Secret key
3. Confirm and copy new key
4. Update Vercel:
   ```bash
   vercel env rm STRIPE_SECRET_KEY production
   vercel env add STRIPE_SECRET_KEY production
   # Paste new sk_live_... key
   ```

#### HuggingFace Token:
1. Go to: https://huggingface.co/settings/tokens
2. Click on your token → "Manage" → "Invalidate and create new"
3. Copy new token
4. Update Vercel:
   ```bash
   vercel env rm HF_TOKEN production
   vercel env add HF_TOKEN production
   # Paste new hf_... token
   ```

#### Resend API Key:
1. Go to: https://resend.com/api-keys
2. Delete old key, create new one
3. Update Vercel:
   ```bash
   vercel env rm RESEND_API_KEY production
   vercel env add RESEND_API_KEY production
   # Paste new re_... key
   ```

### 4. Verify Everything Still Works:
```bash
# Redeploy to pick up new env vars
vercel --prod

# Test critical flows:
# - User signup (email sends?)
# - Login (database works?)
# - Credit purchase (Stripe works?)
# - Image generation (HF works?)
```

---

## 🔴 CRITICAL FIX #2: Add Rate Limiting

**WHAT:** API routes have no rate limiting
**RISK:** $1000s in abuse from bots, DoS attacks

### Install Upstash Redis:

```bash
npm install @upstash/ratelimit @upstash/redis
```

### Set up Upstash (5 minutes):
1. Go to: https://console.upstash.com/
2. Create account (free tier: 10K requests/day)
3. Click "Create Database" → "Redis"
4. Copy REST URL and Token
5. Add to Vercel:
   ```bash
   vercel env add UPSTASH_REDIS_REST_URL production
   vercel env add UPSTASH_REDIS_REST_TOKEN production
   ```

### Add to These Files:

**File 1: `src/lib/ratelimit.ts` (NEW)**
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Different limits for different endpoints
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 requests per 10 min
  analytics: true,
});

export const generateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 generations per min
  analytics: true,
});

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per min
  analytics: true,
});
```

**File 2: Update `/api/auth/forgot-password/route.ts`**
```typescript
import { authRateLimit } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/ip";

export async function POST(request: Request) {
  // Add rate limiting
  const ip = await getClientIp();
  const { success, limit, remaining } = await authRateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again in 10 minutes.",
        limit,
        remaining
      },
      { status: 429 }
    );
  }

  // ... rest of existing code
}
```

**File 3: Update `/api/generate/route.ts`**
```typescript
import { generateRateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Add rate limiting
  const { success } = await generateRateLimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before generating again." },
      { status: 429 }
    );
  }

  // ... rest of existing code
}
```

**Deploy:**
```bash
vercel --prod
```

---

## 🔴 CRITICAL FIX #3: Set Up Error Monitoring

**WHAT:** No visibility into production errors
**RISK:** Users experiencing bugs, you don't know

### Set Up Sentry (15 minutes):

```bash
# Install
npm install @sentry/nextjs

# Run setup wizard
npx @sentry/wizard@latest -i nextjs
```

**Follow wizard:**
1. Create Sentry account (free tier: 5K errors/month)
2. Create new project: "ai-image-editor"
3. Wizard will create config files automatically

**Add to Vercel:**
```bash
vercel env add SENTRY_DSN production
# Paste your DSN from Sentry dashboard

vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Same DSN
```

**Wrap Critical Routes:**

Update `/api/generate/route.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  try {
    // ... existing code
  } catch (error) {
    // Send to Sentry
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/generate',
        userId: session?.user?.id
      },
      extra: {
        prompt: prompt?.substring(0, 100),
        loraAdapter
      }
    });

    // ... existing error handling
  }
}
```

**Deploy and Test:**
```bash
vercel --prod

# Trigger a test error to verify Sentry works
# Check Sentry dashboard for error
```

---

## 🔴 CRITICAL FIX #4: Enable Database Backups

**WHAT:** No backups = one mistake = lose everything
**RISK:** Catastrophic data loss

### Enable Supabase Backups (2 minutes):

1. Go to: https://app.supabase.com/project/_/database/backups
2. Click **"Enable Point-in-Time Recovery"**
3. Cost: ~$0.02/GB/month (~$5-10/month for your DB)
4. Allows restore to any point in last 7 days

**DONE!** You're now protected against:
- Accidental deletions
- Bad migrations
- Database corruption
- Hacking attempts

---

## 🔴 CRITICAL FIX #5: Add Email Resend Functionality

**WHAT:** Users whose verification emails expire are locked out
**RISK:** Losing paying customers

### Create New Endpoint:

**File: `src/app/api/auth/resend-verification/route.ts` (NEW)**
```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a new verification email has been sent."
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified. You can sign in now.",
        alreadyVerified: true
      });
    }

    // Delete old tokens
    await db.verificationToken.deleteMany({
      where: { identifier: email }
    });

    // Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    await db.verificationToken.create({
      data: { identifier: email, token, expires }
    });

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    await sendVerificationEmail(email, token, baseUrl);

    return NextResponse.json({
      success: true,
      message: "A new verification email has been sent."
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
```

**Update Login Page UI:**

In `/src/app/auth/signin/page.tsx`, add resend button when login fails due to unverified email.

**Deploy:**
```bash
vercel --prod
```

---

## 🔴 CRITICAL FIX #6: Fix Middleware Protection

**File:** `src/middleware.ts`

**Current (BROKEN):**
```typescript
const protectedRoutes = ["/dashboard", "/settings"];
```

**Fixed:**
```typescript
const protectedRoutes = ["/dashboard", "/settings", "/generate"];
```

**Deploy:**
```bash
vercel --prod
```

---

## 🔴 CRITICAL FIX #7: Fix Checkout Redirect

**File:** `src/app/api/checkout/route.ts`

**Current (BROKEN):**
```typescript
success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&credits=${selectedBundle.credits}`,
```

**Fixed:**
```typescript
success_url: `${process.env.NEXT_PUBLIC_APP_URL}/generate?success=true&credits=${selectedBundle.credits}`,
```

**Deploy:**
```bash
vercel --prod
```

---

## ✅ Today's Completion Checklist

- [ ] **1. Secure .env file** (5 min)
  - Add to .gitignore
  - Remove from git
  - Create .env.example

- [ ] **2. Rotate credentials** (20 min)
  - Supabase password
  - Stripe secret key
  - HuggingFace token
  - Resend API key

- [ ] **3. Add rate limiting** (30 min)
  - Set up Upstash Redis
  - Create ratelimit.ts
  - Update API routes

- [ ] **4. Set up Sentry** (15 min)
  - Install and configure
  - Add to critical routes
  - Test error tracking

- [ ] **5. Enable DB backups** (2 min)
  - Turn on Supabase PITR

- [ ] **6. Add email resend** (15 min)
  - Create new endpoint
  - Update login UI

- [ ] **7. Fix middleware** (1 min)
  - Add /generate to protected routes

- [ ] **8. Fix checkout** (1 min)
  - Update redirect URL

**Total Time: ~90 minutes**

---

## After Today's Fixes:

Your system will be:
- ✅ **Secure**: No exposed secrets, rate limited
- ✅ **Observable**: Error tracking active
- ✅ **Resilient**: Backups enabled
- ✅ **User-friendly**: Email resend works
- ✅ **Functional**: Routes properly protected

---

## This Week's Action Items (After Today):

**High Priority (Fix This Week):**
1. Add CSRF protection
2. Strengthen password requirements (8 chars, complexity)
3. Add brute force protection on login
4. Optimize session callback (cache in JWT)
5. Add comprehensive tests
6. Set up CI/CD pipeline

**See full details in:** `SYSTEM_IMPROVEMENTS_ANALYSIS.md`

---

## Questions?

Let me know which of these critical fixes you want me to implement for you!

I can:
1. Create all the new files
2. Update existing routes
3. Set up configurations
4. Deploy everything

Just say the word!
