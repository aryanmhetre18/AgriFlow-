import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getDashboardForRole } from '../../utils/roleRedirect.js'

export default function BuyerRegister() {
  const navigate    = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '', email: '', mobile: '',
    password: '', confirmPassword: '', company: '',
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
      await register({ ...form, role: 'buyer' })
      const stored = JSON.parse(localStorage.getItem('agriflow_user') || '{}')
      navigate(getDashboardForRole(stored.role))
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/85 to-blue-950/70 backdrop-blur-[2px]" />
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
          <Link to="/farmer/register" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Farmer</Link>
          <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold">Buyer</span>
          <Link to="/transporter/register" className="px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">Transporter</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-4xl grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Agricultural Supply Chain Benefits */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 rounded-3xl glass-panel-dark border border-blue-500/30 shadow-2xl relative">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-950/90 text-blue-300 text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-blue-500/40 mb-4">
                <span>🛒 Enterprise Onboarding</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight">
                Direct Farm-to-Enterprise Supply Chain
              </h2>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Connect with thousands of verified farmers. Post your exact seasonal demand requirements, lock forward booking contracts, and ensure zero stockouts.
              </p>
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400">✓</span>
                <span>Pre-Harvest Forward Bookings at Locked Prices</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400">✓</span>
                <span>AI Automated Reverse Auction Sourcing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400">✓</span>
                <span>Real-Time GPS & Reefer Fleet Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400">✓</span>
                <span>GST Invoicing & Polygon Blockchain Proof</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-7 bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-2xl">
                🏢
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Create Buyer Account</h1>
                <p className="text-xs text-blue-400 font-medium">For food processors, supermarkets, exporters & traders</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    placeholder="e.g. Vikram Mehta"
                    value={form.name}
                    onChange={update('name')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Company / Entity Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    placeholder="e.g. Kisan Fresh Marts Ltd"
                    value={form.company}
                    onChange={update('company')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Official Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    placeholder="vikram@kisanfresh.com"
                    value={form.email}
                    onChange={update('email')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Mobile / Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                    placeholder="+91 98200 12345"
                    value={form.mobile}
                    onChange={update('mobile')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Password *</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
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
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering Buyer Enterprise…' : 'Create Buyer Account →'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/buyer/login" className="text-blue-400 hover:text-blue-300 font-bold underline ml-1">
                Sign in to procurement terminal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
