import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

export default function UploadProperty() {
  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '',
    category: 'Residential', bedrooms: '', bathrooms: '', area_sqft: ''
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
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

    for (const file of files) {
      // Create local preview immediately
      const localUrl = URL.createObjectURL(file)
      newPreviews.push(localUrl)

      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Upload via server-side API (bypasses Supabase RLS)
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, fileName: file.name, bucket: 'property-images' })
      })
      const data = await res.json()
      if (data.url) {
        urls.push(data.url)
      } else {
        setError('Failed to upload one or more images: ' + (data.error || 'Unknown error'))
      }
    }

    setPreviews(prev => [...prev, ...newPreviews])
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
    const { error: err } = await supabase.from('properties').insert([{
      ...form,
      price: parseFloat(form.price),
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      area_sqft: form.area_sqft ? parseFloat(form.area_sqft) : null,
      images: images,
      status: 'available'
    }])
    if (err) { setError('Failed to submit: ' + err.message); return }
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
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
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
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Property Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload}
                className="w-full border rounded-lg px-4 py-3" />
              {uploading && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-primary">Uploading images...</p>
                </div>
              )}
              {previews.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {previews.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`Preview ${i+1}`} className="w-24 h-24 object-cover rounded-lg border-2 border-green-200" />
                      {images[i] && <div className="absolute top-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">✓</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={uploading}
              className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50">
              {uploading ? 'Uploading images...' : 'Submit Property Listing'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
