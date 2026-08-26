import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About — no logo (navbar already has it) */}
        <div>
          <p className="font-extrabold text-white text-lg mb-3">SAGECO <span className="text-green-400 text-sm font-semibold tracking-widest">EVERGREEN</span></p>
          <p className="text-base text-gray-400 leading-relaxed mb-5">Uganda's trusted real estate platform — land, homes, and commercial properties with a green future. Serving Kyenjojo, Kampala, and all of Uganda.</p>
          <div className="space-y-2 text-base">
            <p className="flex items-center gap-2">📍 Kyenjojo, Western Uganda</p>
            <p className="flex items-center gap-2">📞 <a href="tel:+256750414366" className="hover:text-white font-semibold">0750 414 366</a></p>
            <p className="flex items-center gap-2">📧 <a href="mailto:sagecoevergreen@gmail.com" className="hover:text-white">sagecoevergreen@gmail.com</a></p>
          </div>
          <div className="flex gap-3 mt-5">
            <a href="https://wa.me/256750414366" target="_blank" rel="noopener"
              className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
          <ul className="space-y-3 text-base">
            {[["Properties","/properties"],["Brokers","/brokers"],["Book a Viewing","/book"],["Plans & Pricing","/plans"],["Projects","/projects"],["Invest","/invest"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* For Brokers */}
        <div>
          <h4 className="font-bold text-white mb-4 text-lg">For Brokers</h4>
          <ul className="space-y-3 text-base">
            {[["Become an Agent","/agents"],["Register as Broker","/broker-register"],["Broker Plans","/plans"],["Broker Login","/login"],["Upload Property","/upload-property"],["FAQ","/faq"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company + Payment methods */}
        <div>
          <h4 className="font-bold text-white mb-4 text-lg">Company</h4>
          <ul className="space-y-3 text-base">
            {[["About Us","/projects"],["Careers","/careers"],["Contact","/contact"],["FAQ","/faq"],["Android App","/android"],["Docs","/docs"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
          <div className="mt-5">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Mon–Sat · 8 AM – 6 PM EAT</p>
            <Link href="/book" className="inline-block bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition shadow-md">Book a Viewing →</Link>
          </div>
          {/* Payment methods — local focus */}
          <div className="mt-5">
            <p className="text-sm text-gray-500 mb-2 font-semibold">We Accept:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold">MTN MoMo</span>
              <span className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Airtel Money</span>
              <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Card</span>
              <span className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold">PesaPal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {year} SAGECO EVERGREEN CO. LTD — All rights reserved.</p>
        <p className="text-xs text-gray-600 mt-1">Built by <a href="https://derycode.publicvm.com" target="_blank" rel="noopener" className="text-gray-400 hover:text-white font-semibold">DeryCode Technologies</a></p>
        <div className="flex gap-5">
          <Link href="/faq" className="hover:text-gray-300">FAQ</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          <Link href="/docs" className="hover:text-gray-300">Docs</Link>
        </div>
      </div>
    </footer>
  )
}
