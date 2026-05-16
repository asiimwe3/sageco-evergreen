import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function UploadProperty() {
  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '',
    category: 'Residential', bedrooms: '', bathrooms: '', area_sqft: ''
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState([]) // per-file progress 0-100
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')

    const urls = []
    const newPreviews = []
    const progressArr = new Array(files.length).fill(0)
    setUploadProgress(progressArr)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      newPreviews.push(URL.createObjectURL(file))
      setPreviews(prev => [...prev, URL.createObjectURL(file)])

      // Simulate progress while reading
      setUploadProgress(prev => { const a = [...prev]; a[i] = 20; return a })

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setUploadProgress(prev => { const a = [...prev]; a[i] = 50; return a })

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, fileName: file.name, bucket: 'property-images' })
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

    const res = await fetch('/api/add-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, images })
    })
    const data = await res.json()
    if (!res.ok) { setError('Failed to submit: ' + (data.error || 'Unknown error')); return }
    setSuccess(true)
  }

  if (success) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-primary mb-2">Property Listed!</h2>
          <p className="text-gray-500 mb-6">Your property has been submitted and will appear in our listings.</p>
          <a href="/properties" className="bg-primary text-white px-8 py-3 rounded-full font-bold">View Properties</a>
        </div>
      </div>
      <Footer />
    </>
  )

  const totalFiles = uploadProgress.length
  const overallPercent = totalFiles > 0
    ? Math.round(uploadProgress.reduce((a, b) => a + b, 0) / totalFiles)
    : 0

  return (
    <>
      <Head><title>List a Property | SAGECO EVERGREEN</title></Head>
      <Navbar />
      <section className="bg-primary text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold">List Your Property</h1>
        <p className="text-green-100 mt-2">Reach thousands of buyers and renters across Uganda</p>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Property Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 3 Bedroom House in Kololo"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary">
                {['Residential','Commercial','Land','Green Project'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (UGX) *</label>
                <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="e.g. 150000000"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location *</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Kampala, Kololo"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Area (sqft)</label>
                <input name="area_sqft" value={form.area_sqft} onChange={handleChange} type="number" placeholder="1200"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="Describe the property..."
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" />
            </div>

            {/* Image Upload with Progress */}
            <div>
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
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${overallPercent}%` }}
                    />
                  </div>
                  {uploadProgress.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-20 truncate">Image {i + 1}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-green-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${p}%` }} />
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
      <Footer />
    </>
  )
}
