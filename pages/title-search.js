import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TitleSearchPage() {
  const [searchType, setSearchType] = useState('title_number')
  const [searchValue, setSearchValue] = useState('')
  const [district, setDistrict] = useState('')
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const ugandaDistricts = [
    'Kampala', 'Wakiso', 'Mukono', 'Jinja', 'Mbale', 'Mbarara', 'Gulu',
    'Lira', 'Masaka', 'Hoima', 'Fort Portal', 'Kabarole', 'Kasese', 'Kamuli',
    'Luweero', 'Mpigi', 'Mubende', 'Nakasongola', 'Rakai', 'Ssembabule',
    'Bushenyi', 'Ntungamo', 'Kabale', 'Rukungiri', 'Kisoro', 'Kanungu',
    'Pallisa', 'Tororo', 'Bugiri', 'Iganga', 'Kamuli', 'Soroti', 'Kumi',
    'Lira', 'Apac', 'Dokolo', 'Amolatar', 'Arua', 'Nebbi', 'Koboko',
    'Yumbe', 'Adjumani', 'Moyo', 'Gulu', 'Kitgum', 'Pader', 'Lamwo',
  ]

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchValue.trim()) {
      setError('Please enter a search value')
      return
    }
    setSearching(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/title/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          search_type: searchType,
          search_value: searchValue,
          district: district || null,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        setResult(data)
        setHistory(prev => [{
          id: Date.now(),
          search_type: searchType,
          search_value: searchValue,
          timestamp: new Date().toISOString(),
          status: data.status || 'found',
        }, ...prev.slice(0, 9)])
      } else {
        setError(data.error || 'Search failed')
        if (data.official_url) {
          setResult({ official_url: data.official_url, manual: true })
        }
      }
    } catch (err) {
      setError('Could not connect to search service')
    }
    setSearching(false)
  }

  return (
    <>
      <Head>
        <title>Land Title Search &mdash; SageCo Evergreen</title>
        <meta name="description" content="Search Uganda land titles and verify property ownership through the official land registry." />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Land Title Search</h1>
            <p className="text-gray-600 mt-2">
              Verify land ownership and title status through the Uganda Ministry of Lands registry. Search by title number, plot reference, or owner name.
            </p>
          </div>

          {/* Search form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search By</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="title_number">Title Number</option>
                  <option value="plot_reference">Plot Reference</option>
                  <option value="owner_name">Owner Name</option>
                  <option value="registration_number">Registration Number</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Value</label>
                <input
                  type="text"
                  placeholder={searchType === 'title_number' ? 'e.g. LT 12345 / KB 6789' : 'Enter search value...'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">District (optional)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All districts</option>
                {ugandaDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSearch}
              disabled={searching || !searchValue.trim()}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? 'Searching land registry...' : 'Search Title'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !result.manual && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                {result.status === 'found' || result.verified ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">VERIFIED</span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">PENDING VERIFICATION</span>
                )}
              </div>

              {result.title_info && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Title Details</h3>
                    <dl className="space-y-1.5 text-sm">
                      {result.title_info.title_number && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Title Number</dt>
                          <dd className="font-medium">{result.title_info.title_number}</dd>
                        </div>
                      )}
                      {result.title_info.plot_reference && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Plot Reference</dt>
                          <dd className="font-medium">{result.title_info.plot_reference}</dd>
                        </div>
                      )}
                      {result.title_info.registration_number && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Registration Number</dt>
                          <dd className="font-medium">{result.title_info.registration_number}</dd>
                        </div>
                      )}
                      {result.title_info.district && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">District</dt>
                          <dd className="font-medium">{result.title_info.district}</dd>
                        </div>
                      )}
                      {result.title_info.area && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Area</dt>
                          <dd className="font-medium">{result.title_info.area}</dd>
                        </div>
                      )}
                      {result.title_info.title_status && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Title Status</dt>
                          <dd className="font-medium">{result.title_info.title_status}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Ownership</h3>
                    <dl className="space-y-1.5 text-sm">
                      {result.title_info.owner_name && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Registered Owner</dt>
                          <dd className="font-medium">{result.title_info.owner_name}</dd>
                        </div>
                      )}
                      {result.title_info.tenure_type && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Tenure Type</dt>
                          <dd className="font-medium">{result.title_info.tenure_type}</dd>
                        </div>
                      )}
                      {result.title_info.registration_date && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Registered</dt>
                          <dd className="font-medium">{result.title_info.registration_date}</dd>
                        </div>
                      )}
                      {result.title_info.encumbrances && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Encumbrances</dt>
                          <dd className="font-medium">{result.title_info.encumbrances}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}

              {result.title_info?.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{result.title_info.notes}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 flex-wrap">
                <Link href="/gps-measure" className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-100 transition">
                  Measure this land with GPS
                </Link>
                {result.search_id && (
                  <span className="text-xs text-gray-500 px-3 py-1.5">
                    Search ref: {result.search_id}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Manual fallback */}
          {result?.manual && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">Direct Portal Search</h3>
              <p className="text-sm text-amber-700 mb-3">
                The automated search could not complete. You can search directly on the official Uganda Ministry of Lands portal:
              </p>
              <a
                href={result.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition"
              >
                Open MLHUD Portal &rarr;
              </a>
            </div>
          )}

          {/* Search history */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Searches</h3>
              <div className="space-y-2">
                {history.map(h => (
                  <div key={h.id} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 capitalize">{h.search_type.replace('_', ' ')}</span>
                      <span className="font-medium text-gray-800">{h.search_value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {h.status === 'found' ? (
                        <span className="text-xs text-green-600">Found</span>
                      ) : (
                        <span className="text-xs text-yellow-600">Pending</span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(h.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">About Land Title Search</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Land title verification in Uganda is managed by the Ministry of Lands, Housing and Urban Development (MLHUD).
              A title search confirms registered ownership, tenure type (freehold, leasehold, mailo, customary),
              encumbrances (mortgages, caveats), and the exact land area on the title.
              Always verify titles before purchasing land. For official searches, visit the MLHUD office or use their
              official portal at <a href="https://www.mlhud.go.ug" target="_blank" rel="noopener noreferrer" className="underline">mlhud.go.ug</a>.
            </p>
          </div>

          {/* GPS measure link */}
          <div className="mt-4">
            <Link href="/gps-measure" className="block">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5 hover:shadow-md transition cursor-pointer">
                <h3 className="text-sm font-semibold text-green-900 mb-1">GPS Land Measuring</h3>
                <p className="text-xs text-green-700">
                  Measure land boundaries using GPS coordinates on an interactive satellite map.
                </p>
                <span className="text-xs text-green-600 font-medium mt-2 inline-block">Measure now &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
