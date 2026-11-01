import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useOrders } from '../../context/OrdersContext.jsx'
import { fetchCrops } from '../../services/cropApi.js'
import KPICard    from '../../components/farmer/KPICard.jsx'
import CropCard   from '../../components/farmer/CropCard.jsx'
import OrderRow   from '../../components/farmer/OrderRow.jsx'

/* ─── Agricultural Farm Weather & Soil Telemetry Bar ──────────────────────── */
function FarmTelemetryBar() {
  return (
    <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-teal-950/90 rounded-2xl p-4 sm:p-5 border border-emerald-500/30 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">
          ⛅
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-white">28°C · Ideal Harvest Climate</span>
            <span className="text-[10px] font-mono font-bold farm-badge-gold px-2 py-0.5 rounded-full">
              🌾 Agro-Cluster Active
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Optimal 48-Hour Harvest Window · Soil Moisture 64% · Zero Frost Risk
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 text-xs">
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">🌱 Soil NPK Health</p>
          <p className="font-mono font-bold text-emerald-400 mt-0.5">Optimal · High Vigor</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          <p className="text-[10px] uppercase font-bold text-slate-400">🌾 Mandi Price Trend</p>
          <p className="font-mono font-bold text-emerald-300 mt-0.5">Wheat ▲ 3.4% · Tomato ▲ 5.8%</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hidden md:block">
          <p className="text-[10px] uppercase font-bold text-slate-400">⛓️ Ledger Status</p>
          <p className="font-mono font-bold text-purple-300 mt-0.5">Block #8,129,031</p>
        </div>
      </div>
    </div>
  )
}


/* ─── Greeting ──────────────────────────────────────────────────────────── */
function Greeting({ name }) {
  const hour = new Date().getHours()
  const time = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const firstName = name ? name.split(' ')[0] : 'Farmer'
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Good {time}, {firstName}
          </h1>
        </div>
        <p className="text-slate-400 mt-1 text-xs sm:text-sm">
          Here is your live agricultural intelligence and harvest telemetry.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <span className="text-xs font-mono font-bold text-emerald-400">Farm Station Online</span>
      </div>
    </div>
  )
}

/* ─── AI Insights Panel ─────────────────────────────────────────────────── */
function AIInsights({ onNavigate }) {
  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-7 text-white border border-emerald-500/40 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            🤖
          </div>
          <div>
            <p className="text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider">AI Farm Advisor</p>
            <p className="text-base font-bold text-white">Autonomous Harvest & Demand Engine</p>
          </div>
        </div>
        <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full flex-shrink-0">
          Live Model
        </span>
      </div>

      <div className="space-y-3 mb-6 relative z-10 text-xs sm:text-sm">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-emerald-400 text-base">🌾</span>
          <p className="text-slate-200">
            <strong className="text-white">High Demand Surge:</strong> Tomatoes & Sharbati Wheat are currently trading at +18% above regional MSP in your cluster.
          </p>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-teal-400 text-base">⏳</span>
          <p className="text-slate-200">
            <strong className="text-white">Shelf-Life Alert:</strong> 3 bulk buyers are actively looking for pre-harvest forward contracts within 40km of your location.
          </p>
        </div>
      </div>

      <button
        onClick={onNavigate}
        className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span>Open AgriFlow AI Centre</span>
        <span>→</span>
      </button>
    </div>
  )
}

