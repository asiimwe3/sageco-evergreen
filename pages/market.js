import { useState, useEffect } from 'react';
import Head from 'next/head';

// ---------- Mock data (swap with Supabase queries later) ----------
const CATEGORIES = [
  { id: 'crops', label: 'Crops', icon: '🌾' },
  { id: 'inputs', label: 'Farm Inputs', icon: '🧪' },
  { id: 'loans', label: 'Loans', icon: '💰' },
  { id: 'sacco', label: 'SACCO', icon: '🤝' },
  { id: 'equipment', label: 'Equipment', icon: '🚜' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
];

const BANNERS = [
  { id: 1, title: 'Fresh Farm Inputs', subtitle: 'Up to 20% off seeds & fertilizer', bg: 'from-primary to-green-700' },
  { id: 2, title: 'SACCO Loans Open', subtitle: 'Apply in minutes, low interest', bg: 'from-secondary to-yellow-500' },
  { id: 3, title: 'Weather Alert', subtitle: 'Rain expected in Kyenjojo this week', bg: 'from-blue-600 to-blue-800' },
];

const PRODUCTS = [
  { id: 1, name: 'Hybrid Maize Seed (5kg)', price: 'UGX 45,000', location: 'Kyenjojo', seller: 'AgroSupply Co.', img: 'https://images.unsplash.com/photo-1601472543223-2f81eb3c73c1?q=80&w=400&auto=format&fit=crop' },
  { id: 2, name: 'NPK Fertilizer (50kg)', price: 'UGX 120,000', location: 'Fort Portal', seller: 'GreenGrow Ltd', img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400&auto=format&fit=crop' },
  { id: 3, name: 'Matooke Bunch (Fresh)', price: 'UGX 15,000', location: 'Kyenjojo', seller: 'Mukisa Farm', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&auto=format&fit=crop' },
  { id: 4, name: 'Knapsack Sprayer 16L', price: 'UGX 85,000', location: 'Kabarole', seller: 'FarmTools UG', img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=400&auto=format&fit=crop' },
  { id: 5, name: 'Coffee Beans (Grade A)', price: 'UGX 9,500/kg', location: 'Kyenjojo', seller: 'Highland Coffee', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=400&auto=format&fit=crop' },
  { id: 6, name: 'Irrigation Pipe Kit', price: 'UGX 210,000', location: 'Kamwenge', seller: 'IrrigateUG', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=400&auto=format&fit=crop' },
];

const NEARBY = PRODUCTS.slice(0, 4);
const RECOMMENDED = PRODUCTS.slice(2);

// ---------- Small UI helpers ----------
function SkeletonCard() {
  return (
    <div className="min-w-[160px] w-40 animate-pulse">
      <div className="h-28 bg-gray-200 rounded-xl mb-2" />
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

function ProductCard({ p }) {
  return (
    <div className="min-w-[160px] w-40 bg-white rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 overflow-hidden border border-gray-100">
      <div className="h-28 w-full overflow-hidden bg-gray-100">
        <img src={p.img} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-dark leading-snug line-clamp-2 min-h-[2rem]">{p.name}</p>
        <p className="text-primary font-bold text-sm mt-1">{p.price}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">📍 {p.location}</p>
        <p className="text-[11px] text-gray-400 truncate">{p.seller}</p>
      </div>
    </div>
  );
}

function HorizontalSection({ title, items, loading }) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-base font-semibold text-dark">{title}</h2>
        <button className="text-xs text-primary font-medium active:opacity-60">See all</button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="snap-start"><SkeletonCard /></div>)
          : items.map((p) => <div key={p.id} className="snap-start"><ProductCard p={p} /></div>)}
      </div>
    </section>
  );
}

export default function Market() {
  const [loading, setLoading] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('market');
  const [cartCount] = useState(2);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerIndex((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Head>
        <title>Market | Sageco Evergreen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        {/* ---------- Sticky Header ---------- */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2">
              <span className="text-gray-400 mr-2">🔍</span>
              <input
                type="text"
                placeholder="Search crops, inputs, services…"
                className="bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
              />
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors">
              <span className="text-lg">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2.5 h-2.5 rounded-full" />
            </button>
          </div>
        </header>

        {/* ---------- Banner Slider ---------- */}
        <section className="px-4 mt-3">
          <div className="relative h-32 rounded-2xl overflow-hidden shadow-md">
            {BANNERS.map((b, i) => (
              <div
                key={b.id}
                className={`absolute inset-0 bg-gradient-to-br ${b.bg} flex flex-col justify-center px-5 transition-opacity duration-700 ${
                  i === bannerIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-white font-bold text-lg leading-tight">{b.title}</p>
                <p className="text-white/90 text-xs mt-1">{b.subtitle}</p>
              </div>
            ))}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {BANNERS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === bannerIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Categories Grid ---------- */}
        <section className="px-4 mt-5">
          <h2 className="text-base font-semibold text-dark mb-3">Categories</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className="flex flex-col items-center justify-center bg-white rounded-xl py-3 shadow-sm active:scale-95 active:bg-gray-50 transition-all"
              >
                <span className="text-2xl mb-1">{c.icon}</span>
                <span className="text-[11px] font-medium text-dark">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ---------- Horizontal Sections ---------- */}
        <HorizontalSection title="Featured Products" items={PRODUCTS} loading={loading} />
        <HorizontalSection title="Recommended for You" items={RECOMMENDED} loading={loading} />
        <HorizontalSection title="Nearby Listings" items={NEARBY} loading={loading} />

        {/* ---------- Main Product Feed ---------- */}
        <section className="mt-6 px-4">
          <h2 className="text-base font-semibold text-dark mb-3">All Listings</h2>
          <div className="flex flex-col gap-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 flex gap-3 shadow-sm animate-pulse">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))
              : PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-3 flex gap-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark truncate">{p.name}</p>
                      <p className="text-primary font-bold mt-0.5">{p.price}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                        <span>📍 {p.location}</span>
                        <span>•</span>
                        <span className="truncate">{p.seller}</span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* ---------- Bottom Navigation ---------- */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] z-30">
          <div className="flex justify-around items-center py-2">
            {[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'market', label: 'Market', icon: '🛍️' },
              { id: 'sacco', label: 'SACCO', icon: '🤝' },
              { id: 'orders', label: 'Orders', icon: '📦' },
              { id: 'profile', label: 'Profile', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1 active:scale-90 transition-transform"
              >
                <span className={`text-xl ${activeTab === tab.id ? '' : 'grayscale opacity-60'}`}>{tab.icon}</span>
                <span className={`text-[10px] font-medium ${activeTab === tab.id ? 'text-primary' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
