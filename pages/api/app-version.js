// SageCo Evergreen — Android App Version Check
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({
    versionCode: 8,
    versionName: "3.1.0",
    apkUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sageco-evergreen-co.vercel.app'}/downloads/sageco-app-latest.apk`,
    notes: "v3.1.0 — native bottom menu and side drawer for one-tap access to every section: Properties, Market, Brokers, AI Broker, GPS Measure, Book Viewing, Valuation, Title Search, Plans and more.",
    forceUpdate: false,
  })
}
