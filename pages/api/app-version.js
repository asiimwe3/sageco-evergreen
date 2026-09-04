export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    versionCode: 31,
    versionName: "4.1.0",
    apkUrl: "https://github.com/asiimwe3/sageco-evergreen-android/releases/download/v4.0.0-31/app-release.apk",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sagecoevergreen.app",
    notes: "Build 31 — crash diagnostics: the app now saves and shows the exact error when it crashes. Also: self-updating system, offline image caching, navigation + WhatsApp fixes.",
    forceUpdate: false
  })
}
