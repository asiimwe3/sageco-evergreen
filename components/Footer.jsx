export default function Footer() {
  return (
    <footer className="bg-dark text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-secondary font-bold text-lg mb-2">SAGECO EVERGREEN</h3>
          <p className="text-gray-400 text-sm">Your premier destination for real estate listings, connecting you with top brokers and sustainable projects.</p>
        </div>
        <div>
          <h4 className="font-bold mb-2">Quick Links</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li><a href="/properties" className="hover:text-secondary">Properties</a></li>
            <li><a href="/brokers" className="hover:text-secondary">Brokers</a></li>
            <li><a href="/projects" className="hover:text-secondary">Green Projects</a></li>
            <li><a href="/careers" className="hover:text-secondary">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2">Contact</h4>
          <p className="text-gray-400 text-sm">info@sagecoevergreen.com</p>
          <p className="text-gray-400 text-sm">+256 700 000 000</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-8">© 2026 SAGECO EVERGREEN. All rights reserved.</div>
    </footer>
  )
}
