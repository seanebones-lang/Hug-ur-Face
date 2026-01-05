# 🔐 HuggingFace Space Security Guide

**Space:** bizbots/qwen-image-editor
**Current Status:** PUBLIC ⚠️
**Goal:** Make it private and secure

---

## 🎯 Security Options (Choose One)

### ⭐ **RECOMMENDED: Option 1 - Make Space Private**

This makes the Space accessible **only to you** (the owner).

#### How to Enable:

**Method A: Via Web Interface**
1. Go to: https://huggingface.co/spaces/bizbots/qwen-image-editor/settings
2. Scroll to "Visibility" section
3. Toggle to **"Private"**
4. Click "Save"

**Method B: Via README.md**
```yaml
---
title: Qwen-Image-Edit-2511-LoRAs-Fast
sdk: gradio
sdk_version: 6.2.0
private: true  # ← Add this line
---
```

**Result:**
- ✅ Only you can access the Space
- ✅ Your Vercel app can still call it (with HF_TOKEN)
- ✅ No public access
- ❌ Anyone else gets 403 Forbidden

---

### 💡 **Option 2 - Token-Based Authentication**

Keep Space public but require authentication token.

#### Implementation:

**In your Space's `app.py`:**
```python
import os
import secrets

# Add at the top of app.py
ALLOWED_TOKENS = os.environ.get("ALLOWED_TOKENS", "").split(",")

def check_auth(request: gr.Request):
    """Check if request has valid auth token"""
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startsWith("Bearer "):
        raise gr.Error("Unauthorized: Missing token")

    token = auth_header.replace("Bearer ", "")

    if token not in ALLOWED_TOKENS:
        raise gr.Error("Unauthorized: Invalid token")

    return True

# Add to your infer function
@spaces.GPU
def infer(images, prompt, lora_adapter, seed, randomize_seed, guidance_scale, steps, request: gr.Request):
    check_auth(request)  # ← Add this

    # ... rest of your function
```

**Set tokens in Space settings:**
```bash
# Generate a secure token
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Add to HuggingFace Space:
# Settings → Variables and secrets → New secret
# Name: ALLOWED_TOKENS
# Value: your_generated_token_here
```

**Update your Vercel app:**
```typescript
// src/app/api/generate/route.ts
const SPACE_AUTH_TOKEN = process.env.SPACE_AUTH_TOKEN;

const callResponse = await fetch(`${HF_SPACE_URL}/gradio_api/call/infer`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${SPACE_AUTH_TOKEN}`,  // ← Add this
    ...(HF_TOKEN && { "X-HF-Token": `Bearer ${HF_TOKEN}` })
  },
  body: JSON.stringify({ ... })
});
```

**Result:**
- ✅ Public can see the Space
- ✅ Only authorized apps can use it
- ✅ You control who has tokens
- ✅ Can revoke tokens anytime

---

### 🔒 **Option 3 - IP Whitelist (Advanced)**

Only allow specific IPs to access.

#### Implementation:

**In your Space's `app.py`:**
```python
import os

ALLOWED_IPS = os.environ.get("ALLOWED_IPS", "").split(",")

def check_ip(request: gr.Request):
    """Check if request comes from allowed IP"""
    client_ip = request.client.host

    if client_ip not in ALLOWED_IPS:
        raise gr.Error(f"Unauthorized: IP {client_ip} not allowed")

    return True

# Add to infer function
@spaces.GPU
def infer(images, prompt, lora_adapter, seed, randomize_seed, guidance_scale, steps, request: gr.Request):
    check_ip(request)  # ← Add this

    # ... rest of function
```

**Set allowed IPs in Space settings:**
```bash
# Get Vercel's IPs (they change)
# Better to use Vercel's static IP if on Pro plan
# Or use your server's IP

