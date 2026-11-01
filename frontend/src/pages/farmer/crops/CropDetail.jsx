import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useCrops }  from '../../../context/CropsContext.jsx'
import StatusBadge   from '../../../components/ui/StatusBadge.jsx'
import { useAuth }   from '../../../hooks/useAuth.jsx'
import * as api      from '../../../services/cropApi.js'
import { getCropEmoji, getCropTheme } from '../../../utils/cropUtils.js'
import { APMC_LIVE_RATES } from '../../../data/apmcMarketData.js'

function Section({ title, icon, children }) {
  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-7 shadow-2xl mb-6">
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </div>
  )
}

function Row({ label, value, highlight, large }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-white/5 last:border-0 gap-4">
      <span className="text-xs sm:text-sm text-slate-400 flex-shrink-0">{label}</span>
      <span className={`text-xs sm:text-sm text-right font-medium
        ${highlight ? 'text-emerald-400 font-black' : 'text-slate-200'}
        ${large ? 'text-lg font-black text-emerald-400' : ''}`}>
        {value || '—'}
      </span>
    </div>
  )
}

const STATUS_ORDER = ['Pre-Harvest', 'Harvest Ready', 'Harvested', 'Booked', 'Pickup Scheduled', 'Delivered']

function StatusTimeline({ current }) {
  const currentIdx = STATUS_ORDER.indexOf(current)
  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl mb-6">
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-5 pb-3 border-b border-white/10 flex items-center gap-2">
        <span>🌾</span>
        <span>Crop Lifecycle Journey</span>
      </h3>
      <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_ORDER.map((status, i) => {
          const done   = i < currentIdx
          const active = i === currentIdx
          return (
            <React.Fragment key={status}>
              <div className="flex flex-col items-center min-w-[90px]">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  active ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/30 font-black shadow-lg shadow-emerald-500/40' : ''
                } ${
                  done ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : ''
                } ${
                  !active && !done ? 'bg-slate-800 text-slate-500 border border-white/5' : ''
                }`}>
                  {done ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (i + 1)}
                </div>
                <p className={`text-[11px] font-semibold mt-2 text-center leading-tight ${
                  active ? 'text-emerald-400' : done ? 'text-emerald-300' : 'text-slate-500'
                }`} style={{ maxWidth: 84 }}>
                  {status}
                </p>
              </div>
              {i < STATUS_ORDER.length - 1 && (
                <div className={`h-1 flex-1 mx-1 mb-6 rounded-full flex-shrink-0 ${
                  i < currentIdx ? 'bg-emerald-500/70 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default function CropDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const location     = useLocation()
  const { getCropById, deleteCrop } = useCrops()
  const { user }     = useAuth()

  const [crop,     setCrop]     = useState(() => getCropById(id) || null)
  const [fetching, setFetching] = useState(!crop)
  const [fetchErr, setFetchErr] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setFetching(true)
    api.fetchCropById(id)
      .then((data) => { setCrop(data); setFetching(false) })
      .catch((err) => { setFetchErr(err.message); setFetching(false) })
  }, [id])

  if (fetching && !crop) {
    return (
      <div className="max-w-4xl animate-pulse space-y-5">
        <div className="h-8 bg-slate-800 rounded-xl w-48" />
        {[1, 2, 3, 4].map((i) => <div key={i} className="bg-slate-900 border border-white/10 rounded-3xl h-36" />)}
      </div>
    )
  }

  if (!crop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-slate-900/60 rounded-3xl border border-white/10 p-8">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10">🔍</div>
        <p className="font-bold text-white text-lg">Crop listing not found</p>
        <p className="text-sm text-slate-400 mt-1">{fetchErr || 'This crop may have been removed or archived.'}</p>
        <button onClick={() => navigate('/farmer/crops')} className="btn-primary mt-6 text-sm px-6">
          Back to My Crops
        </button>
      </div>
    )
  }

  const emoji = getCropEmoji(crop.name, crop.category)
  const theme = getCropTheme(crop.name, crop.category)

  // Find nearest APMC benchmark price
  const apmcMatch = APMC_LIVE_RATES.find(
    (r) => r.cropName.toLowerCase().includes(crop.name.toLowerCase()) || crop.name.toLowerCase().includes(r.cropName.toLowerCase())
  )

  const harvestDate = crop.expectedHarvestDate
    ? new Date(crop.expectedHarvestDate).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  const createdDate = crop.createdAt
    ? new Date(crop.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  const availPct = crop.totalQty > 0
    ? Math.round((crop.availableQty / crop.totalQty) * 100)
    : 0

  async function handleDelete() {
    if (!window.confirm(`Delete "${crop.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteCrop(id)
      navigate('/farmer/crops')
    } catch (err) {
      alert(err.message || 'Failed to delete. Please try again.')
      setDeleting(false)
    }
  }

  const showSuccessBanner = location.state?.fromAdd || location.state?.fromEdit

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      {/* Success banner */}
      {showSuccessBanner && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold
                        px-5 py-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-lg">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{location.state?.fromAdd ? 'Crop listing successfully published to the decentralized marketplace.' : 'Crop specifications updated successfully.'}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <button
            onClick={() => navigate('/farmer/crops')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-2 font-semibold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Crops
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${theme.bg} ${theme.border} ${theme.glow}`}>
              {emoji}
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3 flex-wrap">
                {crop.name}
                <StatusBadge label={crop.status} />
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {crop.variety || crop.category} · Categorized in <strong className="text-emerald-400">{crop.category}</strong> · Listed {createdDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate(`/farmer/crops/${id}/edit`)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/15 transition-all"
          >
            Edit Specs
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {deleting ? 'Removing…' : 'Delete'}
          </button>
        </div>
      </div>

      {/* APMC Mandi Benchmark Alert for this specific crop */}
      {apmcMatch && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Daily APMC Market Benchmark ({apmcMatch.mandiName})
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Current modal auction rate: <strong className="text-emerald-400 text-sm">₹{apmcMatch.modalPriceKg}/{crop.unit}</strong> (₹{apmcMatch.modalPriceQtl}/qtl)
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              {apmcMatch.trend === 'up' ? '▲ Rising' : '● Stable'}
            </span>
          </div>
        </div>
      )}

      <StatusTimeline current={crop.status} />

      {/* Quantity & Stock Availability */}
      <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
          <span>⚖️</span>
          <span>Harvest Quantity & Stock Allocation</span>
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/5">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Harvest</p>
            <p className="text-2xl font-black text-white mt-1">
              {crop.totalQty} <span className="text-sm font-normal text-slate-400">{crop.unit}</span>
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
            <p className="text-[11px] text-emerald-300 font-semibold uppercase">Available for Buyers</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {crop.availableQty} <span className="text-sm font-normal text-emerald-300">{crop.unit}</span>
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-white/5">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Pre-Booked</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {crop.totalQty - crop.availableQty} <span className="text-sm font-normal text-slate-400">{crop.unit}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
          <span>Inventory Availability Ratio</span>
          <span className="text-emerald-400 font-bold">{availPct}% uncommitted</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${availPct}%` }}
          />
        </div>
      </div>

      <Section title="Crop Specifications" icon="🌱">
        <Row label="Crop Name"        value={crop.name} />
        <Row label="Variety / Hybrid" value={crop.variety} />
        <Row label="Category"         value={crop.category} />
        <Row label="Quality Grade"    value={crop.grade} />
      </Section>

      <Section title="Harvest Timeline & Freshness" icon="📅">
        <Row label="Expected Harvest Date" value={harvestDate} />
        <Row label="Shelf Freshness Life"  value={crop.shelfLifeDays ? `${crop.shelfLifeDays} days` : '—'} />
      </Section>

      <Section title="Pricing Structure" icon="💰">
        <Row label="Farmer Target Price"    value={`₹${crop.expectedPrice} / ${crop.unit}`} highlight large />
        <Row label="Floor Minimum Price"    value={crop.minPrice ? `₹${crop.minPrice} / ${crop.unit}` : '—'} />
      </Section>

      <Section title="Farm Geo-Location & Farmer Contact" icon="📍">
        <Row label="Farm Location" value={crop.farmLocation} />
        <Row label="Registered Farmer" value={user?.name || 'Verified Farmer'} />
        <Row label="Direct Contact" value={user?.mobile || 'Verified KYC'} />
      </Section>

      {crop.notes && (
        <Section title="Cultivation & Storage Notes" icon="📝">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{crop.notes}</p>
        </Section>
      )}
    </div>
  )
}
