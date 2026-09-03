export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    versionCode: 24,
    versionName: "4.0.0",
    apkUrl: "https://github.com/asiimwe3/sageco-evergreen-android/releases/download/v4.0.0-24/app-release.apk",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sagecoevergreen.app",
    notes: "v4.0.0 — Native Jetpack Compose app with Properties, Brokers, Agents/MLM, Chat & Account.",
    forceUpdate: false
  })
}
