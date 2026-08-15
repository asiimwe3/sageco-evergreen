import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌿</span>
            <span className="font-extrabold text-white text-lg">SAGECO EVERGREEN</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">Premier real estate platform in Uganda — homes, commercial spaces, and eco-friendly land.</p>
          <div className="mt-4 space-y-1 text-sm">
            <p>📍 Kyenjojo, Uganda</p>
            <p>📞 <a href="tel:+256750414366" className="hover:text-white">0750 414 366</a></p>
            <p>📧 <a href="mailto:sagecoevergreen@gmail.com" className="hover:text-white">sagecoevergreen@gmail.com</a></p>
          </div>
          <div className="flex gap-3 mt-4">
            <a href="https://wa.me/256750414366" target="_blank" rel="noopener"
              className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold transition">WhatsApp</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[[["Become an Agent","/agents"],["Become a Broker","/broker-register"]Properties","/properties"],["Brokers","/brokers"],["Book a Viewing","/book"],["Plans","/plans"],["Projects","/projects"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* For Brokers */}
        <div>
          <h4 className="font-bold text-white mb-3">For Brokers</h4>
          <ul className="space-y-2 text-sm">
            {[[["Become an Agent","/agents"],["Become a Broker","/broker-register"]Become a Broker","/broker-register"],["Broker Plans","/plans"],["Broker Login","/login"],["Upload Property","/upload-property"],["FAQ","/faq"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-bold text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            {[[["Become an Agent","/agents"],["Become a Broker","/broker-register"]About Us","/projects"],["Careers","/careers"],["Contact","/contact"],["FAQ","/faq"],["Android App","/android"]].map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Mon–Sat · 8 AM – 6 PM EAT</p>
            <Link href="/book" className="inline-block bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:opacity-90">Book a Viewing →</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <p>© {year} SAGECO EVERGREEN CO. LTD — All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/faq" className="hover:text-gray-300">FAQ</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          <Link href="/docs" className="hover:text-gray-300">Docs</Link>
        </div>
      </div>
    </footer>
  )
}
