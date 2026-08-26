# Security Policy — DeryCode SAGECO Evergreen

## Reporting a Vulnerability

If you discover a security vulnerability in this codebase,
**do NOT open a public issue**. Instead, report it privately:

1. Email: **sagecoevergreen@gmail.com**
2. Subject: `[SECURITY] <brief description>`
3. Include: reproduction steps, potential impact, and suggested fix.

We will respond within 48 hours.

## Access Control

This repository is **private**. Only authorized DeryCode Technologies
team members and SAGECO EVERGREEN staff should have access.

If you believe an unauthorized person has access to this repository,
contact us immediately at sagecoevergreen@gmail.com.

## Security Measures in Place

- ✅ Private GitHub repository (no public access)
- ✅ Forking disabled
- ✅ Server-side admin routes protected with `ADMIN_SECRET`
- ✅ `NEXT_PUBLIC_ADMIN_SECRET` removed (no browser exposure)
- ✅ API auth checks on all sensitive routes
- ✅ Content Security Policy (CSP) headers configured
- ✅ No hardcoded API keys or secrets in source code

## Security Headers

The following security headers are enforced via `next.config.js`:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Referrer-Policy: strict-origin-when-down-origin`

---

© 2024–2026 DeryCode Technologies. All rights reserved.
