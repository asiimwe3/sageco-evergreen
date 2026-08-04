export default function handler(req, res) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"
  const robots = `User-agent: *\nAllow: /\nDisallow: /payment-success\nDisallow: /broker-payment-success\nDisallow: /job-post-success\nDisallow: /subscription-success\nDisallow: /reset-password\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml`
  res.setHeader("Content-Type", "text/plain")
  res.setHeader("Cache-Control", "public, s-maxage=86400")
  res.status(200).send(robots)
}
