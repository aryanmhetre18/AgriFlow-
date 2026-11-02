import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  APMC_MANDIS,
  APMC_LIVE_RATES,
  DEMANDING_CROPS,
  ALL_DISTRICTS,
  MAHARASHTRA_DISTRICTS_DATA,
  normalizeCropName,
  getMandiDistance,
  calculateApmcArbitrage,
} from '../../data/apmcMarketData.js'
import { getCropEmoji, getCropTheme } from '../../utils/cropUtils.js'

const CATEGORIES = ['All Demanding Crops', 'Vegetables', 'Fruits', 'Grains & Spices']

export default function ApmcPriceLookup({ farmerDistrict = 'Kolhapur', onSelectCrop }) {
  const [selectedDistrict, setSelectedDistrict] = useState(farmerDistrict)
  const [targetMandi, setTargetMandi] = useState('Pune APMC Market')
  const [selectedCategory, setSelectedCategory] = useState('All Demanding Crops')
  const [searchQuery, setSearchQuery] = useState('')

  // Custom dropdown states for scroll-down selection
  const [isDistrictOpen, setIsDistrictOpen] = useState(false)
  const [districtSearch, setDistrictSearch] = useState('')
  const [isTargetOpen, setIsTargetOpen] = useState(false)
  const [targetSearch, setTargetSearch] = useState('')

  const districtRef = useRef(null)
  const targetRef = useRef(null)

  // Custom crop name input mechanism requested by user
  const [cropInputText, setCropInputText] = useState('Tomato')
  const [activeCrop, setActiveCrop] = useState('Tomato')

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (districtRef.current && !districtRef.current.contains(event.target)) {
        setIsDistrictOpen(false)
      }
      if (targetRef.current && !targetRef.current.contains(event.target)) {
        setIsTargetOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filtered Maharashtra districts for the scroll down menu
  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return MAHARASHTRA_DISTRICTS_DATA
    const q = districtSearch.toLowerCase()
    return MAHARASHTRA_DISTRICTS_DATA.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.displayName.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q)
    )
  }, [districtSearch])

  // Current district object with display name & region
  const currentDistrictObj = useMemo(() => {
    return (
      MAHARASHTRA_DISTRICTS_DATA.find(
        (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
      ) || {
        name: selectedDistrict,
        displayName: selectedDistrict,
        region: 'Maharashtra',
      }
    )
  }, [selectedDistrict])

  // Available comparison mandis
  const comparisonMandis = useMemo(() => {
    return APMC_MANDIS.filter(
      (m) => !m.name.toLowerCase().includes(selectedDistrict.toLowerCase())
    )
  }, [selectedDistrict])

  // Filtered comparison mandis for scroll down menu
  const filteredTargetMandis = useMemo(() => {
    if (!targetSearch.trim()) return comparisonMandis
    const q = targetSearch.toLowerCase()
    return comparisonMandis.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q)
    )
  }, [comparisonMandis, targetSearch])

  // Filtered live rates (strictly excluding flowers)
  const filteredRates = useMemo(() => {
    return APMC_LIVE_RATES.filter((item) => {
      // Exclude flowers
      if (item.category === 'Flowers') return false

      const matchCat =
        selectedCategory === 'All Demanding Crops' ||
        (selectedCategory === 'Vegetables' && item.category === 'Vegetables') ||
        (selectedCategory === 'Fruits' && item.category === 'Fruits') ||
        (selectedCategory === 'Grains & Spices' &&
          (item.category === 'Grains & Cereals' || item.category === 'Spices & Herbs' || item.category === 'Oilseeds'))

      const matchSearch =
        !searchQuery ||
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mandiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variety.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCat && matchSearch
    })
  }, [selectedCategory, searchQuery])

  // Real-time arbitrage calculation for the active crop entered by user
  const arbitrage = useMemo(() => {
    return calculateApmcArbitrage(activeCrop, selectedDistrict, targetMandi)
  }, [activeCrop, selectedDistrict, targetMandi])

  // Handle user crop search submission / input
  function handleCropSubmit(e) {
    if (e) e.preventDefault()
    if (!cropInputText.trim()) return
    const canonical = normalizeCropName(cropInputText)
    setActiveCrop(canonical)
  }

  function handleSelectDemandingCrop(cropName) {
    setCropInputText(cropName)
    setActiveCrop(cropName)
  }

  const activeEmoji = getCropEmoji(arbitrage?.cropName || activeCrop)
  const activeTheme = getCropTheme(arbitrage?.cropName || activeCrop)

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-emerald-500/20 backdrop-blur-xl p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden mb-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Header Section ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-30">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                Real-Time APMC Market Price Intelligence
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Mandi Feed
                </span>
              </h2>
              <p className="text-xs lg:text-sm text-slate-300 mt-1">
                Enter your crop name to instantly get today's accurate APMC Market rates, comparison, and transport arbitrage
              </p>
            </div>
          </div>
        </div>

        {/* ── Interactive Location Selectors with Custom Scroll-Down Dropdowns ── */}
        <div className="flex flex-wrap items-center gap-3 relative z-40">

          {/* 1. Custom Scroll-Down District Selector (All 36 Maharashtra Districts) */}
          <div className="relative" ref={districtRef}>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">Your District:</div>
            <button
              type="button"
              onClick={() => {
                setIsDistrictOpen(!isDistrictOpen)
                setIsTargetOpen(false)
              }}
              className="flex items-center justify-between gap-3 bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/35 hover:border-emerald-400 rounded-xl px-3.5 py-2 text-xs transition-all duration-200 shadow-md min-w-[210px] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-emerald-400 text-sm">📍</span>
                <div className="text-left truncate">
                  <span className="text-white font-bold block truncate">
                    {currentDistrictObj.displayName || selectedDistrict}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 block">
                    {currentDistrictObj.region}
                  </span>
                </div>
              </div>
              <span className={`text-[10px] text-emerald-400 transition-transform duration-200 flex-shrink-0 ${isDistrictOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Scroll Down Menu for Districts */}
            {isDistrictOpen && (
              <div className="absolute left-0 lg:right-0 lg:left-auto top-full mt-2 w-80 sm:w-96 z-50 bg-slate-900/98 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150">
                {/* Search Bar inside Dropdown */}
                <div className="mb-2.5 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="Search 36+ Maharashtra districts..."
                    className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/30 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    autoFocus
                  />
                  {districtSearch && (
                    <button
                      type="button"
                      onClick={() => setDistrictSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Header count info */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1 border-b border-white/5 mb-1.5">
                  <span className="font-bold text-emerald-400">Maharashtra Districts & Hubs</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                    {filteredDistricts.length} districts
                  </span>
                </div>

                {/* ── Scroll Down Container with smooth scroll & clear scrollbar ── */}
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scroll-smooth overscroll-contain">
                  {filteredDistricts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No district matching "{districtSearch}"
                    </div>
                  ) : (
                    filteredDistricts.map((d) => {
                      const isSelected = selectedDistrict.toLowerCase() === d.name.toLowerCase()
                      return (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() => {
                            setSelectedDistrict(d.name)
                            setIsDistrictOpen(false)
                            setDistrictSearch('')
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-150 ${isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm">📍</span>
                            <div>
                              <div className="font-semibold text-white">{d.displayName}</div>
                              <span className="text-[10px] text-slate-400">{d.region}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-emerald-400 font-black text-sm">✓</span>
                          )}
                        </button>
                      )
                    })
                  )}
                </div>

                {/* Scroll Down Helper Footer */}
                <div className="mt-2 pt-2 border-t border-white/10 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                  <span>↕️</span>
                  <span>Scroll down to select from all 36 Maharashtra districts</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Custom Scroll-Down Target Mandi Selector */}
          <div className="relative" ref={targetRef}>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-1">Compare with:</div>
            <button
              type="button"
              onClick={() => {
                setIsTargetOpen(!isTargetOpen)
                setIsDistrictOpen(false)
              }}
              className="flex items-center justify-between gap-3 bg-slate-800/90 hover:bg-slate-800 border border-amber-500/35 hover:border-amber-400 rounded-xl px-3.5 py-2 text-xs transition-all duration-200 shadow-md min-w-[210px] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-amber-400 text-sm">🏛️</span>
                <div className="text-left truncate">
                  <span className="text-white font-bold block truncate">
                    {targetMandi}
                  </span>
                  <span className="text-[10px] text-amber-400/80 block">
                    {getMandiDistance(selectedDistrict, targetMandi)} km transit
                  </span>
                </div>
              </div>
              <span className={`text-[10px] text-amber-400 transition-transform duration-200 flex-shrink-0 ${isTargetOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Scroll Down Menu for Target Mandi */}
            {isTargetOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 bg-slate-900/98 backdrop-blur-2xl border border-amber-500/40 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150">
                {/* Search Bar inside Dropdown */}
                <div className="mb-2.5 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                  <input
                    type="text"
                    value={targetSearch}
                    onChange={(e) => setTargetSearch(e.target.value)}
                    placeholder="Search APMC Market or specialty..."
                    className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-950/90 border border-amber-500/30 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                    autoFocus
                  />
                  {targetSearch && (
                    <button
                      type="button"
                      onClick={() => setTargetSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1 border-b border-white/5 mb-1.5">
                  <span className="font-bold text-amber-400">Maharashtra APMC Markets</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                    {filteredTargetMandis.length} markets
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scroll-smooth overscroll-contain">
                  {filteredTargetMandis.map((mandi) => {
                    const isSelected = targetMandi === mandi.name
                    const dist = getMandiDistance(selectedDistrict, mandi.name)
                    return (
                      <button
                        key={mandi.name}
                        type="button"
                        onClick={() => {
                          setTargetMandi(mandi.name)
                          setIsTargetOpen(false)
                          setTargetSearch('')
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-150 ${isSelected
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">🏛️</span>
                          <div>
                            <div className="font-semibold text-white">{mandi.name}</div>
                            <span className="text-[10px] text-slate-400">{mandi.specialty}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {dist} km
                          </span>
                          {isSelected && <span className="text-amber-400 font-black text-sm">✓</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                  <span>↕️</span>
                  <span>Scroll down to compare across all Maharashtra APMC Markets</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mechanism to Enter Crop Name & Get Today's APMC Price ── */}
      <div className="my-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900/95 to-amber-950/70 border border-emerald-500/35 shadow-xl relative z-10">

        {/* Input Bar: Enter Crop Name */}
        <div className="mb-5 pb-5 border-b border-white/10">
          <form onSubmit={handleCropSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                {activeEmoji}
              </span>
              <input
                type="text"
                value={cropInputText}
                onChange={(e) => {
                  setCropInputText(e.target.value)
                  if (e.target.value.trim().length >= 2) {
                    setActiveCrop(normalizeCropName(e.target.value))
                  }
                }}
                placeholder="Enter crop name (e.g., Tomato, Potato, Brinjal, Onion, Methi, Palak, Garlic, Ginger)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 flex-shrink-0"
            >
              <span>🔍 Get Today's Price</span>
            </button>
          </form>

          {/* Demanding Crops Quick Selector Pills — STRICTLY NO FLOWERS (Tomato, Potato, Brinjal, Onion, Methi, Palak, Garlic, Ginger) */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Popular Demanding Crops:
            </span>
            {DEMANDING_CROPS.map((c) => {
              const isSelected = activeCrop.toLowerCase() === c.toLowerCase()
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSelectDemandingCrop(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${isSelected
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10'
                    }`}
                >
                  <span className="text-sm">{getCropEmoji(c)}</span>
                  <span>{c}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Active Crop Today's APMC Price Result Header ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${activeTheme.bg} ${activeTheme.border} ${activeTheme.glow}`}>
              {activeEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                  Today's APMC Market Auction Rates
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  {selectedDistrict} ➔ {targetMandi}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2">
                {arbitrage?.cropName || activeCrop} Price Benchmark
              </h3>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-slate-950/60 px-4 py-2 rounded-xl border border-white/10">
            <span>Market Status: </span>
            <strong className="text-emerald-400">Open & Active Today</strong>
          </div>
        </div>

        {/* ── Price Comparison & Arbitrage Grid ── */}
        {arbitrage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {/* 1. Local Mandi Rate */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 shadow-lg">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">📍 {arbitrage.localMandi}</span>
                <span className="text-emerald-400 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15">Local</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">₹{arbitrage.localPriceKg}</span>
                <span className="text-xs text-slate-400">/ kg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">₹{arbitrage.localPriceQtl} / quintal</p>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span>Range: ₹{Math.round(arbitrage.localMinPriceQtl / 100)}–₹{Math.round(arbitrage.localMaxPriceQtl / 100)}/kg</span>
                <span className="text-emerald-400 font-semibold">{arbitrage.localTrendDiff}</span>
              </div>
            </div>

            {/* 2. Target Mandi Rate (e.g. Pune APMC) */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-amber-500/40 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-amber-300">🏛️ {arbitrage.targetMandi}</span>
                <span className="text-slate-400 text-[10px]">{arbitrage.distanceKm} km</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-amber-400">₹{arbitrage.targetPriceKg}</span>
                <span className="text-xs text-slate-400">/ kg</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-bold">
                +{Number(arbitrage.grossDiffPerKg).toFixed(1)} ₹/kg (+{Number(arbitrage.grossDiffPerKg * 100).toFixed(0)} ₹/qtl)
              </p>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span>Range: ₹{Math.round(arbitrage.targetMinPriceQtl / 100)}–₹{Math.round(arbitrage.targetMaxPriceQtl / 100)}/kg</span>
                <span className="text-emerald-400 font-semibold">{arbitrage.targetTrendDiff}</span>
              </div>
            </div>

            {/* 3. Transport Freight */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 shadow-lg">
              <p className="text-[11px] text-slate-400 font-medium">Logistics Freight ({arbitrage.distanceKm} km)</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-300">₹{arbitrage.freightPerKg}</span>
                <span className="text-xs text-slate-400">/ kg</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Est. ₹{Math.round(arbitrage.freightPerKg * 100)} / quintal transit</p>
              <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-teal-300">
                <span>Direct truck pickup available</span>
              </div>
            </div>

            {/* 4. Net Margin Advantage */}
            <div className={`rounded-2xl p-4 border shadow-xl flex flex-col justify-between ${arbitrage.isProfitable
                ? 'bg-emerald-950/80 border-emerald-500/50 shadow-emerald-950/50'
                : 'bg-slate-800/80 border-white/10'
              }`}>
              <div>
                <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <span>✨ Net Margin Advantage</span>
                </p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-3xl font-black ${arbitrage.isProfitable ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {arbitrage.netProfitPerKg > 0 ? `+₹${arbitrage.netProfitPerKg}` : `₹${arbitrage.netProfitPerKg}`}
                  </span>
                  <span className="text-xs text-slate-400">/ kg net</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-200 mt-2 font-medium leading-tight">
                {arbitrage.isProfitable ? (
                  <span className="text-emerald-300">
                    💡 Sell at <strong>{arbitrage.targetMandi}</strong> for maximum profit!
                  </span>
                ) : (
                  <span className="text-slate-300">Local APMC Market is optimal after freight deduction.</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Category Filter Pills & Live Search for Grid (NO FLOWERS) ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-white/10'
                }`}
            >
              <span>{cat === 'All Demanding Crops' ? '🌾' : cat === 'Vegetables' ? '🥦' : cat === 'Fruits' ? '🍎' : '🌶️'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Search Input for Grid */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search produce or mandi…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/90 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* ── Mandi Rates Grid (Strictly Demanding Crops: Tomato, Potato, Brinjal, Onion, Methi, Palak, Garlic, Ginger, etc.) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {filteredRates.map((rate, idx) => {
          const theme = getCropTheme(rate.cropName, rate.category)
          const distance = getMandiDistance(selectedDistrict, rate.mandiName)

          return (
            <div
              key={`${rate.cropName}-${rate.mandiName}-${idx}`}
              className="bg-slate-800/60 hover:bg-slate-800/90 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Crop Logo + Mandi Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${theme.bg} ${theme.border}`}>
                      {getCropEmoji(rate.cropName, rate.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                        {rate.cropName}
                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-white/5">
                          {rate.category}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{rate.variety}</p>
                    </div>
                  </div>

                  {/* Trend Indicator */}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${rate.trend === 'up'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : rate.trend === 'down'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-700/60 text-slate-300 border border-white/10'
                    }`}>
                    {rate.trend === 'up' ? '▲' : rate.trend === 'down' ? '▼' : '●'}
                    {rate.trendDiff}
                  </span>
                </div>

                {/* Mandi & Distance */}
                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-900/60 border border-white/5 mb-3">
                  <span className="font-medium text-slate-200 flex items-center gap-1">
                    <span>🏛️</span> {rate.mandiName}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {distance} km away
                  </span>
                </div>

                {/* Price Display */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Modal (Benchmark)</span>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">
                      ₹{rate.modalPriceKg} <span className="text-xs font-normal text-slate-400">/{rate.unit}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">₹{rate.modalPriceQtl} / quintal</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily Range</span>
                    <div className="text-sm font-bold text-slate-200 mt-1">
                      ₹{rate.minPriceQtl / 100} – ₹{rate.maxPriceQtl / 100}
                    </div>
                    <span className="text-[10px] text-slate-400">Min to Max / kg</span>
                  </div>
                </div>

                {/* Arrival stats */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
                  <span>📦 Arrivals: <strong className="text-slate-200">{rate.arrivalsQtl} Qtl</strong></span>
                  <span>🕒 {rate.lastUpdated}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  handleSelectDemandingCrop(rate.cropName)
                  if (onSelectCrop) onSelectCrop(rate)
                }}
                className="w-full mt-2 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span>Compare & Calculate Arbitrage</span>
                <span>➔</span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
