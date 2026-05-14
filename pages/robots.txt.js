export default function handler(req, res) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

  const robots = `User-agent: *
Allow: /

# Block internal/payment pages from indexing
Disallow: /payment-success
Disallow: /broker-payment-success
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml`

  res.setHeader("Content-Type", "text/plain")
  res.setHeader("Cache-Control", "public, s-maxage=86400")
  res.status(200).send(robots)
}
