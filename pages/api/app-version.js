export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    versionCode: 10,
    versionName: "4.0.0",
    apkUrl: null,
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sagecoevergreen.app",
    notes: "v4.0.0 — Native Jetpack Compose app. Now available on Play Store.",
    forceUpdate: false
  })
}
