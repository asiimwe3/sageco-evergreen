import { useState } from 'react'
import { compressImage, fileToBase64 } from '../lib/imageCompression'
import MapPicker from '../components/MapPicker'
import PricePredictor from '../components/PricePredictor'
import SEO from '../components/SEO'

const CATEGORIES = ['Residential', 'Commercial', 'Land', 'Plot', 'Green Project']

const RESIDENTIAL_TYPES = ['House', 'Apartment', 'Bungalow', 'Mansion', 'Townhouse', 'Duplex']
const COMMERCIAL_TYPES = ['Office', 'Shop', 'Warehouse', 'Factory', 'Hotel', 'Mixed Use']

export default function UploadProperty() {
  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '',
    category: 'Residential', sub_type: '',
    // Residential/Commercial
    bedrooms: '', bathrooms: '', area_sqft: '',
    floor_level: '',
    // Land/Plot
    land_acres: '', plot_feet: '',
    // Shared extras
    water_available: '', electricity_available: '',
    road_distance_km: '', fence: '', title_deed: '',
    is_negotiable: false,
    contact_name: '', contact_phone: ''
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [gps, setGps] = useState({ lat: null, lng: null, district: null })

  const isLand = form.category === 'Land'
  const isPlot = form.category === 'Plot'
  const isLandType = isLand || isPlot
  const isResidential = form.category === 'Residential'
  const isCommercial = form.category === 'Commercial'

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files).slice(0, 8)
    if (!files.length) return
    setUploading(true)
    setError('')

    const urls = []
    const progressArr = new Array(files.length).fill(0)
    setUploadProgress(progressArr)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) {
        setError('Please upload image files only.')
        continue
      }
      if (file.size > 12 * 1024 * 1024) {
        setError('Each image must be 12MB or smaller before compression.')
        continue
      }

      const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1200, quality: 0.78 })
      setPreviews(prev => [...prev, URL.createObjectURL(compressed)])
      setUploadProgress(prev => { const a = [...prev]; a[i] = 25; return a })

      const base64 = await fileToBase64(compressed)
      setUploadProgress(prev => { const a = [...prev]; a[i] = 55; return a })

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, fileName: compressed.name, bucket: 'property-images' })
      })
      const data = await res.json()
      setUploadProgress(prev => { const a = [...prev]; a[i] = 100; return a })
      if (data.url) urls.push(data.url)
      else setError('Image upload failed: ' + (data.error || 'Unknown error'))
    }
    setImages(prev => [...prev, ...urls])
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title || !form.price || !form.location) {
      setError('Please fill in all required fields.')
      return
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: form.price,
      location: form.location,
      category: form.category,
      sub_type: form.sub_type || null,
      images,
      // size fields
      bedrooms: isResidential || isCommercial ? form.bedrooms || null : null,
      bathrooms: isResidential || isCommercial ? form.bathrooms || null : null,
      area_sqft: !isLandType ? form.area_sqft || null : null,
      floor_level: isCommercial ? form.floor_level || null : null,
      land_acres: isLand ? form.land_acres || null : null,
      plot_feet: isPlot ? form.plot_feet || null : null,
      // extras
      water_available: form.water_available || null,
      electricity_available: form.electricity_available || null,
      road_distance_km: form.road_distance_km || null,
      fence: form.fence || null,
      title_deed: form.title_deed || null,
      is_negotiable: form.is_negotiable,
      contact_name: form.contact_name || null,
      contact_phone: form.contact_phone || null,
      gps_lat: gps.lat,
      gps_lng: gps.lng,
      gps_district: gps.district || null,
    }

    const res = await fetch('/api/add-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) { setError('Failed to submit: ' + (data.error || 'Unknown error')); return }
    setSuccess(true)
  }

  if (success) return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Property Listed!</h2>
          <p className="text-gray-500 mb-6">Your property has been submitted and will appear in listings shortly.</p>
          <div className="flex gap-3 justify-center">
            <a href="/properties" className="bg-primary text-white px-6 py-3 rounded-full font-bold">View Properties</a>
            <a href="/upload-property" className="border border-primary text-primary px-6 py-3 rounded-full font-bold">Add Another</a>
          </div>
        </div>
      </div>
    </>
  )

  const totalFiles = uploadProgress.length
  const overallPercent = totalFiles > 0
    ? Math.round(uploadProgress.reduce((a, b) => a + b, 0) / totalFiles) : 0

  const yesNoOptions = ['Yes', 'No', 'Nearby']

  return (
    <>
      <SEO
        title="Upload Property - List Your Land or Home"
        description="List your property on SAGECO EVERGREEN for free. Upload land, homes, or commercial spaces for sale across Uganda. Reach thousands of buyers."
        keywords="upload property Uganda, list property for sale, free property listing Uganda, sell land Uganda"
        path="/upload-property"
        noindex
      />
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold">List Your Property</h1>
        <p className="text-green-100 mt-2">Reach thousands of buyers and renters across Uganda</p>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Basic Info */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder={isLand ? "e.g. 2 Acres Land in Kyenjojo" : isPlot ? "e.g. 50x100ft Plot in Kampala" : "e.g. 3 Bedroom House in Kololo"}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <select name="sub_type" value={form.sub_type} onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                  <option value="">Select type...</option>
                  {isResidential && RESIDENTIAL_TYPES.map(t => <option key={t}>{t}</option>)}
                  {isCommercial && COMMERCIAL_TYPES.map(t => <option key={t}>{t}</option>)}
                  {isLand && ['Farmland', 'Forest Land', 'Swamp Land', 'Residential Land', 'Commercial Land'].map(t => <option key={t}>{t}</option>)}
                  {isPlot && ['Corner Plot', 'Road Front Plot', 'Residential Plot', 'Commercial Plot'].map(t => <option key={t}>{t}</option>)}
                  {form.category === 'Green Project' && ['Agro-forestry', 'Solar Farm', 'Eco Lodge', 'Nursery Bed'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (UGX) *</label>
                <input name="price" value={form.price} onChange={handleChange} type="number"
                  placeholder="e.g. 150000000"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location *</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Kyenjojo, Kampala"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
            </div>

            {/* GPS Location & Map */}
            <div className="border-t pt-5">
              <p className="text-sm font-bold text-gray-700 mb-1">📍 GPS Location & Map</p>
              <p className="text-xs text-gray-500 mb-3">Click on the map to set the exact property location. This enables AI price prediction.</p>
              <MapPicker
                lat={gps.lat}
                lng={gps.lng}
                onChange={(c) => setGps(prev => ({ ...prev, ...c }))}
                height={280}
              />
            </div>

            {/* AI Price Prediction */}
            <div className="border-t pt-5">
              <PricePredictor
                lat={gps.lat}
                lng={gps.lng}
                location={form.location}
                category={form.category}
                sub_type={form.sub_type}
                land_acres={form.land_acres}
                area_sqft={form.area_sqft}
                plot_feet={form.plot_feet}
                price={form.price}
                water_available={form.water_available}
                electricity_available={form.electricity_available}
                road_distance_km={form.road_distance_km}
                fence={form.fence}
                title_deed={form.title_deed}
              />
            </div>



            {/* Residential / Commercial Size Fields */}
            {(isResidential || isCommercial) && (
              <div className="grid grid-cols-3 gap-4">
                {isResidential && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Bedrooms</label>
                      <input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" placeholder="3"
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Bathrooms</label>
                      <input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" placeholder="2"
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Area (sqft)</label>
                  <input name="area_sqft" value={form.area_sqft} onChange={handleChange} type="number" placeholder="1200"
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
                {isCommercial && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Floor Level</label>
                    <input name="floor_level" value={form.floor_level} onChange={handleChange} placeholder="Ground / 1st"
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
                  </div>
                )}
              </div>
            )}

            {/* Land size in Acres */}
            {isLand && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Land Size (Acres) *</label>
                <input name="land_acres" value={form.land_acres} onChange={handleChange} type="number" step="0.01" placeholder="e.g. 2.5"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
            )}

            {/* Plot size in feet */}
            {isPlot && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Plot Size (feet) *</label>
                <input name="plot_feet" value={form.plot_feet} onChange={handleChange} placeholder="e.g. 50x100"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Describe the property..."
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
            </div>

            {/* ---- UTILITIES & EXTRAS ---- */}
            <div className="border-t pt-5">
              <p className="text-sm font-bold text-gray-700 mb-4">🔌 Utilities & Amenities</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Water Available?</label>
                  <select name="water_available" value={form.water_available} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">Select...</option>
                    {yesNoOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Electricity Available?</label>
                  <select name="electricity_available" value={form.electricity_available} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">Select...</option>
                    {yesNoOptions.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Distance from Main Road (km)</label>
                  <input name="road_distance_km" value={form.road_distance_km} onChange={handleChange}
                    type="number" step="0.1" placeholder="e.g. 0.5"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Fence / Wall?</label>
                  <select name="fence" value={form.fence} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">Select...</option>
                    {['Yes - Full', 'Yes - Partial', 'No'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Title Deed?</label>
                  <select name="title_deed" value={form.title_deed} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary">
                    <option value="">Select...</option>
                    {['Mailo Land Title', 'Freehold Title', 'Leasehold Title', 'Agreement Only', 'No Title Yet'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <input type="checkbox" name="is_negotiable" id="negotiable"
                    checked={form.is_negotiable} onChange={handleChange}
                    className="w-5 h-5 accent-green-700 rounded" />
                  <label htmlFor="negotiable" className="text-sm font-bold text-gray-600">Price is Negotiable</label>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-5">
              <p className="text-sm font-bold text-gray-700 mb-4">📞 Contact Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Contact Name</label>
                  <input name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="Your name"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Contact Phone</label>
                  <input name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="+256 700 000 000"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            {/* Images with progress */}
            <div className="border-t pt-5">
              <label className="block text-sm font-bold text-gray-700 mb-1">Property Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload}
                disabled={uploading}
                className="w-full border rounded-lg px-4 py-3 disabled:opacity-50" />
              {uploading && totalFiles > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading {totalFiles} image{totalFiles > 1 ? 's' : ''}...</span>
                    <span className="font-bold text-primary">{overallPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${overallPercent}%` }} />
                  </div>
                  {uploadProgress.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-16 truncate">Image {i + 1}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-green-400 h-1.5 rounded-full transition-all" style={{ width: `${p}%` }} />
                      </div>
                      <span className="w-8 text-right">{p}%</span>
                    </div>
                  ))}
                </div>
              )}
              {previews.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {previews.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`Preview ${i+1}`} className="w-24 h-24 object-cover rounded-lg border-2 border-green-200" />
                      {images[i]
                        ? <div className="absolute top-1 right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">✓</div>
                        : uploading && <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center text-white text-xs font-bold">{uploadProgress[i] || 0}%</div>
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={uploading}
              className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
              {uploading ? `Uploading images... (${overallPercent}%)` : 'Submit Property Listing'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
