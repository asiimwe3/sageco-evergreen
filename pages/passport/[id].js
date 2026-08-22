import Link from "next/link"
import SEO from '../components/SEO'

export default function Passport({ passport, property }) {
  if (!passport) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-400 text-xl mb-4">Passport not found</p>
        <Link href="/passports" className="text-green-700 hover:underline">← Back to Passports</Link>
      </div>
    </div>
  )

  return (
    <>
      <SEO
        title="Land Passport"
        description="Digital land passport with GPS boundaries and ownership history."
        keywords="land passport, digital property record, GPS boundary"
        path="/passports"
        noindex
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="border-2 border-green-700 rounded-xl p-8 bg-white shadow-lg">
            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">S</div>
                <div>
                  <div className="font-bold text-xl text-green-700">SAGECO EVERGREEN</div>
                  <div className="text-sm text-gray-500">Digital Land Passport</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Passport ID</div>
                <div className="font-mono text-sm text-gray-700">{passport.passport_id}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{property?.title || 'Property'}</h2>
                <p className="text-gray-500 text-sm">{property?.location}</p>
                <p className="text-gray-500 text-sm">UGX {property ? Number(property.price).toLocaleString() : 'N/A'}</p>
                <p className="text-gray-500 text-sm">Category: {property?.category}</p>
              </div>
              <div>
                <div className="text-sm"><span className="text-gray-400">GPS:</span> <span className="font-mono text-gray-700">{passport.gps_coordinates || 'N/A'}</span></div>
                <div className="text-sm"><span className="text-gray-400">Area:</span> <span className="text-gray-700">{passport.area_measured ? `${passport.area_measured} acres` : 'N/A'}</span></div>
                <div className="text-sm"><span className="text-gray-400">Survey Date:</span> <span className="text-gray-700">{passport.survey_date || 'N/A'}</span></div>
                <div className="text-sm"><span className="text-gray-400">Status:</span>
                  <span className="bg-green-700 text-white px-2 py-0.5 rounded-full text-xs font-bold ml-1">{passport.status}</span>
                </div>
              </div>
            </div>

            {passport.drone_images?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Drone Imagery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {passport.drone_images.map((img, i) => (
                    <img key={i} src={img} alt={`Drone ${i+1}`} className="rounded-lg w-full h-32 object-cover" />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-3">Ownership History</h3>
              <div className="space-y-2">
                {(passport.ownership_history || []).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                    <div>
                      <div className="font-bold text-sm text-gray-700">{h.owner || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{h.type} — {h.date ? new Date(h.date).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-green-100 pt-6 flex items-center justify-between">
              <div>
                <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold">✓ Verified by SAGECO EVERGREEN</span>
              </div>
              <div className="text-xs text-gray-400">Issued: {passport.issued_at ? new Date(passport.issued_at).toLocaleDateString() : 'N/A'}</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/passports" className="text-green-700 hover:underline">← Back to Passports</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { supabaseAdmin } = await import('../../lib/supabaseAdmin.js')
  const { data: passport } = await supabaseAdmin
    .from('land_passports')
    .select('*')
    .eq('passport_id', params.id)
    .single()

  let property = null
  if (passport?.property_id) {
    const { data: prop } = await supabaseAdmin.from('properties').select('*').eq('id', passport.property_id).single()
    property = prop
  }

  return { props: { passport, property } }
}