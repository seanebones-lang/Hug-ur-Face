# Email Verification Setup Guide

## Overview

Your application now includes email verification to prevent abuse and ensure users provide valid email addresses. This prevents unlimited free trial signups from the same IP address.

## Features Implemented

1. **Email Verification Required**: Users must verify their email before they can sign in
2. **IP-Based Rate Limiting**: Maximum 3 accounts per IP address within 30 days
3. **No Credits Until Verified**: Users receive 0 credits on signup, and get 3 free credits only after email verification
4. **Email Validation**: Basic email format validation on signup

## Setup Instructions

### 1. Get a Resend API Key

1. Go to [Resend](https://resend.com) and sign up for a free account
2. Navigate to **API Keys** in the dashboard
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Configure Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to **Domains** in Resend dashboard
2. Add your domain (e.g., `mothership-ai.com`)
3. Add the DNS records provided by Resend
4. Wait for verification (usually a few minutes)
5. Update `EMAIL_FROM` in your .env to use your domain:
   ```
   EMAIL_FROM="noreply@mothership-ai.com"
   ```

For testing, you can use the default `onboarding@resend.dev`

### 3. Add Environment Variables

#### Local Development

Update your `.env` file:

```bash
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="noreply@pic.mothership-ai.com"
```

#### Production (Vercel)

Add the environment variables to Vercel:

```bash
npx vercel env add RESEND_API_KEY production
# Paste your API key when prompted

npx vercel env add EMAIL_FROM production
# Enter: noreply@pic.mothership-ai.com
```

### 4. Deploy

```bash
npx vercel --prod
```

## How It Works

### Signup Flow

1. User signs up with email and password
2. System checks:
   - Is the email format valid?
   - Does this email already exist?
   - Has this IP created 3+ accounts in the last 30 days?
3. If checks pass:
   - Create user with 0 credits
   - Generate verification token (valid for 24 hours)
   - Send verification email
   - Log the signup attempt with IP address
4. User receives email with verification link

### Verification Flow

1. User clicks verification link in email
2. System checks if token is valid and not expired
3. If valid:
   - Mark email as verified
   - Give user 3 free credits
   - Delete verification token
4. User can now sign in

### Signin Flow

1. User enters email and password
2. System checks:
   - Do credentials match?
   - Is email verified?
3. If not verified, show error: "Please verify your email before signing in"
4. If verified, allow signin

## Abuse Prevention

### IP Tracking

- All signup attempts are logged with IP address
- Maximum 3 successful signups per IP in 30 days
- Uses various headers to get real IP (works with proxies, CDNs)

### Email Requirements

- Must be valid email format
- Must not already exist in database
- Must verify via email link

### No Free Credits Until Verified

- Users start with 0 credits
- Only receive 3 free credits after email verification
- Cannot use the service until verified

## Configuration Options

You can adjust these settings in `/src/app/api/auth/signup/route.ts`:

```typescript
const MAX_ACCOUNTS_PER_IP = 3; // Maximum accounts per IP
const LOOKBACK_DAYS = 30; // How far back to check
```

## Database Schema Changes

New fields added to `User` model:
- `signupIp`: Stores the IP address used during signup
- `lastLoginIp`: Can be used to track login IPs (not yet implemented)
- `imageCredits`: Default changed from 3 to 0

New table `SignupAttempt`:
- Tracks all signup attempts
- Includes IP address, email, success status, and timestamp
- Used for rate limiting and abuse detection

## Testing

### Test Email Verification

1. Sign up with a real email address
2. Check your inbox for verification email
3. Click the verification link
4. Try to sign in (should work)

### Test IP Rate Limiting

1. Create 3 accounts from the same network
2. Try to create a 4th account
3. Should see error: "Maximum number of accounts (3) reached from your network"

### Test Unverified Login

1. Sign up but don't verify email
2. Try to sign in
3. Should see error: "Please verify your email before signing in"

## Troubleshooting

### Emails Not Sending

- Verify RESEND_API_KEY is correct
- Check Resend dashboard for error logs
- Ensure EMAIL_FROM domain is verified (or use onboarding@resend.dev for testing)

### Users Can't Verify

- Check that NEXT_PUBLIC_APP_URL is set correctly
- Ensure token hasn't expired (24 hour limit)
- Check database for verification token

### Rate Limiting Too Strict

- Adjust MAX_ACCOUNTS_PER_IP in signup route
- Adjust LOOKBACK_DAYS for longer/shorter window

## Cost

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day

This should be sufficient for getting started. Upgrade plans start at $20/month for 50,000 emails.
