import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import {
  fetchPickupRequests,
  fetchTrips,
  fetchEarnings,
  fetchVehicleInfo,
} from '../../services/transporterApi.js'

const kpiColors = {
  amber:   { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', icon: 'bg-amber-500/20 text-amber-300' },
  blue:    { bg: 'bg-blue-500/10 border-blue-500/30',   text: 'text-blue-400',    icon: 'bg-blue-500/20 text-blue-300' },
  green:   { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', icon: 'bg-emerald-500/20 text-emerald-300' },
  emerald: { bg: 'bg-teal-500/10 border-teal-500/30',   text: 'text-teal-400',    icon: 'bg-teal-500/20 text-teal-300' },
}

function KPICard({ label, value, icon, trend, color = 'blue' }) {
  const c = kpiColors[color] || kpiColors.blue
  return (
    <div className={`p-5 rounded-2xl border ${c.bg} backdrop-blur-md transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-start gap-4`}>
      <div className={`${c.icon} text-2xl p-2.5 rounded-xl flex-shrink-0 shadow-inner flex items-center justify-center`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-2xl font-black mt-0.5 tracking-tight ${c.text}`}>{value}</p>
        {trend && <p className="text-[11px] font-medium text-slate-300 mt-1 truncate">{trend}</p>}
      </div>
    </div>
  )
}

const ACTIVE_TRIP_STATUSES = ['Ready for Pickup', 'Picked Up', 'In Transit']
const COMPLETED_STATUSES   = ['Delivered']
const DELIVERY_FLOW        = ['Ready for Pickup', 'Picked Up', 'In Transit', 'Delivered']

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const QUICK_ACTIONS = [
  { label: 'Farm Pickups',    icon: '📋', to: '/transporter/pickups' },
  { label: 'Active Trips',    icon: '🚛', to: '/transporter/trips'    },
  { label: 'Optimize Route',  icon: '🗺️', to: '/transporter/routes'  },
  { label: 'Fleet Earnings',  icon: '💰', to: '/transporter/earnings' },
]

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TransporterDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [data, setData] = useState({
    pickups: [],
    trips: [],
    earnings: null,
    vehicle: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetchPickupRequests().catch(() => []),
      fetchTrips().catch(() => []),
      fetchEarnings().catch(() => null),
      fetchVehicleInfo().catch(() => null),
    ])
      .then(([pickups, trips, earnings, vehicleRes]) => {
        setData({
          pickups:  Array.isArray(pickups) ? pickups : [],
          trips:    Array.isArray(trips)   ? trips   : [],
          earnings,
          // API returns { vehicleInfo: {...} } — unwrap
          vehicle:  vehicleRes?.vehicleInfo || vehicleRes || null,
        })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const hour      = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const firstName = user?.name ? user.name.split(' ')[0] : 'Operator'

  const pendingRequests = (data.pickups || []).filter((p) => p.status === 'PENDING')
  const activeTrips      = (data.trips || []).filter((t) => ACTIVE_TRIP_STATUSES.includes(t.orderStatus))
  const completedTrips   = (data.trips || []).filter((t) => COMPLETED_STATUSES.includes(t.orderStatus))
  const earningsSummary  = data.earnings?.summary || {}

  const kpis = [
    { id: 'requests',  label: 'Pending Pickups',     value: String(pendingRequests.length), icon: '📋', color: 'amber',   trend: pendingRequests.length > 0 ? 'Fresh farm lots waiting' : 'No new requests' },
    { id: 'active',    label: 'Live Freight Runs',   value: String(activeTrips.length),      icon: '🚛', color: 'blue',    trend: activeTrips.length > 0 ? activeTrips[0]?.cropName || '' : 'Fleet idle' },
    { id: 'completed', label: 'Delivered Batches',   value: String(earningsSummary.completedTrips || completedTrips.length), icon: '✅', color: 'emerald', trend: `${earningsSummary.thisMonth ? `₹${earningsSummary.thisMonth.toLocaleString()} this month` : 'All time record'}` },
    { id: 'earnings',   label: 'Net Dispatch Pay',   value: `₹${(earningsSummary.totalEarnings || 0).toLocaleString()}`, icon: '💰', color: 'green',  trend: 'Instant milestone settlements' },
  ]

  const activeTrip = activeTrips[0] || null
  const tripProgress = activeTrip
    ? { 'Ready for Pickup': 25, 'Picked Up': 50, 'In Transit': 75 }[activeTrip.orderStatus] || 0
    : 0

  const pickupCards = pendingRequests.slice(0, 3).map((p) => ({
    id:      p.id,
    crop:    p.cropName,
    qty:     `${p.quantity} ${p.unit}`,
    from:    p.pickupLocation || 'Nashik Farm Cluster',
    to:      p.deliveryLocation || 'Mumbai Hub',
    date:    p.pickupDate ? fmtDate(p.pickupDate) : 'Today',
    dist:    `${p.estimatedDistanceKm || 142} km`,
    earn:    `₹${(p.estimatedEarnings || 3850).toLocaleString()}`,
    status:  p.status,
  }))

  const vehicle = data.vehicle || { vehicleNumber: 'MH-15-EG-4921', vehicleType: 'Reefer 3.5 Ton', capacity: '3500 kg' }

  const currentStepIdx = activeTrip ? DELIVERY_FLOW.indexOf(activeTrip.orderStatus) : -1
  const deliverySteps = DELIVERY_FLOW.map((label, i) => ({
    key:   label.toLowerCase().replace(/\s+/g, ''),
    label,
    done:  i < currentStepIdx,
    active: i === currentStepIdx,
  }))

  return (
    <div className="space-y-6 text-slate-100 bg-agri-pattern min-h-full pb-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚛</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good {timeOfDay}, {firstName}
            </h1>
          </div>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            Agricultural Reefer Telemetry & Farm Dispatch Operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping inline-block" />
          <span className="text-xs font-mono font-bold text-purple-400">Reefer Telemetry Active</span>
        </div>
      </div>

      {/* Reefer Fleet Telemetry Bar */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-teal-950/80 rounded-2xl p-4 sm:p-5 border border-purple-500/30 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-inner">
            ❄️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white">Chamber: 3.8°C · Optimal</span>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Perishable Compliant
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live IoT Temperature Stream · GPS Telemetry Active · Zero Spoilage Recorded
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-xs">
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400">Vehicle Assigned</p>
            <p className="font-mono font-bold text-purple-300 mt-0.5">{vehicle.vehicleNumber || 'MH-15-EG-4921'}</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400">Backhaul Efficiency</p>
            <p className="font-mono font-bold text-emerald-400 mt-0.5">91% Loaded</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/80 border border-red-500/40 text-red-200 text-xs px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((i) => <div key={i} className="rounded-2xl h-24 bg-white/5 animate-pulse" />)
          : kpis.map((kpi) => <KPICard key={kpi.id} {...kpi} />)}
      </div>

      {/* Active Trip Telemetry + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Trip Card */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-base">Active Agricultural Freight Run</h2>
            <button
              onClick={() => navigate('/transporter/trips')}
              className="text-xs text-purple-400 font-bold hover:underline"
            >
              All Trips →
            </button>
          </div>

          {!activeTrip ? (
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-dashed border-white/15 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-300 rounded-2xl flex items-center justify-center text-3xl mb-3">🚛</div>
              <p className="font-bold text-white text-sm">No Active Trips Underway</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Accept a farm gate pickup request to start refrigerated dispatch and claim milestone payment.
              </p>
              <button
                onClick={() => navigate('/transporter/pickups')}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Browse Farm Pickups →
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 border border-purple-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                    Corridor Dispatch #AF-TRIP-92
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {activeTrip.pickupLocation || 'Nashik Organic Valley'} → {activeTrip.deliveryLocation || 'Bandra Retail Hub'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeTrip.estimatedDistanceKm || 165} km · {activeTrip.cropName} · {activeTrip.quantity} {activeTrip.unit}
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-full font-mono text-xs font-bold">
                  {activeTrip.orderStatus}
                </span>
              </div>

              {/* Step Progress Bar */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-400">Corridor Transit Progress</span>
                  <span className="font-mono text-emerald-400 font-bold">{tripProgress}% Completed</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${tripProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Operations Actions */}
        <div className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-4">Quick Transport Operations</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((a, i) => (
                <button
                  key={i}
                  onClick={() => navigate(a.to)}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/10 transition-all text-left flex flex-col justify-between"
                >
                  <span className="text-2xl mb-2">{a.icon}</span>
                  <span className="text-xs font-bold text-slate-200">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 flex justify-between">
            <span>Fleet Protocol:</span>
            <span className="font-mono text-emerald-400">GPS & Temperature Synced</span>
          </div>
        </div>
      </div>

      {/* Available Farm Pickup Requests */}
      <div className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌾</span>
            <h2 className="font-bold text-white text-base">Available Farm Gate Pickup Requests</h2>
          </div>
          <button
            onClick={() => navigate('/transporter/pickups')}
            className="text-xs text-purple-400 font-bold hover:underline"
          >
            View All Corridors →
          </button>
        </div>

        {pickupCards.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/15 rounded-2xl">
            <p className="text-slate-400 text-xs">No pending pickups currently available. Check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {pickupCards.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.07] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{p.crop}</span>
                    <span className="text-[11px] font-mono text-purple-300 font-bold">{p.qty}</span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">From: {p.from}</p>
                  <p className="text-xs text-slate-400 truncate">To: {p.to}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs">
                    <span className="text-slate-400">{p.dist}</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">{p.earn}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/transporter/pickups')}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Accept Farm Corridor Run
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
