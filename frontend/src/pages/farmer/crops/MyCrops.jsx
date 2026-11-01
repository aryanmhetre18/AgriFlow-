import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCrops } from '../../../context/CropsContext.jsx'
import CropListCard from '../../../components/crops/CropListCard.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import ApmcPriceLookup from '../../../components/farmer/ApmcPriceLookup.jsx'
import { CROP_STATUSES } from '../../../data/cropData.js'
import { CROP_CATEGORIES, getCropEmoji } from '../../../utils/cropUtils.js'

// ── Stat card with dark glassmorphic styling ─────────────────────────────────
function StatCard({ label, value, icon, glowColor, textColor, borderColor }) {
  return (
    <div className={`rounded-2xl p-5 bg-slate-900/85 backdrop-blur-xl border ${borderColor} shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${glowColor}`} />
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">{label}</p>
          <p className={`text-3xl font-black mt-1 ${textColor}`}>{value}</p>
        </div>
        <div className="text-2xl p-3 rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
      </div>
    </div>
  )
}

// ── Dark Skeleton loader ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-slate-900/85 border border-white/10 rounded-2xl animate-pulse p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800 rounded-full w-3/4" />
          <div className="h-3 bg-slate-800/60 rounded-full w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 bg-slate-800/60 rounded-full w-1/3" />
            <div className="h-3 bg-slate-800 rounded-full w-1/4" />
          </div>
        ))}
      </div>
      <div className="h-2 bg-slate-800 rounded-full mt-3" />
    </div>
  )
}

// ── Dark Delete modal ────────────────────────────────────────────────────────
function DeleteModal({ crop, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/15 rounded-3xl shadow-2xl p-6 max-w-sm w-full text-white">
        <div className="w-12 h-12 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="font-bold text-white text-lg">Remove Crop Listing?</h3>
        <p className="text-sm text-slate-300 mt-1">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-rose-400">{crop?.name}</span>?
          This action will immediately cancel active buyer listings.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm font-medium
                       text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold
                       hover:bg-rose-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30"
          >
            {deleting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Deleting…
              </>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Dark Empty state ─────────────────────────────────────────────────────────
function EmptyState({ hasFilter, onClear, onAdd }) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/60 rounded-3xl border border-white/10 p-8">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10">🔍</div>
        <p className="font-bold text-white text-lg">No crops match your active filter</p>
        <p className="text-sm text-slate-400 mt-1">Try selecting a different crop category or status.</p>
        <button onClick={onClear} className="mt-4 px-4 py-2 rounded-xl text-sm text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 font-semibold transition-all">
          Clear all filters
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/60 rounded-3xl border border-white/10 p-8">
      <div className="w-16 h-16 bg-emerald-500/15 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-emerald-500/30">🌾</div>
      <p className="font-bold text-white text-lg">No crops listed yet</p>
      <p className="text-sm text-slate-300 mt-1 max-w-sm">
        List your fruits, vegetables, flowers, or grains to connect with direct buyers and access daily APMC Market rates.
      </p>
      <button onClick={onAdd} className="btn-primary mt-6 text-sm px-6 shadow-lg shadow-emerald-900/40">
        Add Your First Crop
      </button>
    </div>
  )
}

// ── Error banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="bg-rose-950/60 border border-rose-500/40 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 mb-6 text-rose-200">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button onClick={onRetry} className="text-sm font-semibold text-rose-300 hover:text-white underline flex-shrink-0">
        Retry
      </button>
    </div>
  )
}

