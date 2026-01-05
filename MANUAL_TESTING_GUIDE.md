# Manual Frontend Testing Guide
## Complete End-to-End User Flow Verification

**Test URL:** https://pic.mothership-ai.com

---

## Pre-Testing Setup

1. **Open a new incognito/private browser window** (to start fresh)
2. **Have your email client open** (check `info@mothership-ai.com` inbox)
3. **Have a notepad ready** to record any issues

---

## Test 1: Homepage & Legal Pages ✅

### 1.1 Homepage
- [ ] Visit: https://pic.mothership-ai.com
- [ ] Verify page loads without errors
- [ ] Check hero section displays correctly
- [ ] Scroll to footer

### 1.2 Footer Legal Links
In the footer, click each link and verify it loads:

- [ ] **Privacy Policy** - https://pic.mothership-ai.com/privacy
  - Verify comprehensive privacy information displays
  - Check "Last Updated" date shows

- [ ] **Terms of Service** - https://pic.mothership-ai.com/terms
  - Verify all sections load correctly
  - Check account terms are present

- [ ] **Acceptable Use Policy** - https://pic.mothership-ai.com/acceptable-use
  - Verify prohibited activities are listed
  - Check enforcement section displays

- [ ] **Disclaimer** - https://pic.mothership-ai.com/disclaimer
  - Verify service availability notice
  - Check limitation of liability section

- [ ] **FAQ** - https://pic.mothership-ai.com/faq
  - Verify collapsible sections work
  - Test clicking questions to expand answers

### 1.3 Service Availability Disclaimer
- [ ] Scroll to footer on homepage
- [ ] Verify yellow disclaimer box is visible
- [ ] Read: "During periods of high demand, users may experience wait times..."

**Expected Result:** All pages load correctly with proper formatting

---

## Test 2: User Signup Flow ✅

### 2.1 Create First Account
1. [ ] Click **"Get Started"** or visit https://pic.mothership-ai.com/auth/signin
2. [ ] Click **"Don't have an account? Sign up"** link
3. [ ] Fill in form:
   - **Name:** Test User 1
   - **Email:** `YOUR_REAL_EMAIL@gmail.com` (use real email to receive verification)
   - **Password:** `TestPass123!`
4. [ ] Click **"Sign Up"**

**Expected Result:**
- ✅ Success message: "Account created! Please check your email to verify your account."
- ✅ Redirected to login page with notice

### 2.2 Check Verification Email
1. [ ] Open your email inbox
2. [ ] Look for email from: `info@mothership-ai.com`
3. [ ] Subject: **"Verify your email - AI Image Editor"**
4. [ ] Email should have:
   - Welcome message
   - Blue "Verify Email" button
   - Mention of "3 free credits"
   - Link that works if button doesn't

**Expected Result:** Email received within 1 minute

### 2.3 Attempt Login BEFORE Verification
1. [ ] Go to: https://pic.mothership-ai.com/auth/signin
2. [ ] Enter your test email and password
3. [ ] Click **"Sign In"**

**Expected Result:**
- ❌ Error message: "Please verify your email before signing in. Check your inbox for the verification link."
- ❌ Login is blocked

---

## Test 3: Email Verification ✅

### 3.1 Verify Email
1. [ ] Go back to your email
2. [ ] Click the **"Verify Email"** button in the email
3. [ ] OR copy/paste the verification link

**Expected Result:**
- ✅ Page loads: `/auth/verify-email?token=...`
- ✅ Success message: "Email verified successfully!"
- ✅ Message: "You've been awarded 3 free credits!"
- ✅ Button: "Go to Sign In"

### 3.2 Try Verification Link Again
1. [ ] Click browser back button
2. [ ] Try to use the same verification link again

**Expected Result:**
- ❌ Error: "Invalid or expired verification token"
- ✅ Token is single-use only

---

## Test 4: Login with Verified Account ✅

### 4.1 Successful Login
1. [ ] Go to: https://pic.mothership-ai.com/auth/signin
2. [ ] Enter:
   - **Email:** (your test email)
   - **Password:** `TestPass123!`
3. [ ] Click **"Sign In"**

**Expected Result:**
- ✅ Redirected to: `/generate`
- ✅ Top right shows your name/email
- ✅ Credit counter shows: **"3 credits available"**

