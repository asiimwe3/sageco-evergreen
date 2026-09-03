// SageCo Evergreen — Android App Version Check
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({
    versionCode: 9,
    versionName: "3.1.1",
    apkUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sageco-evergreen-co.vercel.app'}/downloads/sageco-app-latest.apk`,
    notes: "v3.1.1 — Market removed from app menus. Bottom bar: Home, Properties, Account, Menu.",
    forceUpdate: false,
  })
}
