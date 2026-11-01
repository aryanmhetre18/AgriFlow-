import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import BuyerSidebar from '../components/buyer/BuyerSidebar.jsx'
import BuyerHeader  from '../components/buyer/BuyerHeader.jsx'

export default function BuyerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white relative">
      {/* Ambient Enterprise Sourcing Aura */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      
      <BuyerSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <BuyerHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
