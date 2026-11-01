import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TransporterSidebar from '../components/transporter/TransporterSidebar.jsx'
import TransporterHeader  from '../components/transporter/TransporterHeader.jsx'

export default function TransporterLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative">
      {/* Ambient Cold-Chain Fleet Aura */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
      
      <TransporterSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TransporterHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
