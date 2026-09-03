import Link from "next/link"
import SEO from '../components/SEO'

export default function AndroidPage() {
  return (
    <>
      <SEO
        title="Download SAGECO EVERGREEN Android App"
        description="Download the SAGECO EVERGREEN Android app for property search, GPS land measurement, and investment tracking on your phone. Available for all Ugandans."
        keywords="SAGECO Android app, real estate app Uganda, property app download, Uganda property mobile app"
        path="/android"
      />

      <section className="bg-gradient-to-br from-primary to-green-800 text-white py-24 px-4 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h1 className="text-4xl font-bold mb-3">SAGECO EVERGREEN App</h1>
        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">Browse properties, book viewings, and connect with brokers — all from your Android phone.</p>
        <a
          href="/downloads/sageco-app-latest.apk"
          download="SageCo-Evergreen-v3.1.0.apk"
          className="inline-block bg-white text-primary font-bold px-10 py-4 rounded-full text-lg hover:opacity-90 transition shadow-lg">
          ⬇️ Download APK (v3.1.0)
        </a>
        <p className="text-green-200 text-sm mt-4">Android 5.0+ required · Free to download</p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">App Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "🏡", title: "Browse Properties", desc: "View all listings with photos, prices, and full details" },
            { icon: "📅", title: "Book Viewings", desc: "Book a property viewing with secure PesaPal payment" },
            { icon: "🤝", title: "Connect with Brokers", desc: "Chat directly with verified SAGECO brokers" },
            { icon: "💬", title: "AI Assistant", desc: "Get instant answers about any property 24/7" },
            { icon: "🔔", title: "WhatsApp Updates", desc: "Receive booking confirmations on WhatsApp" },
            { icon: "🌿", title: "Green Projects", desc: "Explore eco-friendly property developments" },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Install instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-yellow-800 mb-3">📋 How to Install</h3>
          <ol className="space-y-2 text-sm text-yellow-800">
            <li className="flex gap-2"><span className="font-bold">1.</span> Download the APK file from the link above</li>
            <li className="flex gap-2"><span className="font-bold">2.</span> Open your phone Settings → Security → Enable "Unknown Sources"</li>
            <li className="flex gap-2"><span className="font-bold">3.</span> Open the downloaded APK file and tap Install</li>
            <li className="flex gap-2"><span className="font-bold">4.</span> Once installed, open "SAGECO EVERGREEN" from your app drawer</li>
          </ol>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Prefer to use the web version?</p>
          <Link href="/properties" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">Browse Properties Online</Link>
        </div>
      </div>
    </>
  )
}
