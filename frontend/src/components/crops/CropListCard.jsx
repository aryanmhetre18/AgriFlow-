import React from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../ui/StatusBadge.jsx'
import { getCropEmoji, getCropTheme } from '../../utils/cropUtils.js'

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-xs font-medium ${highlight ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
        {value}
      </span>
    </div>
  )
}

export default function CropListCard({ crop, onDelete }) {
  const navigate = useNavigate()
  const emoji = getCropEmoji(crop.name, crop.category)
  const theme = getCropTheme(crop.name, crop.category)

  const availPct = crop.totalQty > 0
    ? Math.round((crop.availableQty / crop.totalQty) * 100)
    : 0

  const harvestDate = crop.expectedHarvestDate
    ? new Date(crop.expectedHarvestDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  return (
    <div className="bg-slate-900/85 hover:bg-slate-900/95 border border-white/10 hover:border-emerald-500/40 rounded-2xl flex flex-col gap-0 hover:shadow-2xl hover:shadow-emerald-950/25 transition-all duration-300 p-0 overflow-hidden backdrop-blur-xl">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${theme.bg} ${theme.border} ${theme.glow}`}>
            {emoji}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-base leading-tight truncate flex items-center gap-2">
              {crop.name}
            </h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {crop.variety || crop.category}
              <span className="mx-1 text-slate-600">·</span>
              <span className="text-slate-300">{crop.farmLocation?.split(',')[0]}</span>
            </p>
          </div>
        </div>
        <StatusBadge label={crop.status} />
      </div>

      {/* Info rows */}
      <div className="px-5 pb-3">
        <InfoRow label="Total Quantity" value={`${crop.totalQty} ${crop.unit}`} />
        <InfoRow label="Available"      value={`${crop.availableQty} ${crop.unit}`} />
        <InfoRow label="Harvest Date"   value={harvestDate} />
        <InfoRow label="Target Price"   value={`₹${crop.expectedPrice}/${crop.unit}`} highlight />
        <InfoRow label="Quality Grade"  value={crop.grade} />
      </div>

      {/* Availability bar */}
      <div className="px-5 pb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Available Stock</span>
          <span className="text-emerald-400 font-semibold">{availPct}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${availPct}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white/10 px-5 py-3 flex items-center gap-2 bg-slate-950/40">
        <button
          onClick={() => navigate(`/farmer/crops/${crop.id}`)}
          className="flex-1 text-xs font-semibold text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30
                     py-2.5 rounded-xl transition-all duration-200"
        >
          View Details
        </button>
        <button
          onClick={() => navigate(`/farmer/crops/${crop.id}/edit`)}
          className="flex-1 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10
                     py-2.5 rounded-xl transition-all duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(crop.id)}
          className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all duration-200"
          aria-label="Delete crop"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
