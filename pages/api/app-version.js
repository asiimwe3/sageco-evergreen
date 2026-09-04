export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json({
    versionCode: 30,
    versionName: "4.1.0",
    apkUrl: "https://github.com/asiimwe3/sageco-evergreen-android/releases/download/v4.0.0-30/app-release.apk",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.sagecoevergreen.app",
    notes: "Build 30 — self-updating release: in-app update system, offline image caching, fixed data/image loading, navigation crash fix, WhatsApp contact fix.",
    forceUpdate: false
  })
}
