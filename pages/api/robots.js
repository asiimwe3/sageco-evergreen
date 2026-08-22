export default function handler(req, res) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"
  const robots = `# robots.txt — SAGECO EVERGREEN
# Built by DeryCode Technologies — https://derycode.publicvm.com
User-agent: *
Allow: /
Allow: /properties
Allow: /brokers
Allow: /invest
Allow: /plans
Allow: /projects
Allow: /contact
Allow: /book
Allow: /careers
Allow: /faq
Allow: /market
Allow: /ai-broker
Allow: /gps-measure
Allow: /title-search
Allow: /valuation
Allow: /verification
Allow: /eco
Allow: /escrow
Allow: /passports
Allow: /matching
Allow: /site-visits
Allow: /agents
Allow: /broker-register
Allow: /subscribe
Allow: /android
Disallow: /payment-success
Disallow: /broker-payment-success
Disallow: /job-post-success
Disallow: /subscription-success
Disallow: /reset-password
Disallow: /login
Disallow: /signup
Disallow: /account
Disallow: /upload-property
Disallow: /post-job
Disallow: /apply
Disallow: /admin
Disallow: /api/

# Crawl-delay for server-friendly indexing
Crawl-delay: 1

Sitemap: ${SITE_URL}/sitemap.xml`
  res.setHeader("Content-Type", "text/plain")
  res.setHeader("Cache-Control", "public, s-maxage=86400")
  res.status(200).send(robots)
}
