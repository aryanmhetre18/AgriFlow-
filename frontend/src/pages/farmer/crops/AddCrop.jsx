import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCrops } from '../../../context/CropsContext.jsx'
import CropForm from '../../../components/crops/CropForm.jsx'

export default function AddCrop() {
  const navigate    = useNavigate()
  const { addCrop } = useCrops()

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  async function handleSubmit(data) {
    setLoading(true)
    setApiError('')
    try {
      const newCrop = await addCrop(data)
      navigate(`/farmer/crops/${newCrop.id}`, { state: { fromAdd: true } })
    } catch (err) {
      setApiError(err.message || 'Failed to save crop. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <span>Register New Harvest</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Marketplace Listing
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Specify your crop variety, category (fruits, vegetables, flowers, or grains), target rates, and harvest date.
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
        onSubmit={handleSubmit}
        onCancel={() => navigate('/farmer/crops')}
        isEdit={false}
        loading={loading}
      />
    </div>
  )
}
