const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen.vercel.app"

const pages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/properties", priority: "0.9", changefreq: "daily" },
  { url: "/brokers", priority: "0.8", changefreq: "weekly" },
  { url: "/book", priority: "0.8", changefreq: "monthly" },
  { url: "/post-job", priority: "0.7", changefreq: "monthly" },
  { url: "/broker-register", priority: "0.7", changefreq: "monthly" },
  { url: "/plans", priority: "0.7", changefreq: "monthly" },
  { url: "/projects", priority: "0.7", changefreq: "monthly" },
  { url: "/careers", priority: "0.6", changefreq: "monthly" },
  { url: "/contact", priority: "0.6", changefreq: "yearly" },
  { url: "/docs", priority: "0.5", changefreq: "monthly" },
  { url: "/faq", priority: "0.5", changefreq: "monthly" },
  { url: "/android", priority: "0.4", changefreq: "monthly" },
]

function createSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n")}
</urlset>`
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "application/xml")
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800")
  res.write(createSitemap())
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
