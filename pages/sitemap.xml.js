import { supabaseAdmin } from '../lib/supabaseAdmin.js'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-co.vercel.app"

const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/properties", priority: "0.9", changefreq: "daily" },
  { url: "/brokers", priority: "0.8", changefreq: "weekly" },
  { url: "/book", priority: "0.8", changefreq: "monthly" },
  { url: "/broker-register", priority: "0.7", changefreq: "monthly" },
  { url: "/plans", priority: "0.7", changefreq: "monthly" },
  { url: "/projects", priority: "0.7", changefreq: "monthly" },
  { url: "/careers", priority: "0.6", changefreq: "monthly" },
  { url: "/contact", priority: "0.6", changefreq: "yearly" },
  { url: "/docs", priority: "0.5", changefreq: "monthly" },
  { url: "/faq", priority: "0.5", changefreq: "monthly" },
  { url: "/android", priority: "0.4", changefreq: "monthly" },
  { url: "/market", priority: "0.6", changefreq: "weekly" },
]

async function getPropertyUrls() {
  try {
    const supabase = supabaseAdmin
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, updated_at")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(500)
    
    if (error || !data) return []
    return data.map(p => ({
      url: `/property/${p.id}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : null
    }))
  } catch {
    return []
  }
}

function createSitemap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n")}
</urlset>`
}

export async function getServerSideProps({ res }) {
  const propertyPages = await getPropertyUrls()
  const allPages = [...staticPages, ...propertyPages]
  
  res.setHeader("Content-Type", "application/xml")
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
  res.write(createSitemap(allPages))
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  return null
}