/* ─── Upcoming Activities ────────────────────────────────────────────────── */
function UpcomingActivities({ activities }) {
  const activityIcons = {
    harvest: { icon: '🌾', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    pickup:  { icon: '🚛', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30'   },
    booking: { icon: '📋', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30'},
  }

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white text-sm">Farm Operations & Pickups</h2>
          <span className="text-[11px] font-mono text-emerald-400">Scheduled</span>
        </div>

        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No pending pickups. When buyers confirm bookings, transport slots will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => {
              const style = activityIcons[a.type] || { icon: '📌', color: 'bg-white/10 text-slate-300 border-white/10' }
              return (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className={`w-9 h-9 rounded-xl ${style.color} border flex items-center justify-center text-base flex-shrink-0`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{a.title}</p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 flex-shrink-0">{a.date}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex justify-between">
        <span>Cold-Chain Status:</span>
        <span className="text-teal-300 font-medium">Reefer Vehicles Ready</span>
      </div>
    </div>
  )
}

// ── Crop color mapping by category ──────────────────────────────────────────
const categoryColorMap = {
  'Vegetables': 'green',
  'Fruits': 'red',
  'Grains & Cereals': 'yellow',
  'Pulses & Legumes': 'orange',
  'Spices & Herbs': 'purple',
  'Oilseeds': 'yellow',
  'Other': 'green',
}

/* ─── Page Assembly ──────────────────────────────────────────────────────── */
export default function FarmerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { bookings, orders, earnings, loading, error } = useOrders()

  const [crops, setCrops] = useState([])
  const [cropsLoading, setCropsLoading] = useState(true)
  const [cropsError, setCropsError] = useState('')

  useEffect(() => {
    fetchCrops()
      .then(setCrops)
      .catch((e) => setCropsError(e.message))
      .finally(() => setCropsLoading(false))
  }, [])

  const pendingBookings = bookings.filter((b) => b.status === 'Pending')
  const activeOrders = orders.filter((o) =>
    ['Confirmed', 'Preparing', 'Ready for Pickup', 'Picked Up', 'In Transit'].includes(o.status)
  )
  const totalEarnings = earnings?.summary?.totalEarnings || 0

  const kpis = [
    { id: 'crops',    label: 'Total Crops Listed', value: String(crops.length), icon: 'crops', trend: crops.length > 0 ? `${crops.filter((c) => c.status === 'Pre-Harvest').length} pre-harvest active` : 'Add your first crop', color: 'green' },
    { id: 'bookings', label: 'Active Bookings',    value: String(pendingBookings.length), icon: 'bookings', trend: pendingBookings.length > 0 ? 'Buyer bids awaiting response' : 'All bids settled', color: 'blue' },
    { id: 'orders',   label: 'Orders in Pipeline', value: String(activeOrders.length), icon: 'orders', trend: activeOrders.length > 0 ? 'Awaiting dispatch' : 'No pending dispatch', color: 'amber' },
    { id: 'earnings', label: 'Net Realized Profit', value: `₹${totalEarnings.toLocaleString()}`, icon: 'earnings', trend: 'Direct escrow settlements', color: 'emerald' },
  ]

  const cropCards = crops.slice(0, 6).map((c) => ({
    id:       c.id,
    name:     c.name,
    category: c.category,
    qty:      `${c.availableQty} ${c.unit}`,
    grade:    c.grade || 'Grade A',
    price:    c.expectedPrice ? `₹${c.expectedPrice}/${c.unit}` : '—',
    status:   c.status,
    color:    categoryColorMap[c.category] || 'green',
  }))

  const recentOrderRows = orders.slice(0, 4).map((o) => ({
    id:     o.id.slice(-8).toUpperCase(),
    buyer:  o.buyerCompany || o.buyerName,
    crop:   o.cropName,
    amount: `₹${o.totalAmount.toLocaleString()}`,
    status: o.status,
  }))

  const upcomingActivities = activeOrders
    .filter((o) => o.status === 'Ready for Pickup' || o.status === 'Picked Up' || o.scheduledPickupDate)
    .slice(0, 3)
    .map((o, i) => {
      let type = 'pickup'
      let title = `${o.cropName} pickup scheduled`
      if (o.status === 'Confirmed' || o.status === 'Preparing') {
        type = 'booking'
        title = `${o.cropName} preparing order`
      }
      const date = o.scheduledPickupDate
        ? new Date(o.scheduledPickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : 'Tomorrow'
      return { id: `act-${i}`, title, date, type }
    })

  return (
    <div className="space-y-6 text-slate-100 bg-agri-pattern min-h-full pb-8">
      <Greeting name={user?.name} />
      <FarmTelemetryBar />

      {error && (
        <div className="bg-red-950/80 border border-red-500/40 text-red-200 text-xs px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {cropsError && (
        <div className="bg-red-950/80 border border-red-500/40 text-red-200 text-xs px-4 py-3 rounded-xl">
          {cropsError}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading || cropsLoading
          ? [1, 2, 3, 4].map((i) => <div key={i} className="rounded-2xl h-24 bg-white/5 animate-pulse" />)
          : kpis.map((kpi) => <KPICard key={kpi.id} {...kpi} />)}
      </div>

      {/* AI Advisory & Upcoming Operations */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIInsights onNavigate={() => navigate('/farmer/ai')} />
        </div>
        <UpcomingActivities activities={upcomingActivities} />
      </div>

      {/* Crop Overview Showcase */}
      <div className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌾</span>
            <h2 className="font-bold text-white text-base">Active Farm Produce & Crops</h2>
          </div>
          <button
            onClick={() => navigate('/farmer/crops')}
            className="text-xs text-emerald-400 font-bold hover:underline"
          >
            Manage All Crops →
          </button>
        </div>

        {cropsLoading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : cropCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/15 rounded-2xl">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-300 rounded-2xl flex items-center justify-center text-3xl mb-3">🌱</div>
            <p className="font-bold text-white text-sm">No crops listed yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              List your upcoming or harvested crops to receive direct buyer bids and AI demand scores.
            </p>
            <button
              onClick={() => navigate('/farmer/crops/add')}
              className="mt-4 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              + Add Crop Listing
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cropCards.map((crop) => (
              <CropCard key={crop.id} {...crop} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <h2 className="font-bold text-white text-base">Recent Direct Orders</h2>
          </div>
          <button
            onClick={() => navigate('/farmer/orders')}
            className="text-xs text-emerald-400 font-bold hover:underline"
          >
            View All Orders →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 p-4">{[1, 2, 3].map((i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}</div>
        ) : recentOrderRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/15 rounded-2xl">
            <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl mb-3">📦</div>
            <p className="font-bold text-white text-sm">No active orders yet</p>
            <p className="text-xs text-slate-400 mt-1">Accept a buyer booking to create your first dispatch order.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Buyer Enterprise</th>
                  <th className="px-4 py-3 text-left">Crop Spec</th>
                  <th className="px-4 py-3 text-left">Settlement</th>
                  <th className="px-4 py-3 text-left">Lifecycle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {recentOrderRows.map((order) => (
                  <OrderRow key={order.id} {...order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
