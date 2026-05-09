# SAGECO EVERGREEN

> Premier Real Estate Platform for Uganda — Properties, Brokers, Green Projects

## Tech Stack
- **Frontend:** Next.js 14 + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Payments:** PesaPal v3 API
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_ENV=sandbox
NEXT_PUBLIC_SITE_URL=https://your-deployed-url.vercel.app
```

## Pages
- `/` — Home
- `/properties` — Property listings with filter
- `/brokers` — Broker profiles
- `/projects` — Environmental projects
- `/careers` — Job listings
- `/contact` — Contact form
- `/book` — Booking + PesaPal payment
- `/payment-success` — Payment confirmation

## PesaPal Integration
Get credentials at https://www.pesapal.com/dashboard
Set `PESAPAL_ENV=sandbox` for testing, `live` for production.

## Deploy to Vercel
1. Push this repo to GitHub
2. Import at https://vercel.com/new
3. Add environment variables
4. Deploy!
