import React from 'react'
import { useNavigate } from 'react-router-dom'
import DemandLevelBadge from './DemandLevelBadge.jsx'
import TrendBadge from './TrendBadge.jsx'
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

export default function DemandCard({ demand }) {
  const navigate = useNavigate()
  const emoji = getCropEmoji(demand.cropName, demand.category)
  const theme = getCropTheme(demand.cropName, demand.category)

  const deadline = demand.requiredBy
    ? new Date(demand.requiredBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  const priceRange = demand.expectedPriceMin && demand.expectedPriceMax
    ? `₹${demand.expectedPriceMin}–${demand.expectedPriceMax}/${demand.unit}`
    : '—'

  const buyerCount = demand.buyerRequirements?.length || 0

  return (
    <div className="bg-slate-900/85 hover:bg-slate-900/95 border border-white/10 hover:border-emerald-500/40 rounded-2xl flex flex-col gap-0 hover:shadow-2xl hover:shadow-emerald-950/25 transition-all duration-300 p-0 overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${theme.bg} ${theme.border} ${theme.glow}`}>
            {emoji}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-base leading-tight truncate">{demand.cropName}</h3>
            <p className="text-xs text-slate-400 truncate mt-0.5">{demand.variety || demand.category}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <DemandLevelBadge level={demand.demandLevel} />
          <TrendBadge trend={demand.demandTrend} />
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-3">
        <InfoRow label="Demand Volume"    value={`${demand.demandQuantity.toLocaleString()} ${demand.unit}`} />
        <InfoRow label="Price Range"      value={priceRange} highlight />
        <InfoRow label="Location"         value={demand.location} />
        <InfoRow label="Required By"      value={deadline} />
        <InfoRow label="Buyer Enquiries"  value={buyerCount > 0 ? `${buyerCount} active buyer${buyerCount > 1 ? 's' : ''}` : 'None yet'} />
      </div>

      {/* Actions */}
      <div className="border-t border-white/10 px-5 py-3 bg-slate-950/40">
        <button
          onClick={() => navigate(`/farmer/demand/opportunities`)}
          className="w-full text-xs font-semibold text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30
                     py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <span>View Opportunity</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  )
}
