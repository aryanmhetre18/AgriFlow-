import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { DemandProvider } from '../../context/DemandContext.jsx'

const TABS = [
  { to: '/farmer/demand',               label: 'Market Demand',      icon: '📊', end: true  },
  { to: '/farmer/demand/buyers',        label: 'Buyer Requirements', icon: '🛒', end: false },
  { to: '/farmer/demand/opportunities', label: 'Opportunities',      icon: '💡', end: false },
]

export default function FarmerDemand() {
  return (
    <DemandProvider>
      <div className="space-y-6 pb-12">
        {/* Sleek Dark Glassmorphic Tab bar */}
        <div className="flex gap-1.5 bg-slate-900/90 border border-white/10 rounded-2xl p-1.5 w-fit flex-wrap backdrop-blur-xl shadow-xl">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2
                ${isActive
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`
              }
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Page content */}
        <Outlet />
      </div>
    </DemandProvider>
  )
}
