import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getDashboardForRole } from '../../utils/roleRedirect.js'

export default function FarmerRegister() {
  const navigate      = useNavigate()
  const { register }  = useAuth()

  const [form, setForm] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: '', location: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register({ ...form, role: 'farmer' })
      const stored = JSON.parse(localStorage.getItem('agriflow_user') || '{}')
      navigate(getDashboardForRole(stored.role))
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Agriculture Image */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/hero-smart-farm.jpg"
          alt="Terraced Fields"
          className="w-full h-full object-cover filter brightness-[0.40] contrast-[1.1] scale-105 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/85 to-emerald-950/70 backdrop-blur-[2px]" />
      </div>

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Homepage
        </Link>
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold">Farmer</span>
          <Link to="/buyer/register" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Buyer</Link>
          <Link to="/transporter/register" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Transporter</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Agricultural Guarantee Showcase */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 rounded-3xl glass-panel-dark border border-emerald-500/30 shadow-2xl relative">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-950/90 text-emerald-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/40 mb-4">
                <span>🌱 Farm Direct Registration</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">
                Join 10,000+ Progressive Farmers Across India
              </h2>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Take control of your agricultural yield. List upcoming crops before harvest, get matched with verified institutional buyers, and protect your margins.
              </p>
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>Zero Middlemen & Mandi Commission Fees</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>AI Shelf-Life & Spoilage Prevention Alerts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>Instant Escrow Payment Direct to Bank / UPI</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400">✓</span>
                <span>Polygon PoS Blockchain Quality Stamp</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-7 bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-2xl">
                🌾
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Create Farmer Account</h1>
                <p className="text-xs text-emerald-400 font-medium">Free registration for agricultural producers</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-950/80 border border-red-500/40 text-red-200 text-xs px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                  placeholder="e.g. Ramesh Patil"
                  value={form.name}
                  onChange={update('name')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                    placeholder="ramesh@farms.in"
                    value={form.email}
                    onChange={update('email')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                    placeholder="+91 98765 43210"
                    value={form.mobile}
                    onChange={update('mobile')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Farm Location (Village / District) *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                  placeholder="e.g. Niphad, Nashik, Maharashtra"
                  value={form.location}
                  onChange={update('location')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Password *</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={update('password')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering Farm Profile…' : 'Create Farmer Account →'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/farmer/login" className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1">
                Sign in to your farm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
