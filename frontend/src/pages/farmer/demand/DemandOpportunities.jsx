import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemand } from '../../../context/DemandContext.jsx'
import OpportunityCard from '../../../components/demand/OpportunityCard.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'

// ── Toast-style action feedback ───────────────────────────────────────────────
function ActionToast({ message, onClose }) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/30 text-white text-sm font-medium
                    px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm w-full mx-4 backdrop-blur-xl">
      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function DemandOpportunities() {
  const navigate = useNavigate()
  const { opportunities, loading, error } = useDemand()

  const [toast, setToast] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  function handleListCrop(opp) {
    showToast(`Navigating to Add Crop for ${opp.cropName}…`)
    setTimeout(() => navigate('/farmer/crops/add'), 1200)
  }

  function handlePreBook(opp) {
    showToast(`Pre-booking for ${opp.cropName} in ${opp.location} initiated.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <span>High-Value Demand Opportunities</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Premium Arbitrage
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          High-demand signals where your crops can lock in superior rates directly from verified buyers before harvesting.
        </p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
        <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
          💡
        </div>
        <div>
          <p className="text-white font-bold text-sm">Lock in Pre-Harvest Contracts</p>
          <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
            Directly connect your upcoming fruit, vegetable, flower, or grain harvests with institutional procurement buyers to secure guaranteed minimum floor prices.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-500/30 rounded-2xl px-5 py-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/80 border border-white/10 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/60 rounded-3xl border border-white/10 p-8">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10">💡</div>
          <p className="font-bold text-white text-lg">No high-demand opportunities right now</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            Opportunities update continuously as buyers publish new procurement quotas across Maharashtra and surrounding mandis.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              onListCrop={handleListCrop}
              onPreBook={handlePreBook}
            />
          ))}
        </div>
      )}

      <ActionToast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
