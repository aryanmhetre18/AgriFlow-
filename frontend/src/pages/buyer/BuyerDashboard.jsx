import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import {
  fetchBuyerOrders,
  fetchBuyerBookings,
  fetchBuyerPayments,
} from '../../services/ordersApi.js'
import { fetchRequirements } from '../../services/requirementsApi.js'
import { fetchMarketplaceCrops } from '../../services/marketplaceApi.js'

// ── KPI Card ──────────────────────────────────────────────────────────────────
const kpiColors = {
  green:   { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', icon: 'bg-emerald-500/20 text-emerald-300' },
  blue:    { bg: 'bg-blue-500/10 border-blue-500/30',       text: 'text-blue-400',    icon: 'bg-blue-500/20 text-blue-300' },
  amber:   { bg: 'bg-amber-500/10 border-amber-500/30',     text: 'text-amber-400',   icon: 'bg-amber-500/20 text-amber-300' },
  emerald: { bg: 'bg-teal-500/10 border-teal-500/30',       text: 'text-teal-400',    icon: 'bg-teal-500/20 text-teal-300' },
}

const kpiIcons = {
  orders:   (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>),
  bookings: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
  reqs:     (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>),
  delivery: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>),
}

function KPICard({ label, value, icon, trend, color = 'blue' }) {
  const c = kpiColors[color] || kpiColors.blue
  return (
    <div className={`p-5 rounded-2xl border ${c.bg} backdrop-blur-md transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-start gap-4`}>
      <div className={`${c.icon} p-3 rounded-xl flex-shrink-0 shadow-inner`}>
        {kpiIcons[icon]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-2xl font-black mt-0.5 tracking-tight ${c.text}`}>{value}</p>
        {trend && <p className="text-[11px] font-medium text-slate-300 mt-1 truncate">{trend}</p>}
      </div>
    </div>
  )
}

// ── Status badge ─────────────────────────────────────────────────────────────
const statusCls = {
  ACTIVE:              'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  FULFILLED:           'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  EXPIRED:             'bg-slate-700/40 text-slate-400 border border-slate-600/30',
  CANCELLED:           'bg-red-500/20 text-red-300 border border-red-500/30',
  Pending:             'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  Accepted:           'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  Confirmed:          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  Preparing:          'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  'Ready for Pickup':  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'Picked Up':         'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'In Transit':        'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Delivered:          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
}

function Badge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${statusCls[status] || 'bg-white/10 text-slate-300 border border-white/10'}`}>
      {status}
    </span>
  )
}

