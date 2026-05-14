import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-2">🌿 SAGECO EVERGREEN</h3>
          <p className="text-green-200 text-sm">Premium real estate with a green conscience. Building Uganda's future, one property at a time.</p>
          <p className="text-green-300 text-sm mt-3">📍 Kyenjojo, Uganda</p>
          <a
            href="https://twitter.com/PropertyMasterUg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary text-sm hover:underline mt-1 inline-block"
          >@PropertyMasterUg</a>
        </div>
        <div>
          <h4 className="font-bold mb-3">Quick Links</h4>
          <div className="space-y-2">
            {[["/" , "Home"], ["/properties", "Properties"], ["/brokers", "Brokers"], ["/contact", "Contact"]].map(([href, label]) => (
              <Link key={href} href={href} className="block text-green-200 hover:text-white text-sm">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-3">Contact</h4>
          <a href="mailto:sagecoevergreen@gmail.com" className="block text-green-200 hover:text-white text-sm">📧 sagecoevergreen@gmail.com</a>
          <a href="tel:+256750414366" className="block text-green-200 hover:text-white text-sm mt-1">📞 +256 750 414 366</a>
          <a href="tel:+256782067425" className="block text-green-200 hover:text-white text-sm mt-1">📞 +256 782 067 425</a>
          <a href="tel:+256772002326" className="block text-green-200 hover:text-white text-sm mt-1">📞 +256 772 002 326</a>
          <a href="https://wa.me/256750414366" target="_blank" rel="noopener noreferrer" className="block text-green-200 hover:text-white text-sm mt-1">💬 WhatsApp Us</a>
        </div>
      </div>
      <div className="text-center text-green-300 text-sm mt-8 border-t border-green-700 pt-6">
        © {new Date().getFullYear()} SAGECO EVERGREEN CO.LTD. All rights reserved.
      </div>
    </footer>
  )
}
