import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import LanguageSelector from '../common/LanguageSelector.jsx'

export default function BuyerHeader({ onMenuClick }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'BK'

  return (
    <header className="bg-slate-900/85 backdrop-blur-xl border-b border-white/10 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-lg text-slate-100">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative hidden sm:flex items-center max-w-xs w-full">
          <svg className="absolute left-3 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search crops, farm suppliers..."
            className="pl-9 pr-4 py-2 text-xs bg-slate-950/80 border border-white/10 rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Right: language selector + notifications + profile */}
      <div className="flex items-center gap-2.5 ml-3">
        <LanguageSelector variant="pill" />

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-400 rounded-full"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl z-50 text-slate-200">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Procurement Alerts</p>
                <span className="text-[10px] font-mono text-blue-400 font-bold">2 New</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="w-8 h-8 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🌾</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">40q Nashik Wheat Lot Listed</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Grade A+ · Fresh Harvest</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <div className="w-8 h-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">📦</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Booking Accepted by Ramesh Patil</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ready for Reefer Dispatch</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-white/10">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/30 text-white text-xs font-bold ring-2 ring-blue-400/30">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Buyer Enterprise'}</p>
            <p className="text-[10px] text-blue-400 leading-tight">🛒 Verified Bulk Procurement</p>
          </div>
        </div>
      </div>
    </header>
  )
}