// ── Main MyCrops Page ─────────────────────────────────────────────────────────
export default function MyCrops() {
  const navigate = useNavigate()
  const { crops, loading, error, fetchCrops, deleteCrop } = useCrops()

  const [search,         setSearch]         = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter,   setStatusFilter]   = useState('All')
  const [deleteTarget,   setDeleteTarget]   = useState(null)
  const [deleting,       setDeleting]       = useState(false)
  const [showApmcMandi,  setShowApmcMandi]  = useState(true)

  const total        = crops.length
  const preHarvest   = crops.filter((c) => c.status === 'Pre-Harvest').length
  const harvestReady = crops.filter((c) => c.status === 'Harvest Ready').length
  const active       = crops.filter((c) => c.status !== 'Delivered').length

  const filtered = useMemo(() => crops.filter((c) => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.variety || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.farmLocation || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    const matchCategory = categoryFilter === 'All' || c.category === categoryFilter
    return matchSearch && matchStatus && matchCategory
  }), [crops, search, statusFilter, categoryFilter])

  const hasFilter = search.trim() !== '' || statusFilter !== 'All' || categoryFilter !== 'All'

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCrop(deleteTarget.id)
      setDeleteTarget(null)
    } catch {
      // error handled in context
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>My Farm Harvests</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {loading ? 'Syncing…' : `${total} active crop${total !== 1 ? 's' : ''}`}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your registered crops with real-time APMC Market benchmark prices across high-demand produce like Tomato, Potato, Brinjal, Onion, Methi, Palak, Garlic, and Ginger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApmcMandi((prev) => !prev)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center gap-2 ${
              showApmcMandi
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-950/20'
                : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
            }`}
          >
            <span>🏛️</span>
            <span>{showApmcMandi ? 'Hide APMC Market' : 'Show APMC Market Rates'}</span>
          </button>

          <button
            onClick={() => navigate('/farmer/crops/add')}
            className="btn-primary text-xs lg:text-sm py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Crop
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchCrops} />}

      {/* ── APMC Market Real-Time Price Lookup Section ── */}
      {showApmcMandi && (
        <ApmcPriceLookup farmerDistrict="Kolhapur" />
      )}

      {/* ── Dark Glassmorphic Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Crops"
          value={loading ? '—' : total}
          icon="🌾"
          glowColor="bg-slate-500/10"
          textColor="text-white"
          borderColor="border-white/10"
        />
        <StatCard
          label="Pre-Harvest"
          value={loading ? '—' : preHarvest}
          icon="🌱"
          glowColor="bg-amber-500/15"
          textColor="text-amber-400"
          borderColor="border-amber-500/30"
        />
        <StatCard
          label="Harvest Ready"
          value={loading ? '—' : harvestReady}
          icon="✨"
          glowColor="bg-emerald-500/15"
          textColor="text-emerald-400"
          borderColor="border-emerald-500/30"
        />
        <StatCard
          label="Active In Market"
          value={loading ? '—' : active}
          icon="📦"
          glowColor="bg-cyan-500/15"
          textColor="text-cyan-400"
          borderColor="border-cyan-500/30"
        />
      </div>

      {/* ── Categories Bar (Fruits, Vegetables, Flowers, Grains) ── */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto scrollbar-none backdrop-blur-xl">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2 pr-1 flex-shrink-0">
          Category:
        </span>
        {CROP_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              categoryFilter === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/5'
            }`}
          >
            <span>{cat === 'All' ? '🌱' : getCropEmoji('', cat)}</span>
            <span>{cat}</span>
            {cat !== 'All' && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                categoryFilter === cat ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-400'
              }`}>
                {crops.filter((c) => c.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Search + Status Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search crop name, variety, or farm location…"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-3 rounded-xl bg-slate-900/90 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 sm:w-56 cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All" className="bg-slate-900 text-white">All Statuses</option>
          {CROP_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
          ))}
        </select>
      </div>

      {/* ── Crop Cards Grid ── */}
      {loading && crops.length === 0 ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          hasFilter={hasFilter}
          onClear={() => { setSearch(''); setStatusFilter('All'); setCategoryFilter('All') }}
          onAdd={() => navigate('/farmer/crops/add')}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((crop) => (
            <CropListCard
              key={crop.id}
              crop={crop}
              onDelete={(id) => setDeleteTarget(crops.find((c) => c.id === id))}
            />
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteModal
          crop={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  )
}
