import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCrops } from '../../../context/CropsContext.jsx'
import CropForm from '../../../components/crops/CropForm.jsx'
import * as api from '../../../services/cropApi.js'

export default function EditCrop() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateCrop, getCropById } = useCrops()

  const [crop, setCrop] = useState(() => getCropById(id) || null)
  const [fetching, setFetching] = useState(!crop)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (crop) return
    setFetching(true)
    api.fetchCropById(id)
      .then((data) => { setCrop(data); setFetching(false) })
      .catch((err) => { setApiError(err.message); setFetching(false) })
  }, [id])

  if (fetching) {
    return (
      <div className="max-w-4xl space-y-5 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-48" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-900 border border-white/10 rounded-3xl h-36" />
        ))}
      </div>
    )
  }

  if (!crop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-slate-900/60 rounded-3xl border border-white/10 p-8">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10">🔍</div>
        <p className="font-bold text-white text-lg">Crop listing not found</p>
        <p className="text-sm text-slate-400 mt-1">{apiError || 'This crop may have been removed.'}</p>
        <button onClick={() => navigate('/farmer/crops')} className="btn-primary mt-6 text-sm px-6">
          Back to My Crops
        </button>
      </div>
    )
  }

  async function handleSubmit(data) {
    setLoading(true)
    setApiError('')
    try {
      const updated = await updateCrop(id, data)
      navigate(`/farmer/crops/${updated.id}`, { state: { fromEdit: true } })
    } catch (err) {
      setApiError(err.message || 'Failed to update crop. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <span>Edit Crop Specifications</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {crop.name}
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Update your crop category, quantity availability, quality grade, or pricing.
        </p>
      </div>

      {apiError && (
        <div className="bg-rose-950/70 border border-rose-500/40 text-rose-300 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-xl">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      <CropForm
        initialData={crop}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/farmer/crops/${id}`)}
        isEdit
        loading={loading}
      />
    </div>
  )
}
