import React from 'react'

const variants = {
  // Order statuses
  'Confirmed':         'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  'In Transit':        'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Pending':           'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  // Crop statuses
  'Pre-Harvest':       'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'Booked':            'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  'Harvest Ready':     'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  'Harvested':         'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Pickup Scheduled':  'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Delivered':         'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  // Demand levels
  'High':              'bg-red-500/20 text-red-300 border border-red-500/30',
  'Medium':            'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'Low':               'bg-slate-700/40 text-slate-300 border border-slate-600/30',
  // Demand trends
  'Rising':            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  'Stable':            'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Falling':           'bg-red-500/20 text-red-300 border border-red-500/30',
  // Legacy / misc
  'Stored':            'bg-slate-700/40 text-slate-300 border border-slate-600/30',
  'coming-soon':       'bg-white/10 text-slate-400 border border-white/10',
  'default':           'bg-white/10 text-slate-300 border border-white/10',
}

export default function StatusBadge({ label }) {
  const cls = variants[label] || variants['default']
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${cls}`}>
      {label === 'coming-soon' ? 'Coming Soon' : label}
    </span>
  )
}
