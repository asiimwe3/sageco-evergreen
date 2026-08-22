import { useState, useEffect, useRef } from 'react'

/**
 * MapPicker — Leaflet + OpenStreetMap based GPS picker.
 * No API key required. User clicks on map to drop pin, drag to adjust.
 */
export default function MapPicker({ lat, lng, onChange, height = 300 }) {
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const containerRef = useRef(null)
  const [coords, setCoords] = useState({ lat: lat || 0.3476, lng: lng || 32.5825 })
  const [address, setAddress] = useState('')
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const LRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Load Leaflet CSS
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
  }, [])

  // Load Leaflet JS dynamically, then init map
  useEffect(() => {
    if (window.L) {
      initMap()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.body.appendChild(script)
    // eslint-disable-next-line
  }, [])

  function initMap() {
    const L = window.L
    if (!L || !containerRef.current) return
    LRef.current = L

    if (mapRef.current) {
      mapRef.current.remove()
    }

    const center = [coords.lat, coords.lng]
    mapRef.current = L.map(containerRef.current).setView(center, 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapRef.current)

    const customIcon = L.divIcon({
      html: `<div style="font-size: 32px; transform: translateX(-50%) translateY(-100%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">📍</div>`,
      className: '',
      iconSize: [0, 0],
    })

    markerRef.current = L.marker(center, { icon: customIcon, draggable: true }).addTo(mapRef.current)

    markerRef.current.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      updateCoords(pos.lat, pos.lng)
    })

    mapRef.current.on('click', (e) => {
      const pos = e.latlng
      markerRef.current.setLatLng(pos)
      updateCoords(pos.lat, pos.lng)
    })

    // Fire onChange with initial coordinates so parent form has them immediately
    const initCoords = { lat: coords.lat, lng: coords.lng }
    onChangeRef.current && onChangeRef.current(initCoords)

    // Reverse geocode initial position
    reverseGeocode(coords.lat, coords.lng)
  }

  function updateCoords(lat, lng) {
    const rounded = { lat: Math.round(lat * 1e6) / 1e6, lng: Math.round(lng * 1e6) / 1e6 }
    setCoords(rounded)
    onChangeRef.current && onChangeRef.current(rounded)
    reverseGeocode(rounded.lat, rounded.lng)
  }

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&countrycodes=ug`)
      const data = await res.json()
      if (data.display_name) {
        setAddress(data.display_name)
        const addr = data.address || {}
        const district = addr.county || addr.state_district || addr.city || addr.town || addr.village || ''
        if (district) {
          onChangeRef.current && onChangeRef.current({ lat, lng, district: district.replace(/ District$/, '').trim() })
        }
      }
    } catch (e) {
      // Silent fail — not critical
    }
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search + ', Uganda')}&limit=1&countrycodes=ug`)
      const data = await res.json()
      if (data.length > 0) {
        const { lat: la, lon: ln } = data[0]
        const numLat = parseFloat(la)
        const numLng = parseFloat(ln)
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([numLat, numLng], 15)
          markerRef.current.setLatLng([numLat, numLng])
        }
        updateCoords(numLat, numLng)
      }
    } catch (e) {
      // Silent
    } finally {
      setSearching(false)
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const la = pos.coords.latitude
      const ln = pos.coords.longitude
      if (mapRef.current && markerRef.current) {
        mapRef.current.setView([la, ln], 16)
        markerRef.current.setLatLng([la, ln])
      }
      updateCoords(la, ln)
    }, () => {
      alert('Could not get your location. Please allow location access or click on the map.')
    }, { enableHighAccuracy: true })
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search location in Uganda (e.g. Kyenjojo town)"
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600"
        />
        <button type="submit" disabled={searching}
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50">
          {searching ? '...' : 'Find'}
        </button>
        <button type="button" onClick={useMyLocation}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
          title="Use my current location">
          📍 GPS
        </button>
      </form>

      {/* Map container */}
      <div
        ref={containerRef}
        style={{ height: `${height}px`, borderRadius: '12px', overflow: 'hidden', border: '2px solid #e5e7eb' }}
        className="z-0"
      />

      {/* Coordinates display */}
      <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-500">GPS Coordinates:</span>
          <span className="font-mono font-bold text-gray-800">
            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </span>
        </div>
        {address && (
          <div className="flex justify-between gap-2">
            <span className="text-gray-500 shrink-0">Address:</span>
            <span className="text-gray-700 text-right">{address}</span>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">Click on map or drag pin to set exact location</p>
      </div>
    </div>
  )
}
