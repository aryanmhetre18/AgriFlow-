import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getDashboardForRole } from '../../utils/roleRedirect.js'

export default function BuyerLogin() {
  const navigate  = useNavigate()
  const { login } = useAuth()

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
      setError(err.message || 'Login failed. Please verify your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Fresh Harvest Image */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/harvest-ai.jpg"
          alt="Fresh Agricultural Harvest & Analytics"
          className="w-full h-full object-cover filter brightness-[0.40] contrast-[1.1] scale-105 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/85 to-blue-950/65 backdrop-blur-[2px]" />
      </div>

      {/* Top Header */}
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
          <Link to="/farmer/login" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Farmer</Link>
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold">Buyer</span>
          <Link to="/transporter/login" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Transporter</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Agricultural Quality Banner */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 rounded-3xl glass-panel-dark border border-blue-500/30 shadow-2xl relative">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-950/90 text-blue-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-blue-500/40 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>Enterprise Buyer Hub</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">
                Source Directly from Verified Farm Gates
              </h2>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Procure Grade-A fresh crops, negotiate reverse auctions, track refrigerated shipments live, and verify cryptographic batch audits.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">🍅 Nashik Hybrid Tomatoes:</span>
                <span className="font-mono font-bold text-emerald-400">₹2,850/q · Grade A+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">🍚 1121 Basmati Rice:</span>
                <span className="font-mono text-blue-300">Moisture &lt; 12.0%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">🛡️ Smart Escrow:</span>
                <span className="font-mono text-purple-300">100% Funds Secured</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-7 bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-2xl">
                🛒
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Buyer Sign In</h1>
                <p className="text-xs text-blue-400 font-medium">AgriFlow AI · Institutional Procurement</p>
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
                  Business / Official Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                  placeholder="procurement@retailcorp.com"
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
                  <button type="button" className="text-xs text-blue-400 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                  placeholder="Enter your buyer password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Accessing Procurement Terminal…' : 'Access Buyer Portal →'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
              New bulk buyer or retail chain?{' '}
              <Link to="/buyer/register" className="text-blue-400 hover:text-blue-300 font-bold underline ml-1">
                Register Buyer Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