### 4.2 Verify Dashboard Access
1. [ ] Check you can see the image generation interface
2. [ ] Verify you can upload an image (don't generate yet if HF Space is down)
3. [ ] Check credit counter is visible

**Expected Result:** Full access to generation interface

---

## Test 5: IP-Based Rate Limiting ✅

### 5.1 Create Second Account (Same IP)
1. [ ] Open new incognito window (same computer/IP)
2. [ ] Go to signup page
3. [ ] Create account with different email: `YOUR_EMAIL+2@gmail.com`
4. [ ] Complete signup

**Expected Result:** ✅ Account created successfully (2/3 allowed)

### 5.2 Create Third Account (Same IP)
1. [ ] Open another incognito window
2. [ ] Create account: `YOUR_EMAIL+3@gmail.com`

**Expected Result:** ✅ Account created successfully (3/3 allowed)

### 5.3 Try Fourth Account (Should Fail)
1. [ ] Open another incognito window
2. [ ] Try to create account: `YOUR_EMAIL+4@gmail.com`

**Expected Result:**
- ❌ Error: "Maximum accounts per IP address reached. Please try again later."
- ❌ HTTP 429 status
- ✅ Rate limit working correctly

---

## Test 6: Forgot Password Flow ✅

### 6.1 Request Password Reset
1. [ ] Go to: https://pic.mothership-ai.com/auth/signin
2. [ ] Click **"Forgot Password?"** link
3. [ ] Enter your test email
4. [ ] Click **"Send Reset Link"**

**Expected Result:**
- ✅ Success message: "If an account exists with that email, you will receive a password reset link."
- ✅ Message shown even for invalid emails (security)

### 6.2 Check Password Reset Email
1. [ ] Check your email inbox
2. [ ] Look for email from: `info@mothership-ai.com`
3. [ ] Subject: **"Reset your password - AI Image Editor"**
4. [ ] Email should have:
   - "Password Reset Request" header
   - Blue "Reset Password" button
   - Security notice (expires in 1 hour)
   - Warning about ignoring if you didn't request

**Expected Result:** Email received within 1 minute

### 6.3 Reset Password
1. [ ] Click **"Reset Password"** button in email
2. [ ] Verify page loads: `/auth/reset-password?token=...`
3. [ ] Enter new password: `NewTestPass123!`
4. [ ] Confirm password: `NewTestPass123!`
5. [ ] Click **"Reset Password"**

**Expected Result:**
- ✅ Success message: "Password updated successfully. You can now sign in."
- ✅ Redirected to login page

### 6.4 Login with New Password
1. [ ] Try to login with OLD password

**Expected Result:** ❌ Login fails

2. [ ] Login with NEW password: `NewTestPass123!`

**Expected Result:** ✅ Login successful

### 6.5 Try Reset Link Again
1. [ ] Go back to email
2. [ ] Click the reset link again

**Expected Result:**
- ❌ Error: "Invalid or expired reset token"
- ✅ Token is single-use only

---

## Test 7: Logout & Re-login ✅

### 7.1 Logout
1. [ ] While logged in, find logout button (top right)
2. [ ] Click logout

**Expected Result:**
- ✅ Redirected to homepage or login page
- ✅ No longer shows user info

### 7.2 Re-login
1. [ ] Go to login page
2. [ ] Login with your credentials
3. [ ] Verify credits are still 3 (or less if you used any)

**Expected Result:** ✅ Login successful, data persists

---

## Test 8: Image Generation (if HF Space is upgraded) ✅

**⚠️ Only test this if you've completed the HuggingFace hardware upgrade**

### 8.1 Generate Image
1. [ ] While logged in at `/generate`
2. [ ] Upload a test image
3. [ ] Enter a prompt: "make it cartoon style"
4. [ ] Select an editing mode
5. [ ] Click **"Generate"**

**Expected Result (if HF Space is ready):**
- ✅ Processing starts
- ✅ Credits decrement by 1 (shows 2 remaining)
- ✅ Image generates successfully
- ✅ Result displayed

**Expected Result (if HF Space quota exceeded):**
- ❌ Error: "60 of 58 requests not available"
- ✅ Credit refunded automatically

---

## Test 9: Pricing & Purchase Flow ✅

### 9.1 View Pricing
1. [ ] Click "Pricing" in navigation
2. [ ] Verify all credit bundles display:
   - 10 credits - $10
   - 50 credits - $45
   - 100 credits - $80

**Expected Result:** ✅ All bundles show with "Purchase" buttons

### 9.2 Attempt Purchase (Optional)
1. [ ] Click any "Purchase" button
2. [ ] Verify redirected to Stripe checkout
3. [ ] ⚠️ **Don't complete payment unless you want to test real transactions**

**Expected Result:** ✅ Stripe checkout loads correctly

---

## Test 10: Mobile Responsiveness 📱

### 10.1 Test on Mobile Device
1. [ ] Open site on phone: https://pic.mothership-ai.com
2. [ ] Navigate through pages
3. [ ] Try signup flow
4. [ ] Check all legal pages

**Expected Result:**
- ✅ All pages responsive
- ✅ Forms usable on mobile
- ✅ Images and buttons properly sized

---

## Test 11: Security Checks 🔒

### 11.1 Direct URL Access (Unauthorized)
Try accessing these URLs while **logged out**:

- [ ] https://pic.mothership-ai.com/generate
- [ ] https://pic.mothership-ai.com/pricing

**Expected Result:**
- ✅ Redirected to login page
- ✅ Protected routes working

### 11.2 SQL Injection Attempt (Security)
1. [ ] Go to login page
2. [ ] Try email: `admin' OR '1'='1`
3. [ ] Try password: `password`

**Expected Result:**
- ❌ Login fails
- ✅ No database error shown
- ✅ Protected against SQL injection

### 11.3 XSS Attempt (Security)
1. [ ] Go to signup
2. [ ] Try name: `<script>alert('xss')</script>`
3. [ ] Complete signup

**Expected Result:**
- ✅ Script tags not executed
- ✅ Name stored safely

---

## Test 12: Error Handling ⚠️

### 12.1 Invalid Email Format
1. [ ] Try signup with email: `notanemail`

**Expected Result:** ❌ Validation error

### 12.2 Short Password
1. [ ] Try signup with password: `123`

**Expected Result:** ❌ Error: "Password must be at least 6 characters"

### 12.3 Duplicate Email
1. [ ] Try to create account with existing email

**Expected Result:** ❌ Error: "Email already registered"

---

## Summary Checklist ✅

After completing all tests, verify:

- [ ] ✅ All legal pages accessible and properly formatted
- [ ] ✅ Signup requires email verification
- [ ] ✅ Email verification awards 3 credits
- [ ] ✅ Unverified users cannot login
- [ ] ✅ IP rate limiting blocks 4th account
- [ ] ✅ Forgot password sends email via Resend
- [ ] ✅ Password reset works correctly
- [ ] ✅ Reset tokens are single-use
- [ ] ✅ Login/logout works correctly
- [ ] ✅ Credits persist across sessions
- [ ] ✅ Protected routes redirect to login
- [ ] ✅ Mobile responsive design works
- [ ] ✅ Security measures in place

---

## Issues Found? 🐛

If you encounter any issues during testing:

1. **Note the exact steps** that caused the issue
2. **Screenshot the error** if visible
3. **Check browser console** (F12) for errors
4. **Record the URL** where it occurred
5. **Let me know** and I'll fix it immediately

---

## Database Verification (Optional) 🗄️

If you want to verify backend data:

```sql
-- Check your user record
SELECT
  id, email, emailVerified, imageCredits,
  signupIp, createdAt
FROM "User"
WHERE email = 'your_test_email@gmail.com';

-- Check signup attempts from your IP
SELECT COUNT(*) as total_accounts
FROM "SignupAttempt"
WHERE success = true
  AND createdAt > NOW() - INTERVAL '30 days'
GROUP BY ipAddress;

-- Check if verification token was used
SELECT * FROM "VerificationToken"
WHERE identifier = 'your_test_email@gmail.com';
-- Should be empty after verification

-- Check reset token was cleared
SELECT resetToken, resetTokenExpiry
FROM "User"
WHERE email = 'your_test_email@gmail.com';
-- Should be NULL after password reset
```

---

## All Systems Ready! 🚀

Once you complete this checklist and everything passes:

1. ✅ Your authentication system is fully functional
2. ✅ Email verification is working via Resend
3. ✅ IP-based abuse prevention is active
4. ✅ Password reset flow is complete
5. ✅ All legal protections are in place
6. ✅ Your app is ready for production users

**Next step:** Upgrade HuggingFace Space hardware to fix the quota issue, then your entire service will be fully operational!