const ACTIVE_ORDER_STATUSES = ['Confirmed', 'Preparing', 'Ready for Pickup', 'Picked Up', 'In Transit']

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function BuyerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState({
    orders: [],
    bookings: [],
    requirements: [],
    payments: null,
    marketplaceCrops: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetchBuyerOrders().catch(() => []),
      fetchBuyerBookings().catch(() => []),
      fetchRequirements().catch(() => []),
      fetchBuyerPayments().catch(() => null),
      fetchMarketplaceCrops().catch(() => []),
    ])
      .then(([ordersRes, bookingsRes, reqsRes, payments, mktRes]) => {
        // APIs may return arrays directly OR wrapped in { orders/bookings/requirements/crops: [...] }
        const orders           = Array.isArray(ordersRes)   ? ordersRes   : (ordersRes?.orders   || [])
        const bookings         = Array.isArray(bookingsRes) ? bookingsRes : (bookingsRes?.bookings || [])
        const requirements     = Array.isArray(reqsRes)     ? reqsRes     : (reqsRes?.requirements || [])
        const marketplaceCrops = Array.isArray(mktRes)      ? mktRes      : (mktRes?.crops         || [])
        setData({ orders, bookings, requirements, payments, marketplaceCrops })
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const hour  = new Date().getHours()
  const time  = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const firstName = user?.name ? user.name.split(' ')[0] : 'Buyer'

  const activeOrders    = (data.orders || []).filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status))
  const pendingBookings = (data.bookings || []).filter((b) => b.status === 'Pending')
  const activeReqs      = (data.requirements || []).filter((r) => r.status === 'ACTIVE')
  const paymentsSummary = data.payments?.summary || {}
  const pendingAmount   = paymentsSummary.pendingAmount || 0

  const kpis = [
    { id: 'orders',     label: 'Active Dispatches',  value: String(activeOrders.length),       icon: 'orders',   color: 'blue',    trend: activeOrders.length > 0 ? `${activeOrders.filter((o) => o.status === 'In Transit').length} in transit` : 'All deliveries fulfilled' },
    { id: 'bookings',   label: 'Pending Bids',       value: String(pendingBookings.length),     icon: 'bookings', color: 'amber',   trend: pendingBookings.length > 0 ? 'Awaiting farmer accept' : 'No pending bids' },
    { id: 'reqs',       label: 'Open Requirements',  value: String(activeReqs.length),         icon: 'reqs',     color: 'green',   trend: activeReqs.length > 0 ? `${activeReqs.length} actively sourcing` : 'Post requirement' },
    { id: 'deliveries', label: 'Escrow Under Lock',  value: `₹${pendingAmount.toLocaleString()}`, icon: 'delivery', color: 'emerald', trend: 'Protected by Smart Contract' },
  ]

  const recommendedSupply = (data.marketplaceCrops || []).slice(0, 3).map((c) => ({
    id:       c.id,
    crop:     c.name,
    variety:  c.variety || '',
    qty:      `${c.availableQty} ${c.unit}`,
    price:    c.expectedPrice ? `₹${c.expectedPrice}/${c.unit}` : '—',
    grade:    c.grade || 'Grade A',
    harvest:  c.expectedHarvestDate ? fmtDate(c.expectedHarvestDate) : 'Fresh Ready',
    location: c.farmLocation || 'Nashik Valley',
    verified: true,
  }))

  const activeOrderRows = activeOrders.slice(0, 4).map((o) => ({
    id:      o.id.slice(-8).toUpperCase(),
    crop:    o.cropName,
    qty:     `${o.quantity} ${o.unit}`,
    farmer:  o.farmer?.name || 'Verified Farm',
    status:  o.status,
    delivery: o.scheduledPickupDate ? fmtDate(o.scheduledPickupDate) : 'Today',
  }))

  return (
    <div className="space-y-6 text-slate-100 bg-agri-pattern min-h-full pb-8">
      {/* Greeting & Terminal Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good {time}, {firstName}
            </h1>
          </div>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            Institutional Procurement & Verified Farm-Gate Sourcing Terminal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping inline-block" />
          <span className="text-xs font-mono font-bold text-blue-400">Direct Sourcing Active</span>
        </div>
      </div>

      {/* Fresh Farm Gate Arrival Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-teal-950/80 rounded-2xl p-4 sm:p-5 border border-blue-500/30 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl shadow-inner">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white">Direct Farm Produce Hub</span>
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Polygon Amoy Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              100% Quality Audited Lots · Direct Traceability · Zero Mandi Intermediaries
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/buyer/requirements/create')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
        >
          <span>+ Post Bulk Crop Requirement</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-950/80 border border-red-500/40 text-red-200 text-xs px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((i) => <div key={i} className="rounded-2xl h-24 bg-white/5 animate-pulse" />)
          : kpis.map((kpi) => <KPICard key={kpi.id} {...kpi} />)}
      </div>

      {/* Fresh Recommended Farm Supply */}
      <div className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍅</span>
            <h2 className="font-bold text-white text-base">Recommended Fresh Harvest Lots</h2>
          </div>
          <button
            onClick={() => navigate('/buyer/marketplace')}
            className="text-xs text-blue-400 font-bold hover:underline"
          >
            Browse Agricultural Marketplace →
          </button>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : recommendedSupply.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/15 rounded-2xl">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-300 rounded-2xl flex items-center justify-center text-3xl mb-3">🛒</div>
            <p className="font-bold text-white text-sm">No crop listings available yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Fresh farm lots from verified farmers will appear here. Browse the marketplace or post a requirement.
            </p>
            <button
              onClick={() => navigate('/buyer/marketplace')}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Browse Marketplace →
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendedSupply.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-blue-500/40 hover:bg-slate-900 transition-all duration-300 shadow-xl flex flex-col justify-between backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border bg-blue-500/15 border-blue-500/30">
                      🌾
                    </div>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {c.grade}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base">{c.crop}</h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Available Qty</span>
                      <span className="font-mono font-medium text-slate-200">{c.qty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Harvest Date</span>
                      <span className="font-mono text-slate-300">{c.harvest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location</span>
                      <span className="font-mono text-slate-300 truncate max-w-[130px]">{c.location}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-white/10">
                      <span className="text-slate-400">Farm Price</span>
                      <span className="font-mono font-black text-emerald-400 text-sm">{c.price}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/buyer/marketplace/crop/${c.id}`)}
                  className="mt-4 w-full py-2.5 bg-white/10 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all duration-200"
                >
                  Inspect &amp; Book Lot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Deliveries & Tracking */}
      <div className="bg-slate-900/80 rounded-3xl p-6 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚛</span>
            <h2 className="font-bold text-white text-base">Active Orders & Cold-Chain Shipments</h2>
          </div>
          <button
            onClick={() => navigate('/buyer/orders')}
            className="text-xs text-blue-400 font-bold hover:underline"
          >
            All Orders & Invoices →
          </button>
        </div>

        {activeOrderRows.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/15 rounded-2xl">
            <p className="text-slate-400 text-xs">No in-transit orders currently. Explore marketplace to book fresh lots.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Order Hash</th>
                  <th className="px-4 py-3 text-left">Produce Spec</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Farm Source</th>
                  <th className="px-4 py-3 text-left">ETA</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {activeOrderRows.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-blue-400">{o.id}</td>
                    <td className="px-4 py-3 font-bold text-white">{o.crop}</td>
                    <td className="px-4 py-3 font-mono">{o.qty}</td>
                    <td className="px-4 py-3 text-slate-300">{o.farmer}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">{o.delivery}</td>
                    <td className="px-4 py-3"><Badge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