# Add to HuggingFace Space:
# Settings → Variables → ALLOWED_IPS
# Value: 1.2.3.4,5.6.7.8
```

**Result:**
- ✅ Only specific IPs can access
- ⚠️ Vercel IPs change (Pro plan has static IPs)
- ⚠️ Harder to maintain

---

### 🌐 **Option 4 - Gradio Built-in Auth**

Use Gradio's authentication system.

#### Implementation:

**In your Space's `app.py`:**
```python
# At the bottom where you launch
if __name__ == "__main__":
    demo.queue(max_size=20).launch(
        auth=("your_username", "your_secure_password"),  # ← Add this
        auth_message="Please login to use NextEleven AI Image Editor"
    )
```

**Or with multiple users:**
```python
def check_credentials(username, password):
    """Check if credentials are valid"""
    valid_users = {
        "admin": "secure_password_1",
        "api": "your_api_key_here"
    }
    return valid_users.get(username) == password

if __name__ == "__main__":
    demo.queue(max_size=20).launch(
        auth=check_credentials,
        auth_message="NextEleven AI - Login Required"
    )
```

**Update Vercel app to send credentials:**
```typescript
// Basic auth in requests
const credentials = btoa(`api:${process.env.SPACE_API_KEY}`);

const callResponse = await fetch(`${HF_SPACE_URL}/gradio_api/call/infer`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Basic ${credentials}`,  // ← Add this
  },
  body: JSON.stringify({ ... })
});
```

**Result:**
- ✅ Simple username/password
- ✅ Built into Gradio
- ✅ Can have multiple users
- ⚠️ Credentials in Space code

---

## 🎯 My Recommendation

### **Use Option 1: Make Space Private**

**Why:**
1. ✅ **Simplest** - Just one toggle
2. ✅ **Most secure** - Only you have access
3. ✅ **No code changes** needed
4. ✅ **Works immediately**
5. ✅ **Your Vercel app still works** (with HF_TOKEN)

**How HF_TOKEN Works with Private Spaces:**

When your Space is private:
```typescript
// Your Vercel app already has HF_TOKEN set
const HF_TOKEN = process.env.HF_TOKEN; // hf_YOUR_TOKEN_HERE

// All requests include it:
const response = await fetch(`${HF_SPACE_URL}/gradio_api/...`, {
  headers: {
    "Authorization": `Bearer ${HF_TOKEN}`  // ← This gives access
  }
});
```

**HuggingFace checks:**
1. Is the Space private? → Yes
2. Does request have valid token? → Yes (your HF_TOKEN)
3. Does token owner have access to Space? → Yes (you own both)
4. **Allow request** ✅

**Result:**
- ✅ Your Vercel app: **CAN ACCESS** (has your token)
- ❌ Random users: **CANNOT ACCESS** (403 Forbidden)
- ❌ Bots/scrapers: **CANNOT ACCESS** (403 Forbidden)

---

## 📝 Implementation Steps

### Step 1: Make Space Private (Recommended)

**Via Web:**
```
1. Go to: https://huggingface.co/spaces/bizbots/qwen-image-editor/settings
2. Find "Visibility" section
3. Click "Private" radio button
4. Click "Save changes"
```

**Via Git (Alternative):**
```bash
cd /tmp/qwen-space

# Edit README.md
cat > README.md << 'EOF'
---
title: Qwen-Image-Edit-2511-LoRAs-Fast
emoji: 🎃
colorFrom: indigo
colorTo: gray
sdk: gradio
sdk_version: 6.2.0
app_file: app.py
pinned: true
license: apache-2.0
short_description: Demo of the Collection of Qwen Image Edit LoRAs
private: true  # ← Added this line
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference
EOF

git add README.md
git commit -m "feat: make Space private for security"
git push https://bizbots:hf_YOUR_TOKEN_HERE@huggingface.co/spaces/bizbots/qwen-image-editor main
```

### Step 2: Verify It Works

**Test from Vercel:**
```typescript
// Your current code already includes HF_TOKEN, so it should work!
// No changes needed to your Vercel app
```

**Test public access is blocked:**
```bash
# This should now return 403 Forbidden:
curl https://bizbots-qwen-image-editor.hf.space

# This should still work (with your token):
curl -H "Authorization: Bearer hf_YOUR_TOKEN_HERE" \
     https://bizbots-qwen-image-editor.hf.space
```

---

## 🔐 Additional Security Measures

### 1. Rotate Your HF_TOKEN

Since we've used it in commands, rotate it:

```bash
# 1. Go to: https://huggingface.co/settings/tokens
# 2. Find your current token
# 3. Click "Delete"
# 4. Click "New token"
# 5. Name: "NextEleven Production"
# 6. Role: "Write"
# 7. Copy the new token

# 8. Update Vercel:
cd /Users/nexteleven/Hug-ur-Face
vercel env add HF_TOKEN production
# Paste new token

# 9. Redeploy:
vercel --prod
```

### 2. Enable Two-Factor Auth on HuggingFace

```
1. Go to: https://huggingface.co/settings/account
2. Find "Two-factor authentication"
3. Click "Enable 2FA"
4. Follow the setup process
```

### 3. Monitor Space Access Logs

```
1. Go to: https://huggingface.co/spaces/bizbots/qwen-image-editor
2. Click "Logs" tab
3. Monitor for unexpected access
4. Check "Analytics" for usage patterns
```

---

## 🎯 Comparison Table

| Feature | Private Space | Token Auth | IP Whitelist | Gradio Auth |
|---------|---------------|------------|--------------|-------------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Security** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Maintenance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Flexibility** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Code Changes** | None | Medium | Medium | Small |
| **Works with L4** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cost** | Same | Same | Same | Same |

**Winner:** **Private Space** ⭐⭐⭐⭐⭐

---

## ⚠️ Important Notes

### About L4 GPU:

**Private Spaces on L4:**
- ✅ Works perfectly
- ✅ Same performance
- ✅ No extra cost
- ✅ Your Vercel app can access it (with HF_TOKEN)

**Quota:**
- L4 GPU: 5 hours/month on free tier
- Upgrade to PRO for unlimited: $9/month

### Current Space Settings:

```yaml
Current Status:
  Private: No (PUBLIC) ⚠️
  Hardware: L4x1 (requested)
  Status: APP_STARTING (loading 22+ minutes)

After Making Private:
  Private: Yes ✅
  Hardware: L4x1 (same)
  Status: RUNNING (once loaded)
  Access: Only you + apps with your HF_TOKEN
```

---

## 🚀 Quick Action Plan

### Immediate (2 minutes):

1. **Go to:** https://huggingface.co/spaces/bizbots/qwen-image-editor/settings
2. **Toggle:** Visibility to "Private"
3. **Click:** "Save changes"
4. **Done!** ✅

### After Space Loads (5 minutes):

1. **Test** from Vercel - should still work
2. **Test** public access - should be blocked (403)
3. **Verify** logs show only your access

### This Week (15 minutes):

1. **Rotate** your HuggingFace token
2. **Update** token in Vercel
3. **Enable** 2FA on HuggingFace

---

## 📊 Before vs After

### Before (Current):
```
Anyone → https://bizbots-qwen-image-editor.hf.space → ✅ Can access
Bots → https://bizbots-qwen-image-editor.hf.space → ✅ Can access
Your App → https://bizbots-qwen-image-editor.hf.space → ✅ Can access
```

### After (Private):
```
Anyone → https://bizbots-qwen-image-editor.hf.space → ❌ 403 Forbidden
Bots → https://bizbots-qwen-image-editor.hf.space → ❌ 403 Forbidden
Your App (with token) → https://bizbots-qwen-image-editor.hf.space → ✅ Can access
```

---

## 🎯 Summary

**Best Option:** Make Space Private
**Time to Implement:** 2 minutes
**Code Changes:** None
**Security Level:** Excellent
**Maintenance:** None

**Result:**
- ✅ Only you can access the Space directly
- ✅ Your Vercel app still works (has your token)
- ✅ No unauthorized access
- ✅ No extra cost
- ✅ Works perfectly with L4 GPU

---

**Go ahead and make it private right now! It's the simplest and most secure option.** 🔒

**Link:** https://huggingface.co/spaces/bizbots/qwen-image-editor/settings
