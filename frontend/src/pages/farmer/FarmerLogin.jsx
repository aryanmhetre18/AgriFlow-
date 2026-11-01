import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getDashboardForRole } from '../../utils/roleRedirect.js'

export default function FarmerLogin() {
  const navigate    = useNavigate()
  const { login }   = useAuth()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      const stored = JSON.parse(localStorage.getItem('agriflow_user') || '{}')
      navigate(getDashboardForRole(stored.role))
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Agriculture Image with Glass Overlay */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/hero-smart-farm.jpg"
          alt="Smart Agricultural Fields"
          className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.1] scale-105 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-emerald-950/60 backdrop-blur-[2px]" />
      </div>

      {/* Top Header / Navigation */}
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

        {/* Role Quick Switcher */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold">Farmer</span>
          <Link to="/buyer/login" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Buyer</Link>
          <Link to="/transporter/login" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Transporter</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Agricultural Showcase Banner */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 rounded-3xl glass-panel-dark border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-950/90 text-emerald-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/40 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Verified Producer Portal</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">
                Empowering Farmers with Fair Prices & AI
              </h2>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Connect directly with institutional buyers, monitor soil moisture, predict shelf-life, and receive 100% transparent escrow payments.
              </p>
            </div>

            {/* Farm Micro-Climate Telemetry Card */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">🌾 Live Mandi Sharbati:</span>
                <span className="font-mono font-bold text-emerald-400">₹2,480/q (+3.4%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">💧 Soil Moisture Status:</span>
                <span className="font-mono text-teal-300">68% (Optimal)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">⛓️ Polygon Contract:</span>
                <span className="font-mono text-purple-300">Amoy Verified</span>
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
                <h1 className="text-2xl font-black text-white">Farmer Sign In</h1>
                <p className="text-xs text-emerald-400 font-medium">AgriFlow AI · Agricultural Direct Sourcing</p>
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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                  placeholder="farmer@agriflow.in"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button type="button" className="text-xs text-emerald-400 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                  placeholder="Enter your secure password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in to Farm Portal…
                  </>
                ) : (
                  <>
                    <span>Sign In as Farmer</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
              Don't have a farmer account yet?{' '}
              <Link to="/farmer/register" className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1">
                Register as Farmer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
