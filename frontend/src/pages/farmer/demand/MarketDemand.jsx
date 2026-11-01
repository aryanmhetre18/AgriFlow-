import React, { useState, useMemo } from 'react'
import { useDemand } from '../../../context/DemandContext.jsx'
import DemandCard from '../../../components/demand/DemandCard.jsx'
import PageHeader from '../../../components/ui/PageHeader.jsx'
import { CROP_CATEGORIES, getCropEmoji } from '../../../utils/cropUtils.js'

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
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between">
          <div className="h-3 bg-slate-800/60 rounded-full w-1/3" />
          <div className="h-3 bg-slate-800 rounded-full w-1/4" />
        </div>
      ))}
    </div>
  )
}

// ── Dark Summary Stat Pill ───────────────────────────────────────────────────
function StatPill({ label, value, active, onClick, color = 'emerald' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 border ${
        active
          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/25'
          : 'bg-slate-900/80 border-white/10 text-slate-300 hover:bg-slate-800/80 hover:text-white'
      }`}
    >
      <span>{label}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
        active ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-200'
      }`}>
        {value}
      </span>
    </button>
  )
}

export default function MarketDemand() {
  const { demands, loading, error } = useDemand()

  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')
  const [level,    setLevel]    = useState('All')
  const [location, setLocation] = useState('')

  // Derived locations from data
  const locations = useMemo(() => {
    const locs = [...new Set(demands.map((d) => d.location))]
    return ['All Locations', ...locs.sort()]
  }, [demands])

  // Stats
  const highCount   = demands.filter((d) => d.demandLevel === 'High').length
  const mediumCount = demands.filter((d) => d.demandLevel === 'Medium').length
  const lowCount    = demands.filter((d) => d.demandLevel === 'Low').length

  const filtered = useMemo(() => demands.filter((d) => {
    const matchSearch   = !search || d.cropName.toLowerCase().includes(search.toLowerCase()) || (d.location || '').toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || d.category === category
    const matchLevel    = level === 'All' || d.demandLevel === level
    const matchLocation = !location || location === 'All Locations' || d.location === location
    return matchSearch && matchCategory && matchLevel && matchLocation
  }), [demands, search, category, level, location])

  if (error) {
    return (
      <div className="bg-rose-950/60 border border-rose-500/30 rounded-2xl p-6 text-center text-rose-200">
        <p className="text-base font-bold mb-1">Failed to load market demand signals</p>
        <p className="text-xs text-rose-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <span>Regional Market Demand</span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {demands.length} Signals Active
          </span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time buyer demand signals, wholesale procurement quotas, and fair market price ranges.
        </p>
      </div>

      {/* Quick filter pills */}
      <div className="flex flex-wrap gap-2.5">
        <StatPill label="All Signals" value={demands.length} active={level === 'All'}    onClick={() => setLevel('All')} />
        <StatPill label="🔴 High Demand" value={highCount}   active={level === 'High'}   onClick={() => setLevel('High')} />
        <StatPill label="🟡 Medium Demand" value={mediumCount} active={level === 'Medium'} onClick={() => setLevel('Medium')} />
        <StatPill label="⚪ Low Demand"    value={lowCount}    active={level === 'Low'}    onClick={() => setLevel('Low')} />
      </div>

      {/* Categories Bar */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto scrollbar-none backdrop-blur-xl">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2 pr-1 flex-shrink-0">
          Category:
        </span>
        {CROP_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              category === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/5'
            }`}
          >
            <span>{cat === 'All' ? '🌱' : getCropEmoji('', cat)}</span>
            <span>{cat}</span>
            {cat !== 'All' && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                category === cat ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-700 text-slate-400'
              }`}>
                {demands.filter((d) => d.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Location Select */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search crop or procurement region…"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-3 rounded-xl bg-slate-900/90 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 sm:w-64 cursor-pointer"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {locations.map((l) => (
            <option key={l} value={l} className="bg-slate-900 text-white">{l}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/60 rounded-3xl border border-white/10 p-8">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-white/10">📊</div>
          <p className="font-bold text-white text-lg">No demand signals match your filter</p>
          <p className="text-sm text-slate-400 mt-1">Try selecting another category or clearing search parameters.</p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); setLocation('') }}
            className="mt-4 px-4 py-2 rounded-xl text-sm text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 font-semibold transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((d) => <DemandCard key={d.id} demand={d} />)}
        </div>
      )}
    </div>
  )
}
