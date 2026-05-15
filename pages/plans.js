import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Head from "next/head"
import Link from "next/link"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-rho.vercel.app"

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 15000,
    duration: 1,
    color: "border-gray-200",
    badge: "",
    features: [
      "List up to 3 properties",
      "Standard broker profile",
      "Email support",
      "1 month access",
    ],
    cta: "Get Basic"
  },
  {
    id: "pro",
    name: "Pro",
    price: 25000,
    duration: 1,
    color: "border-primary",
    badge: "Most Popular",
    features: [
      "List up to 10 properties",
      "Featured broker profile",
      "Priority property placement",
      "WhatsApp contact badge",
      "1 month access",
    ],
    cta: "Get Pro"
  },
  {
    id: "premium",
    name: "Premium",
    price: 30000,
    duration: 1,
    color: "border-yellow-400",
    badge: "Best Value",
    features: [
      "Unlimited property listings",
      "Top placement in search",
      "Verified broker badge",
      "WhatsApp & call badge",
      "Priority support",
      "1 month access",
    ],
    cta: "Get Premium"
  }
]

export default function Plans() {
  return (
    <>
      <Head>
        <title>Broker Subscription Plans | SAGECO EVERGREEN</title>
        <meta name="description" content="Choose a broker subscription plan and start listing properties with SAGECO EVERGREEN in Kyenjojo, Uganda." />
        <link rel="canonical" href={`${SITE_URL}/plans`} />
        <meta property="og:title" content="Broker Plans | SAGECO EVERGREEN" />
        <meta property="og:description" content="Affordable broker plans to list and sell properties across Uganda." />
        <meta property="og:url" content={`${SITE_URL}/plans`} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      </Head>
      <Navbar />

      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Broker Subscription Plans</h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto">
          Join SAGECO EVERGREEN as a verified broker. List properties, get leads, and grow your real estate business.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={`bg-white rounded-2xl shadow-md border-2 ${plan.color} p-8 flex flex-col relative`}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{plan.name}</h2>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-primary">UGX {plan.price.toLocaleString()}</span>
                <span className="text-gray-400 text-sm ml-1">/month</span>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/subscribe?plan=${plan.id}`}
                className={`block text-center py-3 rounded-full font-bold transition ${
                  plan.id === "pro"
                    ? "bg-primary text-white hover:opacity-90"
                    : plan.id === "premium"
                    ? "bg-yellow-400 text-gray-900 hover:opacity-90"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <p className="text-gray-700 font-semibold text-lg mb-2">Already a registered broker?</p>
          <p className="text-gray-500 mb-4">Log in with your broker ID to manage or upgrade your plan.</p>
          <Link href="/broker-register" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90">
            Register as Broker
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
