import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import SEO from '../components/SEO'

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Land', 'Plot', 'Green Project']
const PAGE_SIZE = 12

export default function Properties({ initialProperties, initialTotal }) {
  const [properties, setProperties] = useState(initialProperties || [])
  const [total, setTotal] = useState(initialTotal || 0)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const fetchProperties = useCallback(async (reset = true, currentOffset = 0) => {
    if (reset) setLoading(true)
    else setLoadingMore(true)

    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(currentOffset),
        sort: sortBy,
      })
      if (filter !== 'All') params.set('category', filter)
      if (search)           params.set('search', search)
      if (priceRange.min)   params.set('min_price', priceRange.min)
      if (priceRange.max)   params.set('max_price', priceRange.max)

      const res  = await fetch(`/api/get-properties?${params}`)
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()

      const list = data.properties || []
      if (reset) {
        setProperties(list)
        setOffset(PAGE_SIZE)
      } else {
        setProperties(prev => [...prev, ...list])
        setOffset(prev => prev + PAGE_SIZE)
      }
      setTotal(data.total || 0)
      setHasMore(data.hasMore || false)
    } catch (err) {
      
      if (reset) setProperties([])
    }

    if (reset) setLoading(false)
    else setLoadingMore(false)
  }, [filter, search, sortBy, priceRange])

  // Re-fetch on filter/sort/search change (always reset)
  useEffect(() => { fetchProperties(true, 0) }, [filter, search, sortBy, priceRange])

  const handleSearch = e => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const clearAll = () => {
    setFilter('All')
    setSearch('')
    setSearchInput('')
    setSortBy('newest')
    setPriceRange({ min: '', max: '' })
  }

  return (
    <>
      <SEO
        title="Properties for Sale in Uganda"
        description="Browse verified land, homes, and commercial properties for sale across Uganda. Filter by location, price, and type. Kyenjojo, Kampala, and more."
        keywords="properties for sale Uganda, land for sale Uganda, houses for sale Kampala, commercial property Uganda, plots for sale Kyenjojo"
        path="/properties"
        breadcrumbs={[{"name": "Home", "path": "/"}, {"name": "Properties", "path": "/properties"}]}
      />

      {/* Hero */}
      <section className="bg-primary text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Our Properties</h1>
        <p className="text-green-100">
          {total > 0 ? `${total.toLocaleString()} verified listing${total !== 1 ? 's' : ''}` : 'Browse verified listings'} across Uganda
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by title, location, or description..."
            className="flex-1 border rounded-full px-5 py-2.5 focus:ring-2 focus:ring-primary outline-none text-sm"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90">
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput('') }}
              className="text-gray-400 hover:text-gray-600 px-3 text-sm">
              Clear
            </button>
          )}
        </form>

        {/* Category filter + Sort */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full font-medium border text-sm transition ${
                  filter === c ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-600 hover:border-primary'
                }`}>
                {c}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="border rounded-full px-3 py-1.5 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Price range — server-side filter */}
        <div className="flex gap-3 items-center mb-6 flex-wrap">
          <span className="text-sm text-gray-500 font-medium">Price (UGX):</span>
          <input type="number" placeholder="Min" value={priceRange.min}
            onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
            className="border rounded-lg px-3 py-1.5 text-sm w-32 outline-none focus:ring-1 focus:ring-primary" />
          <span className="text-gray-400">–</span>
          <input type="number" placeholder="Max" value={priceRange.max}
            onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
            className="border rounded-lg px-3 py-1.5 text-sm w-32 outline-none focus:ring-1 focus:ring-primary" />
          {(priceRange.min || priceRange.max) && (
            <button onClick={() => setPriceRange({ min: '', max: '' })} className="text-xs text-gray-400 hover:text-primary">Clear</button>
          )}
        </div>

        {/* List CTA */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-primary">Are you a property owner?</p>
            <p className="text-gray-500 text-sm">List your property on SAGECO EVERGREEN for free</p>
          </div>
          <Link href="/upload-property" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90">
            List Property
          </Link>
        </div>

        {/* Results count + clear */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              {total.toLocaleString()} propert{total === 1 ? 'y' : 'ies'} found
              {search ? ` for "${search}"` : ''}
              {filter !== 'All' ? ` in ${filter}` : ''}
            </p>
            {(search || filter !== 'All' || priceRange.min || priceRange.max) && (
              <button onClick={clearAll} className="text-xs text-primary hover:underline font-medium">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏡</div>
            <p className="text-gray-500 text-lg">
              No properties found{search ? ` matching "${search}"` : filter !== 'All' ? ` in ${filter}` : ''}.
            </p>
            <button onClick={clearAll} className="mt-4 text-primary font-bold hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
                <Link key={p.id} href={`/property/${p.id}`}
                  className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 duration-200">
                  <div className="relative">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-48 bg-green-100 flex items-center justify-center text-5xl">🏡</div>
                    )}
                    {p.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        ⭐ Featured
                      </div>
                    )}
                    {p.images?.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                        📷 {p.images.length}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-green-100 text-primary px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                      {p.is_negotiable && <span className="text-xs text-green-600 font-medium">Negotiable</span>}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 min-h-[40px]">{p.title}</h3>
                    <p className="text-gray-400 text-xs mt-1 mb-2">📍 {p.location}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-primary font-bold text-base">
                        {p.price > 0 ? `UGX ${Number(p.price).toLocaleString()}` : 'Contact for Price'}
                      </p>
                      {(p.bedrooms || p.bathrooms) && (
                        <p className="text-gray-400 text-xs">
                          {p.bedrooms ? `${p.bedrooms}🛏 ` : ''}{p.bathrooms ? `${p.bathrooms}🚿` : ''}
                        </p>
                      )}
                    </div>
                    {p.views > 0 && (
                      <p className="text-gray-300 text-xs mt-1">👁 {p.views} view{p.views !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => fetchProperties(false, offset)}
                  disabled={loadingMore}
                  className="bg-primary text-white px-10 py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-50 transition">
                  {loadingMore ? 'Loading...' : `Load More (${total - properties.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}


// ISR: Pre-render first page of properties at build time
export async function getStaticProps() {
  const { SUPA_URL, SUPA_KEY } = await import('../lib/supabaseAdmin.js')

  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/properties?select=id,title,description,location,price,category,images,featured,bedrooms,bathrooms,area_sqft,status&status=eq.available&limit=12&order=featured.desc&order=created_at.desc`, {
      headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` },
    })
    const data = await res.json()
    // Ensure data is an array (Supabase returns error object on failure)
    const properties = Array.isArray(data) ? data : []
    return {
      props: { initialProperties: properties, initialTotal: properties.length },
      revalidate: 60,
    }
  } catch {
    return { props: { initialProperties: [], initialTotal: 0 }, revalidate: 60 }
  }
}
