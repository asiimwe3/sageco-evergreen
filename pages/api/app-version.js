export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    versionCode: 34,
    versionName: "4.1.0",
    apkUrl: "https://github.com/asiimwe3/sageco-evergreen-android/releases/download/v4.0.0-34/app-release.apk",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sagecoevergreen.app",
    notes: "Build 34 — new Send Error Logs button on the Account screen: share full app diagnostics to the developer via WhatsApp in one tap.",
    forceUpdate: false
  })
}
