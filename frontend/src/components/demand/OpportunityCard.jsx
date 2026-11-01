import React from 'react'
import DemandLevelBadge from './DemandLevelBadge.jsx'
import TrendBadge from './TrendBadge.jsx'
import { getCropEmoji, getCropTheme } from '../../utils/cropUtils.js'

export default function OpportunityCard({ opp, onListCrop, onPreBook }) {
  const emoji = getCropEmoji(opp.cropName, opp.category)
  const theme = getCropTheme(opp.cropName, opp.category)

  const deadline = opp.requiredBy
    ? new Date(opp.requiredBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className="bg-slate-900/85 hover:bg-slate-900/95 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 hover:shadow-2xl hover:shadow-emerald-950/25 transition-all duration-300 backdrop-blur-xl">
      {/* Top */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${theme.bg} ${theme.border} ${theme.glow}`}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-base">{opp.cropName} Demand</h3>
            <DemandLevelBadge level={opp.demandLevel} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{opp.location}</p>
        </div>
        <TrendBadge trend={opp.demandTrend} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-slate-800/80 rounded-xl p-3 text-center border border-white/5">
          <p className="text-[10px] text-slate-400 mb-0.5">Quota</p>
          <p className="text-sm font-bold text-white">{opp.demandQuantity.toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">{opp.unit}</p>
        </div>
        <div className="bg-emerald-500/15 rounded-xl p-3 text-center border border-emerald-500/30">
          <p className="text-[10px] text-emerald-300 mb-0.5">Price Range</p>
          <p className="text-sm font-bold text-emerald-400">₹{opp.expectedPriceMin}–{opp.expectedPriceMax}</p>
          <p className="text-[10px] text-emerald-300">per {opp.unit}</p>
        </div>
        <div className="bg-slate-800/80 rounded-xl p-3 text-center border border-white/5">
          <p className="text-[10px] text-slate-400 mb-0.5">Buyers</p>
          <p className="text-sm font-bold text-white">{opp.buyerRequirements?.length || 0}</p>
          <p className="text-[10px] text-slate-400">active</p>
        </div>
      </div>

      {/* Detail row */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-5 pb-3 border-b border-white/10">
        <span>📅 Required by {deadline}</span>
        <span className="font-medium text-slate-300">{opp.variety ? `Variety: ${opp.variety}` : opp.category}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5">
        <button
          onClick={() => onListCrop(opp)}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold
                     bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          List My Crop
        </button>
        <button
          onClick={() => onPreBook(opp)}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold
                     border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
        >
          Pre-Book
        </button>
      </div>
    </div>
  )
}
