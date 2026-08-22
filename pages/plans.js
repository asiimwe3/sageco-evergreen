import Head from "next/head"
import Link from "next/link"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sageco-evergreen-rho.vercel.app"

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    duration: null,
    color: "border-gray-200",
    badge: "",
    features: [
      "List up to 3 properties",
      "Basic broker profile",
      "Email support",
      "No expiry",
    ],
    cta: "Get Started Free",
    ctaHref: "/broker-register",
  },
  {
    id: "basic",
    name: "Basic",
    price: 15000,
    duration: 1,
    color: "border-blue-300",
    badge: "",
    features: [
      "List up to 10 properties",
      "Standard broker profile",
      "Email support",
      "1 month access",
    ],
    cta: "Get Basic",
    ctaHref: "/subscribe?plan=basic",
  },
  {
    id: "pro",
    name: "Pro",
    price: 25000,
    duration: 1,
    color: "border-primary",
    badge: "Most Popular",
    features: [
      "List up to 50 properties",
      "Featured broker profile",
      "Priority property placement",
      "WhatsApp contact badge",
      "1 month access",
    ],
    cta: "Get Pro",
    ctaHref: "/subscribe?plan=pro",
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
    cta: "Get Premium",
    ctaHref: "/subscribe?plan=premium",
  },
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

      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Broker Subscription Plans</h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto">
          Join SAGECO EVERGREEN as a verified broker. List properties, get leads, and grow your real estate business.
        </p>
      </section>

      {/* Plan comparison table */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 font-semibold">
                <th className="py-3 px-4 text-left">Feature</th>
                <th className="py-3 px-4">Free</th>
                <th className="py-3 px-4">Basic</th>
                <th className="py-3 px-4">Pro</th>
                <th className="py-3 px-4">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Properties", "3", "10", "50", "Unlimited"],
                ["Profile type", "Basic", "Standard", "Featured", "Top Verified"],
                ["Search placement", "Normal", "Normal", "Priority", "Top"],
                ["WhatsApp badge", "✗", "✗", "✓", "✓"],
                ["Support", "Email", "Email", "Email", "Priority"],
                ["Duration", "No expiry", "1 month", "1 month", "1 month"],
              ].map(([feature, ...vals], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-4 text-left font-medium text-gray-700">{feature}</td>
                  {vals.map((v, j) => (
                    <td key={j} className={`py-3 px-4 ${v === "✓" ? "text-green-600 font-bold" : v === "✗" ? "text-gray-300" : "text-gray-700"}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={`bg-white rounded-2xl shadow-md border-2 ${plan.color} p-7 flex flex-col relative`}>
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{plan.name}</h2>
              <div className="mb-5">
                {plan.price === 0 ? (
                  <span className="text-4xl font-extrabold text-green-600">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-extrabold text-primary">UGX {plan.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm ml-1">/month</span>
                  </>
                )}
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
                href={plan.ctaHref}
                className={`block text-center py-3 rounded-full font-bold transition ${
                  plan.id === "premium"
                    ? "bg-yellow-400 text-gray-900 hover:opacity-90"
                    : plan.id === "pro"
                    ? "bg-primary text-white hover:opacity-90"
                    : plan.id === "basic"
                    ? "bg-blue-600 text-white hover:opacity-90"
                    : "border-2 border-green-600 text-green-700 hover:bg-green-50"
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
    </>
  )
}
