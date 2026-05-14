export default function handler(req, res) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"
  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/properties", priority: "0.9", changefreq: "daily" },
    { url: "/brokers", priority: "0.8", changefreq: "weekly" },
    { url: "/projects", priority: "0.7", changefreq: "monthly" },
    { url: "/careers", priority: "0.6", changefreq: "monthly" },
    { url: "/contact", priority: "0.6", changefreq: "yearly" },
    { url: "/book", priority: "0.8", changefreq: "monthly" },
    { url: "/broker-register", priority: "0.7", changefreq: "monthly" },
  ]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>\n    <loc>${SITE_URL}${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join("\n")}
</urlset>`
  res.setHeader("Content-Type", "application/xml")
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate")
  res.status(200).send(sitemap)
}
