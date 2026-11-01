import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import LanguageSelector from '../components/common/LanguageSelector.jsx'
import { useTranslation } from '../context/LanguageContext.jsx'
import { translations } from '../locales/translations.js'

/* ─── Real-Time APMC Market Ticker Bar ─────────────────────────────────────── */
function LiveMarketTicker() {
  const tickerItems = [
    { crop: '🌾 Malwa Sharbati Wheat', price: '₹2,480/q', change: '+3.4%', up: true, mandi: 'Indore Mandi' },
    { crop: '🍚 1121 Taraori Basmati Rice', price: '₹4,180/q', change: '+2.1%', up: true, mandi: 'Karnal Mandi' },
    { crop: '🍅 Pimpalgaon Hybrid Tomato', price: '₹2,850/q', change: '+5.8%', up: true, mandi: 'Nashik Mandi' },
    { crop: '🧅 Lasalgaon Red Onion', price: '₹1,920/q', change: '-1.4%', up: false, mandi: 'Lasalgaon Mandi' },
    { crop: '🫘 Organic Malwa Soybean', price: '₹4,640/q', change: '+2.7%', up: true, mandi: 'Ujjain Mandi' },
    { crop: '🌿 Saurashtra Long Cotton', price: '₹7,250/q', change: '+4.1%', up: true, mandi: 'Rajkot Mandi' },
    { crop: '🌽 Hybrid Sweet Corn', price: '₹2,150/q', change: '+1.2%', up: true, mandi: 'Pune Mandi' },
    { crop: '🥔 Agra Jyoti Potato', price: '₹1,680/q', change: '+0.8%', up: true, mandi: 'Agra Mandi' },
  ]

  // Double items for seamless infinite marquee loop
  const list = [...tickerItems, ...tickerItems]

  return (
    <div className="bg-slate-950/95 backdrop-blur-md text-slate-300 border-b border-emerald-500/20 text-xs py-2 overflow-hidden select-none z-40 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="flex items-center gap-2 pr-4 font-mono font-bold text-emerald-400 shrink-0 border-r border-emerald-500/20 text-[11px] uppercase tracking-wider">
          <span className="text-base">🌾</span>
          <span>Krishi Mandi Live</span>
        </div>
        <div className="overflow-hidden flex-1 relative mask-fade-edges">
          <div className="animate-marquee gap-8 items-center flex">
            {list.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 font-medium shrink-0 px-2">
                <span className="text-white font-semibold">{item.crop}</span>
                <span className="font-mono text-emerald-300 font-bold">{item.price}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    item.up ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {item.change}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline font-sans">({item.mandi})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


/* ─── Floating Glassmorphic Navbar ────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-9 sm:top-10 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-full border ${
          scrolled
            ? 'bg-slate-900/85 backdrop-blur-xl shadow-2xl shadow-black/40 border-emerald-500/30 py-2 px-3 sm:px-4'
            : 'bg-slate-950/70 backdrop-blur-lg shadow-xl shadow-black/20 border-white/15 py-2.5 px-3.5 sm:px-5'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 group pl-1">
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-all duration-300 ring-2 ring-emerald-400/40">
              <span className="text-white text-xs font-black tracking-widest">AF</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                AgriFlow
              </span>
              <span className="text-[10px] font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10">
            <a
              href="#about"
              className="px-4 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
              {t('about', 'About')}
            </a>
            <a
              href="#calculator"
              className="px-4 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
              Profit Calculator
            </a>
            <a
              href="#traceability"
              className="px-4 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
              Blockchain Trace
            </a>
            <a
              href="#how-it-works"
              className="px-4 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            >
              {t('how_it_works', 'How It Works')}
            </a>
          </div>

          {/* Right Actions: Language Selector + Login/CTA */}
          <div className="hidden md:flex items-center gap-2 pr-1">
            <LanguageSelector variant="pill" />
            <Link
              to="/farmer/login"
              className="text-xs font-semibold text-slate-200 hover:text-emerald-400 px-3 py-1.5 transition-colors"
            >
              {t('login', 'Login')}
            </Link>
            <Link
              to="/farmer/login"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-1.5"
            >
              <span>{t('get_started', 'Get Started')}</span>
              <span className="text-[10px]">→</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 md:hidden pr-1">
            <LanguageSelector variant="pill" />
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle Navigation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Capsule */}
        {open && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 px-2 pb-2 space-y-1.5 animate-fadeIn">
            <a
              href="#about"
              className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-colors"
              onClick={() => setOpen(false)}
            >
              {t('about', 'About')}
            </a>
            <a
              href="#calculator"
              className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-colors"
              onClick={() => setOpen(false)}
            >
              Profit Calculator
            </a>
            <a
              href="#traceability"
              className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-colors"
              onClick={() => setOpen(false)}
            >
              Blockchain Trace
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-xl transition-colors"
              onClick={() => setOpen(false)}
            >
              {t('how_it_works', 'How It Works')}
            </a>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <Link
                to="/farmer/login"
                className="flex-1 text-center py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl"
                onClick={() => setOpen(false)}
              >
                {t('login', 'Login')}
              </Link>
              <Link
                to="/farmer/login"
                className="flex-1 text-center py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs"
                onClick={() => setOpen(false)}
              >
                {t('get_started', 'Get Started')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

/* ─── Hero Section with Dynamic Background Switcher & Ken Burns Effect ─────── */
function Hero() {
  const navigate = useNavigate()
  const { t, language } = useTranslation()

  // 3 High-Definition Background Scenes
  const scenes = [
    {
      id: 0,
      name: '🌱 Smart Fields',
      tag: 'IoT Drones & Soil Telemetry',
      image: '/images/hero-smart-farm.jpg',
      badge: 'Autonomous Crop Health AI',
    },
    {
      id: 1,
      name: '🚛 Cold Chain Logistics',
      tag: 'Polygon Amoy Verified Transport',
      image: '/images/supply-chain.jpg',
      badge: 'Live GPS & Reefer Telemetry',
    },
    {
      id: 2,
      name: '📊 AI Yield Analytics',
      tag: 'Direct Farmer to Buyer Match',
      image: '/images/harvest-ai.jpg',
      badge: 'Automated Fair Price Discovery',
    },
  ]

  const [activeScene, setActiveScene] = useState(0)

  // Rotating words
  const words = translations[language]?.dynamic_words || [
    'AI Matching',
    'Blockchain Traceability',
    'Smart Pricing',
    'Wastage Prevention',
  ]
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  // Auto-rotate dynamic words
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length)
        setFade(true)
      }, 300)
    }, 3200)
    return () => clearInterval(timer)
  }, [words.length])

  // Auto-switch scenes every 8 seconds
  useEffect(() => {
    const sceneTimer = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % scenes.length)
    }, 8000)
    return () => clearInterval(sceneTimer)
  }, [scenes.length])

  return (
    <section className="relative pt-36 sm:pt-44 pb-20 sm:pb-28 px-4 overflow-hidden min-h-[96vh] flex items-center justify-center">
      {/* ── Dynamic High-Resolution Background Scene Layers ── */}
      <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden bg-slate-950">
        {scenes.map((scene, i) => (
          <div
            key={scene.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              activeScene === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={scene.image}
              alt={scene.name}
              className="w-full h-full object-cover object-center animate-kenburns filter brightness-[0.70] contrast-[1.08]"
            />
          </div>
        ))}
      </div>

      {/* ── Multi-Layer Cinematic Gradient Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 backdrop-blur-[2px] -z-10" />

      {/* ── Ambient Radial Lighting Auras ── */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-purple-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Dynamic Background Scene Selector Pills */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {scenes.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(i)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 backdrop-blur-md border ${
                activeScene === i
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-white/10 text-slate-300 border-white/15 hover:bg-white/15 hover:text-white'
              }`}
            >
              <span>{scene.name}</span>
              {activeScene === i && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* ── Main Hero Content ── */}
        <div className="text-center max-w-4xl mx-auto relative">
          {/* Active Scene Pill Badge + Authentic Kisan Direct Touch */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 farm-badge-gold text-xs font-black px-4 py-1.5 rounded-full shadow-lg animate-leaf-sway">
              <span>🌾</span>
              <span className="tracking-wider uppercase text-[11px] font-mono">
                100% Kisan-Centric · Direct Farm-Gate Trade
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-500/40 shadow-lg shadow-emerald-950/50">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="tracking-wider uppercase text-[11px] font-mono">
                {scenes[activeScene].badge}
              </span>
            </div>
          </div>

          {/* Heading with Dynamic Rotating Text */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.12] tracking-tight drop-shadow-md">
            {t('hero_title_prefix')}{' '}
            <span
              className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300 transition-all duration-300 transform ${
                fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
              }`}
            >
              {words[index] || words[0]}
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-black text-emerald-400 tracking-widest uppercase mt-5 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-emerald-400/40 inline-block" />
            <span>{t('hero_tagline')}</span>
            <span className="w-8 h-[2px] bg-emerald-400/40 inline-block" />
          </p>

          {/* Description */}
          <p className="mt-5 text-slate-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-sm">
            {t('hero_desc')}
          </p>

          {/* Dynamic Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('/farmer/login')}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 border border-emerald-400/30"
            >
              <span>🌾</span>
              <span>{t('cta_farmer')}</span>
            </button>
            <button
              onClick={() => navigate('/buyer/login')}
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-full border border-white/20 shadow-md hover:-translate-y-0.5 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🛒</span>
              <span>{t('cta_buyer')}</span>
            </button>
            <button
              onClick={() => navigate('/transporter/login')}
              className="w-full sm:w-auto bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 text-sm sm:text-base font-bold px-7 py-3.5 rounded-full border border-purple-500/30 shadow-md hover:-translate-y-0.5 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🚛</span>
              <span>Transporter Hub</span>
            </button>
          </div>

          {/* ── High-End Floating Feature Badges ── */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
            {/* Card 1: Polygon Amoy Verification */}
            <div className="glass-panel-dark p-4 rounded-2xl flex items-center gap-3.5 hover:scale-[1.02] hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-purple-900/60 border border-purple-500/30 text-purple-300 flex items-center justify-center text-xl shadow-inner shrink-0">
                ⛓️
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <p className="text-xs font-black tracking-tight text-white truncate">
                    {t('floating_chain_title')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
                    Amoy 80002
                  </span>
                  <p className="text-[11px] font-mono text-purple-300 font-semibold truncate">
                    {t('floating_chain_sub')}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: AI Match Engine */}
            <div className="glass-panel-dark p-4 rounded-2xl flex items-center gap-3.5 hover:scale-[1.02] hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-xl shadow-inner shrink-0">
                🌾
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black tracking-tight text-white truncate">
                    {t('floating_crop_title')}
                  </p>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                    98.4% Match
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                  {t('floating_crop_sub')}
                </p>
              </div>
            </div>

            {/* Card 3: Live Demand Surge */}
            <div className="glass-panel-dark p-4 rounded-2xl flex items-center gap-3.5 hover:scale-[1.02] hover:border-emerald-500/40 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-blue-900/60 border border-blue-500/30 text-blue-300 flex items-center justify-center text-xl shadow-inner shrink-0">
                🤖
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-tight text-white truncate">
                    {t('floating_ai_title')}
                  </span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold px-1.5 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                  {t('floating_ai_sub')}
                </p>
              </div>
            </div>
          </div>

          {/* High-Impact Stat Tiles */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl glass-panel-dark hover:border-emerald-500/30 transition-all">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">100%</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Tamper-Proof Ledger</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel-dark hover:border-emerald-500/30 transition-all">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">Polygon</p>
              <p className="text-xs text-slate-300 font-bold mt-1">PoS Testnet Amoy</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel-dark hover:border-emerald-500/30 transition-all">
              <p className="text-2xl sm:text-3xl font-black text-teal-300 tracking-tight">4 AI Agents</p>
              <p className="text-xs text-slate-300 font-bold mt-1">Autonomous Scoring</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel-dark hover:border-emerald-500/30 transition-all">
              <p className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight">3 Languages</p>
              <p className="text-xs text-slate-300 font-bold mt-1">EN · हिन्दी · मराठी</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Interactive Fair Profit & Middlemen Elimination Calculator ─────────── */
function ProfitCalculator() {
  const [cropKey, setCropKey] = useState('wheat')
  const [quantity, setQuantity] = useState(60) // quintals

  const cropData = {
    wheat: { name: 'Sharbati Wheat', mandiRate: 2150, directRate: 2520, icon: '🌾' },
    rice: { name: 'Basmati Rice', mandiRate: 3600, directRate: 4250, icon: '🍚' },
    tomato: { name: 'Hybrid Tomato', mandiRate: 2300, directRate: 2850, icon: '🍅' },
    soybean: { name: 'Organic Soybean', mandiRate: 4100, directRate: 4780, icon: '🫘' },
    cotton: { name: 'Long Staple Cotton', mandiRate: 6400, directRate: 7350, icon: '🌿' },
  }

  const selected = cropData[cropKey]
  const mandiTotal = selected.mandiRate * quantity
  const directTotal = selected.directRate * quantity
  const extraProfit = directTotal - mandiTotal
  const percentageGain = Math.round((extraProfit / mandiTotal) * 100)

  return (
    <section id="calculator" className="py-20 px-4 bg-slate-900 bg-agri-pattern relative overflow-hidden text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 farm-badge-gold text-xs font-black px-4 py-1.5 rounded-full mb-3 shadow-md">
            <span>🌾</span>
            <span className="uppercase tracking-wider">Kisan Samriddhi · Zero Middleman Deductions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Kisan Fair Price & Profit Calculator
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Compare traditional APMC Market agent cuts & distress pricing against AgriFlow direct farm-gate payout.
          </p>
        </div>


        <div className="grid lg:grid-cols-12 gap-8 items-center bg-slate-950/80 rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Left Column: Sliders & Crop Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Select Your Crop
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(cropData).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setCropKey(key)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-2.5 ${
                      cropKey === key
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-bold truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Harvest Volume
                </label>
                <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                  {quantity} Quintals ({(quantity * 100).toLocaleString()} kg)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>10 q</span>
                <span>150 q</span>
                <span>300 q</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-white/5">
                <p className="text-slate-400">Typical Mandi Rate</p>
                <p className="text-base font-bold text-slate-300 font-mono mt-1">₹{selected.mandiRate}/q</p>
                <p className="text-[10px] text-red-400 mt-1 font-medium">-18% agent cuts & deductions</p>
              </div>
              <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/30">
                <p className="text-emerald-300">AgriFlow AI Direct Rate</p>
                <p className="text-base font-bold text-emerald-400 font-mono mt-1">₹{selected.directRate}/q</p>
                <p className="text-[10px] text-emerald-300 mt-1 font-medium">0% middleman commission</p>
              </div>
            </div>
          </div>

          {/* Right Column: Estimated Surplus Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900/60 via-slate-900/90 to-teal-900/60 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 text-center relative overflow-hidden shadow-xl">
            <span className="text-[10px] font-mono font-bold bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Direct Farmer Benefit
            </span>
            <p className="text-slate-300 text-xs font-semibold">Additional Profit in Your Bank</p>
            <p className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono mt-2 tracking-tight">
              +₹{extraProfit.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-300 font-bold mt-1">
              +{percentageGain}% boost compared to local mandi
            </p>

            <div className="mt-6 pt-6 border-t border-white/15 space-y-2.5 text-left text-xs">
              <div className="flex justify-between text-slate-300">
                <span>AgriFlow Payout:</span>
                <span className="font-mono font-bold text-white">₹{directTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mandi Net Payout:</span>
                <span className="font-mono line-through">₹{mandiTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Payment Settlement:</span>
                <span className="text-emerald-400 font-semibold">Direct Escrow to UPI/Bank</span>
              </div>
            </div>

            <Link
              to="/farmer/login"
              className="mt-6 block w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all duration-200"
            >
              List Crop & Claim Fair Price →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Role Cards Section ─────────────────────────────────────────────────── */
function RoleCards() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const roles = [
    {
      id: 'farmer',
      icon: '🌾',
      title: 'Kisan & Producer Portal',
      description: 'List harvested and pre-harvest crops directly from your fields, obtain algorithmic fair market pricing, and receive instant bank deposits.',
      cta: 'Enter as Kisan / Farmer',
      onClick: () => navigate('/farmer/login'),
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      highlights: ['🌾 Direct Farm-Gate Sale', '🌱 AI Shelf-Life & Spoilage Monitor', '⚡ Instant UPI Escrow Payout'],
      bgBadge: '🌱 Kisan Portal',
    },
    {
      id: 'buyer',
      icon: '🛒',
      title: 'Mandi Vyapari & Enterprise Hub',
      description: 'Procure bulk Grade-A produce straight from farm clusters across India with verified quality audits and zero arhatiya commission.',
      cta: 'Enter as Bulk Buyer',
      onClick: () => navigate('/buyer/login'),
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      highlights: ['🍅 Grade-A Audited Lots', '📋 Pre-Harvest Forward Contracts', '🛡️ Smart Contract Escrow Lock'],
      bgBadge: '🏪 Bulk Buyer Hub',
    },
    {
      id: 'transporter',
      icon: '🚛',
      title: 'Krishi Cold-Chain Logistics',
      description: 'Connect your fleet with active agricultural harvest corridors, prevent in-transit spoilage with IoT telemetry, and eliminate empty return trips.',
      cta: 'Enter as Transporter',
      onClick: () => navigate('/transporter/login'),
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      highlights: ['❄️ 4°C Reefer Telemetry', '🗺️ Farm Gate Route Optimization', '⚡ Automated Trip Settlement'],
      bgBadge: '🚚 Krishi Logistics',
    },
  ]

  return (
    <section id="about" className="py-24 px-4 bg-slate-950 bg-agri-pattern relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 farm-badge-green text-xs font-black px-4 py-1.5 rounded-full mb-3 shadow-md">
            <span>🌱</span>
            <span className="uppercase tracking-wider">Krishi Ecosystem Portals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Who Powers The AgriFlow Ecosystem?
          </h2>
          <p className="mt-3 text-slate-300 text-base max-w-xl mx-auto">
            Three dedicated portals engineered to transform Indian agriculture through AI and transparent smart contracts.
          </p>
        </div>


        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-0 group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-5 z-10 relative">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10">
                    {role.icon}
                  </div>
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {role.bgBadge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white z-10 relative">{role.title}</h3>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed z-10 relative">
                  {role.description}
                </p>

                {/* Key Capability Bullets */}
                <ul className="mt-5 space-y-2 z-10 relative">
                  {role.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 z-10 relative">
                <button
                  onClick={role.onClick}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-emerald-400/30"
                >
                  <span>{role.cta}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Blockchain Supply Chain Showcase Section ────────────────────────────── */
function BlockchainTraceSection() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      id: 0,
      badge: 'Step 01 · Origin',
      title: 'Farmer Harvest & Quality Mint',
      location: 'Nashik Organic Farm Block #12',
      details: 'Harvest logged with moisture 11.2%, soil nitrogen telemetry, and farmer cryptographic sign-off.',
      polygonBlock: '#8,129,031',
      status: 'Minted on Chain',
    },
    {
      id: 1,
      badge: 'Step 02 · Transit',
      title: 'Refrigerated Transport Dispatch',
      location: 'Route NH-48 Express Corridor',
      details: 'IoT sensors stream temperature (4.2°C) and GPS every 5 mins. Route compliance auto-verified.',
      polygonBlock: '#8,129,482',
      status: 'Live IoT Telemetry',
    },
    {
      id: 2,
      badge: 'Step 03 · Delivery',
      title: 'Buyer Gate Receipt & Inspection',
      location: 'Reliance Fresh Hub, Mumbai',
      details: 'Automated QR scan confirms batch authenticity. Smart contract releases escrow funds directly.',
      polygonBlock: '#8,129,910',
      status: 'Instant Escrow Released',
    },
  ]

  return (
    <section id="traceability" className="py-24 px-4 bg-slate-950 relative overflow-hidden">
      {/* Background Graphic Image Overlay */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <img
          src="/images/supply-chain.jpg"
          alt="AgriFlow Supply Chain"
          className="w-full h-full object-cover filter blur-[1px] brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-purple-300 bg-purple-950/80 px-3.5 py-1.5 rounded-full border border-purple-500/40">
            Polygon Amoy Proof-of-Stake
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Decentralized Crop Traceability
          </h2>
          <p className="mt-3 text-slate-300 text-base max-w-xl mx-auto">
            Every harvest, temperature checkpoint, and delivery handoff is immutably inscribed onto the blockchain.
          </p>
        </div>

        {/* Interactive Milestone Stepper Card */}
        <div className="glass-panel-dark rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border ${
                  activeStep === idx
                    ? 'bg-purple-950/60 border-purple-400 shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-purple-300">{step.badge}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">{step.title}</h4>
                <p className="text-xs text-slate-400 mt-1 truncate">{step.location}</p>
              </button>
            ))}
          </div>

          {/* Active Milestone Deep-Dive Box */}
          <div className="bg-slate-950/90 rounded-2xl p-6 border border-white/10 grid sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Block {steps[activeStep].polygonBlock}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {steps[activeStep].status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{steps[activeStep].title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{steps[activeStep].details}</p>
              <p className="text-xs font-mono text-slate-400">
                Verified Contract: <span className="text-purple-300">0x4f70308d2490ebf9adcd981d3ee594cb76058e39</span>
              </p>
            </div>
            <div className="sm:col-span-4 bg-white/5 p-4 rounded-xl border border-white/10 text-center">
              <div className="w-16 h-16 mx-auto bg-white rounded-xl p-1 mb-2 flex items-center justify-center">
                {/* Visual QR mock */}
                <div className="w-full h-full bg-slate-950 rounded grid grid-cols-3 gap-0.5 p-1">
                  <div className="bg-white rounded-xs" />
                  <div className="bg-transparent" />
                  <div className="bg-white rounded-xs" />
                  <div className="bg-transparent" />
                  <div className="bg-emerald-400 rounded-xs" />
                  <div className="bg-transparent" />
                  <div className="bg-white rounded-xs" />
                  <div className="bg-transparent" />
                  <div className="bg-white rounded-xs" />
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">Scan for Consumer Audit Proof</p>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">Zero Forgery Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ────────────────────────────────────────────────────────── */
function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    { step: '01', title: t('step_1_title'), body: t('step_1_desc'), icon: '🌾' },
    { step: '02', title: t('step_2_title'), body: t('step_2_desc'), icon: '🤖' },
    { step: '03', title: t('step_3_title'), body: t('step_3_desc'), icon: '🤝' },
    { step: '04', title: t('step_4_title'), body: t('step_4_desc'), icon: '⛓️' },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 bg-slate-900 border-y border-white/10 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/40">
            Smart Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            {t('how_it_works_title')}
          </h2>
          <p className="mt-3 text-slate-300 text-base max-w-xl mx-auto">
            {t('how_it_works_subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-slate-950/80 rounded-3xl p-7 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all relative flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-emerald-500/30 font-mono">{s.step}</span>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h3 className="font-bold text-white text-base leading-snug">{s.title}</h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Platform Features ───────────────────────────────────────────────────── */
function Features() {
  const { t } = useTranslation()

  const features = [
    { icon: '🤖', title: t('feat_1_title'), body: t('feat_1_desc') },
    { icon: '⛓️', title: t('feat_2_title'), body: t('feat_2_desc') },
    { icon: '📊', title: t('feat_3_title'), body: t('feat_3_desc') },
    { icon: '🌍', title: t('feat_4_title'), body: t('feat_4_desc') },
    { icon: '🛒', title: t('feat_5_title'), body: t('feat_5_desc') },
    { icon: '🚛', title: t('feat_6_title'), body: t('feat_6_desc') },
  ]

  return (
    <section id="features" className="py-24 px-4 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/40">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            {t('features_title')}
          </h2>
          <p className="mt-3 text-slate-300 text-base max-w-xl mx-auto">
            {t('features_subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-3xl border border-white/10 hover:border-emerald-500/40 hover:bg-slate-900/60 transition-all bg-slate-900/30 group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-white/10">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{f.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */
function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-black text-slate-400 py-16 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-white text-xs font-black">AF</span>
              </div>
              <span className="text-white font-black text-xl">AgriFlow AI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/10 text-purple-300 border border-white/10">
                Polygon Amoy (80002)
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/10 text-emerald-300 border border-white/10">
                AI Models Online
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Platform</p>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-white transition-colors">{t('about', 'About')}</a></li>
                <li><a href="#calculator" className="hover:text-white transition-colors">Profit Calculator</a></li>
                <li><a href="#traceability" className="hover:text-white transition-colors">Blockchain Trace</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('how_it_works', 'How It Works')}</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Portals</p>
              <ul className="space-y-2">
                <li><Link to="/farmer/login" className="hover:text-white transition-colors">Farmer Login</Link></li>
                <li><Link to="/buyer/login" className="hover:text-white transition-colors">Buyer Login</Link></li>
                <li><Link to="/transporter/login" className="hover:text-white transition-colors">Transporter Login</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Ecosystem</p>
              <ul className="space-y-2">
                <li className="text-slate-300 font-semibold">{t('final_year_tag')}</li>
                <li className="text-slate-500">AgriFlow AI v1.0</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>{t('all_rights')}</p>
          <p>Decentralized Smart Agriculture · React 18 · Solidity · Polygon PoS</p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page Assembly ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-black">
      <LiveMarketTicker />
      <Navbar />
      <Hero />
      <ProfitCalculator />
      <RoleCards />
      <BlockchainTraceSection />
      <HowItWorks />
      <Features />
      <Footer />
    </div>
  )
}
