import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function GPSMeasurePage() {
  const [points, setPoints] = useState([])
  const [area, setArea] = useState(0)
  const [perimeter, setPerimeter] = useState(0)
  const [mapReady, setMapReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [propertyId, setPropertyId] = useState('')
  const [gettingGPS, setGettingGPS] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const drawnPolygon = useRef(null)
  const markersRef = useRef([])

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.head.appendChild(script)

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
      }
    }
  }, [])

  const initMap = () => {
    if (!window.L || !mapRef.current) return

    // Center on Uganda
    mapInstance.current = window.L.map(mapRef.current, {
      center: [1.3733, 32.2903],
      zoom: 7,
    })

    // Use OpenStreetMap tiles (free, no API key)
    const osmLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance.current)

    // Add satellite layer option
    const satellite = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Esri World Imagery',
      maxZoom: 19,
    })

    const baseLayers = {
      'Street Map': osmLayer,
      'Satellite': satellite,
    }
    window.L.control.layers(baseLayers).addTo(mapInstance.current)

    // Add scale bar
    window.L.control.scale({ imperial: false, metric: true }).addTo(mapInstance.current)

    // Click to add point
    mapInstance.current.on('click', (e) => {
      addPoint(e.latlng.lat, e.latlng.lng)
    })

    setMapReady(true)
  }

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
        radius: 6,
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
        weight: 2,
        opacity: 0.6,
        fillColor: '#16a34a',
        fillOpacity: 0.15,
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

      // Spherical polygon area formula
      totalArea += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2))

      // Haversine distance for perimeter
      const dLat = lat2 - lat1
      const dLng = lng2 - lng1
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      totalPerimeter += R * c
    }

    totalArea = Math.abs(totalArea * R * R / 2)

    setArea(totalArea) // in square meters
    setPerimeter(totalPerimeter) // in meters
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
        }
        setGettingGPS(false)
      },
      (err) => {
        setGpsError(err.message || 'Could not get GPS location')
        setGettingGPS(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
      }
    } catch (err) {
      
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
      <Head>
        <title>GPS Land Measuring &mdash; SageCo Evergreen</title>
        <meta name="description" content="Measure land area using GPS coordinates on an interactive map. Draw boundaries and calculate acreage in real-time." />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">GPS Land Measuring</h1>
            <p className="text-gray-600 mt-2">
              Draw boundaries on the map or capture GPS points in the field. Get accurate area measurements in acres, hectares, and square meters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span>
                      {points.length} point{points.length !== 1 ? 's' : ''}
                    </span>
                    {area > 0 && (
                      <span className="text-green-700 font-medium">{formatArea(area)}</span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={useMyLocation}
                      disabled={gettingGPS}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-200 transition disabled:opacity-50"
                    >
                      {gettingGPS ? 'Getting GPS...' : 'My GPS Location'}
                    </button>
                    <button
                      onClick={removeLastPoint}
                      disabled={points.length === 0}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      Undo
                    </button>
                    <button
                      onClick={clearAll}
                      disabled={points.length === 0}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div
                  ref={mapRef}
                  style={{ height: '500px', width: '100%', zIndex: 0 }}
                  className="bg-gray-100"
                />
                {gpsError && (
                  <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
                    GPS Error: {gpsError}
                  </div>
                )}
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                  Click on the map to add boundary points. Use "My GPS Location" on mobile to capture real coordinates in the field. Toggle between Street Map and Satellite view using the layer icon (top-right of map).
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4">
              {/* Measurements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Measurements</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">Area</span>
                    <span className="text-lg font-bold text-green-700">{formatArea(area)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">Perimeter</span>
                    <span className="text-sm font-medium text-gray-900">{formatPerimeter(perimeter)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">Points</span>
                    <span className="text-sm font-medium text-gray-900">{points.length}</span>
                  </div>
                </div>
              </div>

              {/* Coordinates list */}
              {points.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Boundary Points</h3>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {points.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1.5 rounded">
                        <span className="text-green-600 font-bold">P{i + 1}</span>
                        <span>{p.lat.toFixed(6)}</span>
                        <span>{p.lng.toFixed(6)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save to property */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Save Measurement</h3>
                <input
                  type="text"
                  placeholder="Property ID (optional)"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full mb-3 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={saveMeasurement}
                  disabled={points.length < 3 || saving}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Boundary'}
                </button>
                {saved && (
                  <p className="text-xs text-green-600 mt-2 text-center">Saved successfully!</p>
                )}
                <button
                  onClick={exportGeoJSON}
                  disabled={points.length < 3}
                  className="w-full mt-2 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Export GeoJSON
                </button>
              </div>

              {/* Title search link */}
              <Link href="/title-search" className="block">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5 hover:shadow-md transition cursor-pointer">
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">Land Title Search</h3>
                  <p className="text-xs text-amber-700">
                    Verify land ownership and title status through the Uganda land registry.
                  </p>
                  <span className="text-xs text-amber-600 font-medium mt-2 inline-block">Search now</span>
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
