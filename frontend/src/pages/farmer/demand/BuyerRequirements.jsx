import React, { useState, useMemo } from 'react'
import { useDemand } from '../../../context/DemandContext.jsx'
import BuyerRequirementRow from '../../../components/demand/BuyerRequirementRow.jsx'
import DemandLevelBadge from '../../../components/demand/DemandLevelBadge.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import { getCropEmoji } from '../../../utils/cropUtils.js'

// ── Dark Detail modal ─────────────────────────────────────────────────────────
function BuyerDetailModal({ req, onClose }) {
  if (!req) return null
  const deadline = req.deadline
    ? new Date(req.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/15 rounded-3xl shadow-2xl p-6 max-w-md w-full text-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10">
              {getCropEmoji(req.cropName, req.category)}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{req.cropName} Requirement</h3>
              <p className="text-sm text-slate-400 mt-0.5">{req.companyName || req.buyerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="space-y-0 divide-y divide-white/5">
          {[
            { label: 'Crop Spec',          value: `${req.cropName}${req.variety ? ` · ${req.variety}` : ''}` },
            { label: 'Verified Buyer',     value: req.buyerName },
            { label: 'Organization',       value: req.companyName || '—' },
            { label: 'Required Volume',    value: `${req.requiredQuantity.toLocaleString()} ${req.unit}` },
            { label: 'Quality Grade',      value: req.qualityGrade },
            { label: 'Offered Price',      value: `₹${req.expectedPrice} / ${req.unit}`, highlight: true },
            { label: 'Delivery Location',  value: req.deliveryLocation },
            { label: 'Contract Deadline',  value: deadline },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="flex justify-between py-2.5">
              <span className="text-xs text-slate-400">{label}</span>
              <span className={`text-xs font-semibold ${highlight ? 'text-emerald-400 text-sm font-black' : 'text-slate-200'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {req.notes && (
          <div className="mt-4 bg-slate-800/80 rounded-2xl px-4 py-3 border border-white/5">
            <p className="text-xs text-slate-400 font-semibold mb-1">Procurement Notes</p>
            <p className="text-xs text-slate-200 leading-relaxed">{req.notes}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { alert('Direct listing against buyer requirement initiated.'); onClose() }}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
          >
            Supply My Harvest
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BuyerRequirements() {
  const { buyerReqs, loading, error } = useDemand()

  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => buyerReqs.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.cropName.toLowerCase().includes(q) ||
      (r.companyName || '').toLowerCase().includes(q) ||
      r.buyerName.toLowerCase().includes(q) ||
      (r.deliveryLocation || '').toLowerCase().includes(q)
    )
  }), [buyerReqs, search])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <span>Active Buyer Requirements</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {buyerReqs.length} Active Demands
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Direct purchase inquiries from retail chains, food processors, exporters, and wholesale aggregators.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search crop, buyer, company or delivery region…"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-500/30 rounded-2xl px-5 py-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900/80 border border-white/10 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/60 rounded-3xl border border-white/10 p-8">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10">🛒</div>
          <p className="font-bold text-white text-lg">No buyer requirements found</p>
          <p className="text-sm text-slate-400 mt-1">
            {search ? 'Try modifying your search keywords.' : 'Check back soon — institutional buyer tenders are posted daily.'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/85 rounded-2xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/60">
                  {['Crop Spec', 'Buyer / Enterprise', 'Volume Needed', 'Grade', 'Offered Rate', 'Delivery Location', 'Deadline', 'Urgency', ''].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((req) => (
                  <BuyerRequirementRow key={req.id} req={req} onView={setSelected} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <BuyerDetailModal req={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
