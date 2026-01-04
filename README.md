# HF Space Monetizer

A monetization layer for HuggingFace Spaces, enabling subscription-based access with secure payment processing via Stripe.

## Features

- **Subscription Tiers**: Free, Basic, Pro, and Enterprise plans with configurable limits
- **Stripe Integration**: Secure payment processing with Checkout and Customer Portal
- **User Authentication**: OAuth via GitHub and Google using Auth.js
- **Usage Tracking**: Daily API call limits with automatic reset
- **Access Gating**: Control access to HF Spaces based on subscription tier
- **Analytics**: Track usage and access patterns

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Auth.js (NextAuth v5)
- **Database**: PostgreSQL via Prisma (Supabase recommended)
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Stripe account
- GitHub and/or Google OAuth apps

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hug-ur-face.git
   cd hug-ur-face
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in all required values in `.env`

4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products and prices in the Stripe Dashboard:
   - Basic: $9.99/month
   - Pro: $29.99/month
   - Enterprise: Custom pricing
3. Copy the Price IDs to your `.env` file
4. Set up the webhook endpoint:
   ```bash
   npm run stripe:listen
   ```

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth.js secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_BASIC_PRICE_ID` | Stripe price ID for Basic plan |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth.js routes
│   │   ├── billing/       # Billing portal
│   │   ├── checkout/      # Stripe checkout
│   │   ├── cron/          # Scheduled jobs
│   │   ├── spaces/        # Space access API
│   │   ├── usage/         # Usage tracking
│   │   └── webhooks/      # Stripe webhooks
│   ├── auth/              # Auth pages
│   ├── dashboard/         # User dashboard
│   ├── pricing/           # Pricing page
│   └── spaces/            # Space viewer
├── components/
│   ├── Header.tsx
│   ├── PricingCard.tsx
│   ├── SpaceEmbed.tsx
│   └── UsageStats.tsx
├── lib/
│   ├── auth.ts            # Auth.js config
│   ├── db.ts              # Prisma client
│   └── stripe.ts          # Stripe config & plans
└── types/
    └── next-auth.d.ts     # Type extensions
```

## API Endpoints

- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/billing/portal` - Create Stripe billing portal session
- `GET /api/usage` - Get current usage stats
- `POST /api/usage` - Record API usage
- `GET /api/spaces/[spaceId]` - Check space access
- `POST /api/webhooks/stripe` - Stripe webhook handler

## License

MIT
