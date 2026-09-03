// SageCo Evergreen — Android App Version Check
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({
    versionCode: 6,
    versionName: "3.0.0",
    apkUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sageco-evergreen-co.vercel.app'}/downloads/sageco-app-latest.apk`,
    notes: "SageCo Evergreen v3.0.0 — the app is now one with the website: every screen, feature and payment identical, always in sync.",
    forceUpdate: false,
  })
}
