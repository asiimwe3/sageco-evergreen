import { useState } from 'react'

/**
 * PricePredictor — fetches AI price prediction from /api/predict-price
 * Shows predicted price range, factor breakdown, and cheating detection.
 *
 * Props: { gps: {lat, lng}, location, category, sub_type, land_acres, area_sqft,
 *          plot_feet, price, water_available, electricity_available,
 *          road_distance_km, fence, title_deed }
 */
export default function PricePredictor(props) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFactors, setShowFactors] = useState(false)

  async function predict() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Prediction failed')
      setPrediction(data.prediction)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hasGps = props.lat != null || (props.gps && props.gps.lat) || props.location

  if (!hasGps) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        💡 Set GPS location on the map above to get an AI price prediction.
      </div>
    )
  }

  return (
    <div className="bg-white border-2 border-green-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <div>
          <h3 className="font-bold text-sm">AI Price Prediction</h3>
          <p className="text-xs text-green-200">Powered by Uganda public land data & GPS analysis</p>
        </div>
        <button
          onClick={predict}
          disabled={loading}
          className="ml-auto bg-white text-green-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-50 disabled:opacity-50"
        >
          {loading ? '⏳ Analyzing...' : prediction ? '🔄 Re-predict' : '✨ Predict Price'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 text-sm">{error}</div>
      )}

      {/* Prediction results */}
      {prediction && (
        <div className="p-4 space-y-4">
          {/* Price range */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">AI Predicted Fair Value</p>
            <p className="text-3xl font-extrabold text-green-700">
              UGX {prediction.predictedPrice.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Range: UGX {prediction.priceRange.low.toLocaleString()} – {prediction.priceRange.high.toLocaleString()}
            </p>
            {prediction.pricePerAcre && (
              <p className="text-xs text-gray-400 mt-1">
                ≈ UGX {prediction.pricePerAcre.toLocaleString()} / acre
              </p>
            )}
          </div>

          {/* Confidence + location */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 text-sm">
            <div>
              <span className="text-gray-500">Confidence: </span>
              <span className={`font-bold ${prediction.confidence > 0.7 ? 'text-green-600' : prediction.confidence > 0.5 ? 'text-yellow-600' : 'text-gray-500'}`}>
                {Math.round(prediction.confidence * 100)}%
              </span>
            </div>
            <div className="text-gray-500">
              📍 {prediction.nearestTown} ({prediction.distanceToTown} km)
            </div>
          </div>

          {/* Cheating detection */}
          {prediction.priceAssessment && (
            <div className={`rounded-lg p-3 border-2 ${
              prediction.priceAssessment.color === 'red' ? 'bg-red-50 border-red-300' :
              prediction.priceAssessment.color === 'orange' ? 'bg-orange-50 border-orange-300' :
              prediction.priceAssessment.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
              'bg-green-50 border-green-300'
            }`}>
              <p className={`font-bold text-sm ${
                prediction.priceAssessment.color === 'red' ? 'text-red-700' :
                prediction.priceAssessment.color === 'orange' ? 'text-orange-700' :
                prediction.priceAssessment.color === 'yellow' ? 'text-yellow-700' :
                'text-green-700'
              }`}>
                {prediction.priceAssessment.label}
              </p>
              <p className="text-xs text-gray-600 mt-1">{prediction.priceAssessment.message}</p>
            </div>
          )}

          {/* Factor breakdown toggle */}
          <button
            onClick={() => setShowFactors(s => !s)}
            className="text-xs text-green-600 font-medium hover:text-green-800"
          >
            {showFactors ? '▼ Hide' : '▶ Show'} price factors breakdown
          </button>

          {showFactors && (
            <div className="space-y-1.5 border-t pt-3">
              {prediction.factors.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-gray-700">{f.name}</span>
                    <span className="text-gray-400 ml-2">{f.detail}</span>
                  </div>
                  {f.multiplier && (
                    <span className={`font-mono font-bold ${
                      f.multiplier > 1.05 ? 'text-green-600' :
                      f.multiplier < 0.95 ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      ×{f.multiplier.toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
              <div className="border-t pt-2 mt-2 text-xs text-gray-400">
                Base price × all factors = predicted price per acre × {prediction.acres} acres
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial state */}
      {!prediction && !loading && !error && (
        <div className="p-4 text-sm text-gray-500 text-center">
          Click <strong>"Predict Price"</strong> to analyze this property's fair value using GPS location,
          distance to town, road access, electricity, water, and Uganda district land data.
        </div>
      )}
    </div>
  )
}
