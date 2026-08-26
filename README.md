# 🏠 DeryCode SAGECO Evergreen

<div align="center">

**Uganda's Premier Real Estate Investment Platform**

AI-powered property valuations · GPS land verification · Programmable escrow · Fractional investment

</div>

---

## 📋 About

**SAGECO Evergreen** is a full-stack real estate platform built and maintained by
**DeryCode Technologies** for SAGECO EVERGREEN Company Limited, Uganda.

The platform connects property buyers, sellers, and investors with verified
brokers across Uganda — featuring AI price predictions, GPS land measurement,
drone verification, programmable escrow, and fractional land investment.

## 🚀 Features

- **Property Listings** — Land, residential, commercial, and eco-green projects
- **AI Price Prediction** — GPS-based valuation using Uganda district data
- **GPS Land Measurement** — Free tool for accurate acreage & boundary mapping
- **Programmable Escrow** — Milestone-based fund release with GPS verification
- **Drone Verification** — LiDAR scans, 3D twins, and verified boundaries
- **Digital Land Passports** — Verifiable property records with GPS & ownership history
- **Fractional Investment** — Tokenized shares of land with ROI projections
- **AI Broker** — 24/7 natural-language property search on WhatsApp & Web
- **Broker Management** — Registration, plans, commissions, and MLS groups
- **PesaPal Payments** — MTN MoMo, Airtel Money, and card payments

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (React 18) |
| Language | JavaScript / TypeScript |
| Database | Supabase (PostgreSQL) |
| Styling | Tailwind CSS 3 |
| Payments | PesaPal |
| Maps | Leaflet + OpenStreetMap |
| Hosting | Vercel |
| Auth | Supabase Auth |

## ⚡ Quick Start (DeryCode Team Only)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in your Supabase, PesaPal, and admin secrets

# Run database migrations
# Execute supabase/migrations/*.sql in your Supabase SQL editor

# Start dev server
npm run dev
```

## 📁 Project Structure

```
sageco-evergreen/
├── components/      # React components (Navbar, Footer, MapPicker, PricePredictor, etc.)
├── pages/           # Next.js pages
│   ├── api/         # API routes (auth, payments, AI broker, escrow, investments)
│   ├── admin/       # Admin dashboard routes
│   └── ...
├── lib/             # Shared utilities (Supabase clients, company constants, districts)
├── context/         # React context (Auth)
├── hooks/           # Custom hooks
├── supabase/        # Database migrations & schema
│   └── migrations/  # SQL migration files
├── public/          # Static assets (images, icons)
└── package.json
```

## 🔒 License & Ownership

This is **proprietary software** owned by **DeryCode Technologies** and
**SAGECO EVERGREEN Company Limited**.

- ❌ No copying, forking, or redistribution
- ❌ No unauthorized modification
- ❌ No use in competing products

See [LICENSE](LICENSE) for the full proprietary license terms.

## 👥 Code Owners

| Owner | Role |
|-------|------|
| **Asiimwe Derick** (@asiimwe3) | Founder & CEO, DeryCode Technologies — Lead Developer |
| DeryCode Technologies | Code owner & maintainer |

See [CODEOWNERS](.github/CODEOWNERS) for the GitHub ownership configuration.

## 📞 Contact

- **SAGECO EVERGREEN:** sagecoevergreen@gmail.com · +256 750 414 366
- **DeryCode Technologies:** https://derycode.publicvm.com
- **Location:** Kyenjojo, Western Uganda

---

<div align="center">

© 2024–2026 **DeryCode Technologies** & **SAGECO EVERGREEN Company Limited**

All rights reserved. Proprietary software — unauthorized use is prohibited.

</div>
