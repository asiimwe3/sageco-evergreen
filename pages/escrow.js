import Link from "next/link"
import SEO from '../components/SEO'

export default function Escrow() {
  return (
    <>
      <SEO
        title="Programmable Escrow - Secure Property Transactions"
        description="SAGECO EVERGREEN programmable escrow: milestone-based fund release with GPS-verified site visits. Secure your property transactions in Uganda."
        keywords="escrow Uganda, property escrow service, secure real estate transactions Uganda, milestone payment property"
        path="/escrow"
      />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔒 Programmable Escrow</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Secure milestone-based fund release with GPS-verified site visits. Powered by MTN MoMo and Airtel Money.</p>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "🔐", title: "Milestone-Based Release", desc: "Funds are released in stages as milestones are met — survey, site visit, title transfer, final payment." },
              { icon: "📍", title: "GPS-Verified Site Visits", desc: "Each milestone site visit is GPS-verified to ensure the buyer physically visited the property." },
              { icon: "💰", title: "MoMo & Card Support", desc: "Pay via MTN Mobile Money, Airtel Money, or bank card. All secured through PesaPal." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-6">How Escrow Works</h2>
            <div className="space-y-4">
              {[
                { title: "1. Create Escrow", desc: "Buyer and seller agree on milestones and payment amounts for each stage." },
                { title: "2. Fund Deposit", desc: "Buyer deposits total amount into escrow via MTN MoMo, Airtel Money, or card." },
                { title: "3. Milestone Verification", desc: "Each milestone is verified — site visit with GPS check-in, document review, title confirmation." },
                { title: "4. Milestone Release", desc: "Upon verification, the milestone amount is released to the seller." },
                { title: "5. Completion", desc: "When all milestones are met, escrow is marked complete and the transaction is finalized." },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="bg-green-100 text-green-700 font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">{i + 1}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{step.title}</h4>
                    <p className="text-gray-500 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">Ready to use escrow?</h3>
            <p className="text-gray-600 mb-4">Contact us to set up a programmable escrow for your property transaction.</p>
            <Link href="/contact" className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800">Get Started</Link>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-green-700 font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}