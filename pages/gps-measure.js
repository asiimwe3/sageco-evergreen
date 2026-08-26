import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function GPSMeasurePage() {
  const [points, setPoints] = useState([])
  const [area, setArea] = useState(0)
  const [perimeter, setPerimeter] = useState(0)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [propertyId, setPropertyId] = useState('')
  const [gettingGPS, setGettingGPS] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [layerType, setLayerType] = useState('street')
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const drawnPolygon = useRef(null)
  const markersRef = useRef([])
  const currentLayer = useRef(null)
  const satelliteLayer = useRef(null)
  const streetLayer = useRef(null)

  // Load Leaflet dynamically and init map
  useEffect(() => {
    if (typeof window === 'undefined') return

    let cleanup = () => {}

    const initMap = () => {
      if (!window.L || !mapRef.current) {
        setMapError('Map library failed to load')
        return
      }

      try {
        // Check if map already initialized
        if (mapInstance.current) {
          mapInstance.current.remove()
        }

        // Center on Uganda
        mapInstance.current = window.L.map(mapRef.current, {
          center: [1.3733, 32.2903],
          zoom: 7,
          zoomControl: true,
          attributionControl: true,
        })

        // Street map layer (default)
        streetLayer.current = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstance.current)

        // Satellite layer
        satelliteLayer.current = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Esri World Imagery',
          maxZoom: 19,
        })

        currentLayer.current = streetLayer.current

        // Layer control
        window.L.control.layers({
          'Street Map': streetLayer.current,
          'Satellite': satelliteLayer.current,
        }).addTo(mapInstance.current)

        // Scale bar
        window.L.control.scale({ imperial: false, metric: true }).addTo(mapInstance.current)

        // Listen for layer changes
        mapInstance.current.on('baselayerchange', (e) => {
          setLayerType(e.name === 'Satellite' ? 'satellite' : 'street')
        })

        // Click to add point
        mapInstance.current.on('click', (e) => {
          addPoint(e.latlng.lat, e.latlng.lng)
        })

        // CRITICAL: invalidateSize after container is rendered
        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize()
          }
        }, 100)
        setTimeout(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize()
          }
        }, 500)

        setMapReady(true)
        setMapError('')
      } catch (err) {
        setMapError('Failed to initialize map: ' + err.message)
      }
    }

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Check if Leaflet is already loaded
    if (window.L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      script.onerror = () => setMapError('Failed to load map library')
      document.head.appendChild(script)
    }

    cleanup = () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }

    return cleanup
  }, [])

  const addPoint = (lat, lng) => {
    setPoints(prev => {
      const newPoints = [...prev, { lat, lng }]
      updateMap(newPoints)
      return newPoints
    })
  }

  const updateMap = (pts) => {
    if (!mapInstance.current || !window.L) return

    // Clear existing markers and polygon
    markersRef.current.forEach(m => mapInstance.current.removeLayer(m))
    markersRef.current = []
    if (drawnPolygon.current) {
      mapInstance.current.removeLayer(drawnPolygon.current)
      drawnPolygon.current = null
    }

    // Add markers for each point
    pts.forEach((p, i) => {
      const marker = window.L.circleMarker([p.lat, p.lng], {
        radius: 7,
        fillColor: '#16a34a',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(mapInstance.current)
      marker.bindTooltip(`Point ${i + 1}: ${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`, { permanent: false })
      markersRef.current.push(marker)
    })

    // Draw polygon if 3+ points
    if (pts.length >= 3) {
      drawnPolygon.current = window.L.polygon(pts.map(p => [p.lat, p.lng]), {
        color: '#16a34a',
        weight: 3,
        opacity: 0.8,
        fillColor: '#16a34a',
        fillOpacity: 0.2,
      }).addTo(mapInstance.current)
    } else if (pts.length === 2) {
      drawnPolygon.current = window.L.polyline(pts.map(p => [p.lat, p.lng]), {
        color: '#16a34a',
        weight: 3,
        dashArray: '5, 5',
      }).addTo(mapInstance.current)
    }

    // Calculate area
    calculateArea(pts)
  }

  const calculateArea = (pts) => {
    if (pts.length < 3) {
      setArea(0)
      setPerimeter(0)
      return
    }

    // Spherical polygon area formula (geodesic)
    const R = 6371000 // Earth radius in meters
    let totalArea = 0
    let totalPerimeter = 0

    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length
      const lat1 = pts[i].lat * Math.PI / 180
      const lat2 = pts[j].lat * Math.PI / 180
      const lng1 = pts[i].lng * Math.PI / 180
      const lng2 = pts[j].lng * Math.PI / 180

      totalArea += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2))

      const dLat = lat2 - lat1
      const dLng = lng2 - lng1
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      totalPerimeter += R * c
    }

    totalArea = Math.abs(totalArea * R * R / 2)

    setArea(totalArea)
    setPerimeter(totalPerimeter)
  }

  const useMyLocation = () => {
    setGettingGPS(true)
    setGpsError('')
    if (!navigator.geolocation) {
      setGpsError('Geolocation not supported on this device')
      setGettingGPS(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        addPoint(latitude, longitude)
        if (mapInstance.current) {
          mapInstance.current.setView([latitude, longitude], 17)
          setTimeout(() => mapInstance.current && mapInstance.current.invalidateSize(), 100)
        }
        setGettingGPS(false)
      },
      (err) => {
        setGpsError(err.message || 'Could not get GPS location. Make sure location services are enabled.')
        setGettingGPS(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  const removeLastPoint = () => {
    setPoints(prev => {
      const newPoints = prev.slice(0, -1)
      updateMap(newPoints)
      return newPoints
    })
  }

  const clearAll = () => {
    setPoints([])
    setArea(0)
    setPerimeter(0)
    setSaved(false)
    if (mapInstance.current && window.L) {
      markersRef.current.forEach(m => mapInstance.current.removeLayer(m))
      markersRef.current = []
      if (drawnPolygon.current) {
        mapInstance.current.removeLayer(drawnPolygon.current)
        drawnPolygon.current = null
      }
    }
  }

  const saveMeasurement = async () => {
    if (points.length < 3) return
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/gps/measure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId || null,
          coordinates: points,
          area_sqm: area,
          perimeter_m: perimeter,
          boundary_geojson: {
            type: 'Polygon',
            coordinates: [points.map(p => [p.lng, p.lat]).concat([points.length > 0 ? [points[0].lng, points[0].lat] : []])],
          },
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSaved(true)
      } else {
        setGpsError(data.error || 'Failed to save measurement')
      }
    } catch (err) {
      setGpsError('Network error: ' + err.message)
    }
    setSaving(false)
  }

  const formatArea = (sqm) => {
    if (sqm === 0) return '\u2014'
    const acres = sqm / 4046.86
    const hectares = sqm / 10000
    return `${acres.toFixed(3)} acres / ${hectares.toFixed(3)} ha / ${sqm.toFixed(0)} m\u00b2`
  }

  const formatPerimeter = (m) => {
    if (m === 0) return '\u2014'
    return `${m.toFixed(1)} m / ${(m / 1000).toFixed(3)} km`
  }

  const exportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          area_sqm: area,
          perimeter_m: perimeter,
          measured_at: new Date().toISOString(),
        },
        geometry: {
          type: 'Polygon',
          coordinates: [points.map(p => [p.lng, p.lat]).concat([points.length > 0 ? [points[0].lng, points[0].lat] : []])],
        },
      }],
    }
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `land-boundary-${Date.now()}.geojson`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <SEO
        title="GPS Land Measuring Tool"
        description="Measure land area in Uganda using GPS coordinates on an interactive map. Draw boundaries, calculate acreage in acres, hectares, and square meters. Free GPS land measurement tool by SAGECO EVERGREEN."
        keywords="GPS land measurement Uganda, measure land area, land boundary GPS, acreage calculator Uganda, GPS coordinates land, land survey tool Uganda, GeoJSON export"
        path="/gps-measure"
        breadcrumbs={[{"name": "Home", "path": "/"}, {"name": "GPS Land Measuring", "path": "/gps-measure"}]}
      />
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">GPS Land Measuring</h1>
            <p className="text-lg text-gray-600 mt-3">
              Draw boundaries on the map or capture GPS points in the field. Get accurate area measurements in acres, hectares, and square meters — free for all Ugandans.
            </p>
          </div>

          {/* Map Error Banner */}
          {mapError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-base">
              ⚠️ {mapError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 text-base">
                    <span className="inline-flex items-center gap-2 text-gray-700 font-semibold">
                      <span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span>
                      {points.length} point{points.length !== 1 ? 's' : ''}
                    </span>
                    {area > 0 && (
                      <span className="text-green-700 font-bold text-base">{formatArea(area)}</span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={useMyLocation}
                      disabled={gettingGPS || !mapReady}
                      className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition disabled:opacity-50"
                    >
                      {gettingGPS ? '📍 Getting GPS...' : '📍 My GPS Location'}
                    </button>
                    <button
                      onClick={removeLastPoint}
                      disabled={points.length === 0}
                      className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      ↩ Undo
                    </button>
                    <button
                      onClick={clearAll}
                      disabled={points.length === 0}
                      className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition disabled:opacity-50"
                    >
                      🗑 Clear
                    </button>
                  </div>
                </div>

                {/* Map container — explicit dimensions for Leaflet */}
                <div
                  ref={mapRef}
                  style={{ height: '500px', width: '100%' }}
                  className="bg-gray-200 z-0"
                />

                {gpsError && (
                  <div className="px-5 py-3 bg-red-50 text-red-600 text-base">
                    ⚠️ GPS Error: {gpsError}
                  </div>
                )}
                <div className="px-5 py-3 text-sm text-gray-500 bg-gray-50 border-t border-gray-100">
                  💡 Click on the map to add boundary points. Use "My GPS Location" on mobile to capture real coordinates in the field. Toggle between Street Map and Satellite view using the layer icon (top-right of map).
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {/* Measurements */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Measurements</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base text-gray-600">Area</span>
                    <span className="text-xl font-bold text-green-700">{formatArea(area)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-base text-gray-600">Perimeter</span>
                    <span className="text-base font-medium text-gray-900">{formatPerimeter(perimeter)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-base text-gray-600">Points</span>
                    <span className="text-base font-medium text-gray-900">{points.length}</span>
                  </div>
                </div>
              </div>

              {/* Coordinates list */}
              {points.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Boundary Points</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {points.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-green-600 font-bold">P{i + 1}</span>
                        <span>{p.lat.toFixed(6)}</span>
                        <span>{p.lng.toFixed(6)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save to property */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Save Measurement</h3>
                <input
                  type="text"
                  placeholder="Property ID (optional)"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full mb-3 px-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={saveMeasurement}
                  disabled={points.length < 3 || saving}
                  className="w-full bg-green-600 text-white py-3 rounded-xl text-base font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : '💾 Save Boundary'}
                </button>
                {saved && (
                  <p className="text-sm text-green-600 mt-2 text-center font-medium">✅ Saved successfully!</p>
                )}
                <button
                  onClick={exportGeoJSON}
                  disabled={points.length < 3}
                  className="w-full mt-2 border border-gray-200 text-gray-700 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  📐 Export GeoJSON
                </button>
              </div>

              {/* Title search link */}
              <Link href="/title-search" className="block">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 hover:shadow-md transition cursor-pointer">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Land Title Search</h3>
                  <p className="text-base text-amber-700">
                    Verify land ownership and title status through the Uganda land registry.
                  </p>
                  <span className="text-base text-amber-600 font-semibold mt-3 inline-block">Search now →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
