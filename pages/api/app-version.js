export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    versionCode: 33,
    versionName: "4.1.0",
    apkUrl: "https://github.com/asiimwe3/sageco-evergreen-android/releases/download/v4.0.0-33/app-release.apk",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sagecoevergreen.app",
    notes: "Build 33 — reliable crash reporting: crash reports are now delivered reliably even without reopening the app. Crash alerts reach the developer instantly on WhatsApp.",
    forceUpdate: false
  })
}
