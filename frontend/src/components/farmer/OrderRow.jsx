import React from 'react'
import StatusBadge from '../ui/StatusBadge.jsx'

export default function OrderRow({ id, buyer, crop, amount, status }) {
  return (
    <tr className="hover:bg-white/5 transition-colors duration-150">
      <td className="px-4 py-3.5 text-xs font-mono font-bold text-emerald-400">{id}</td>
      <td className="px-4 py-3.5 text-xs font-semibold text-white">{buyer}</td>
      <td className="px-4 py-3.5 text-xs text-slate-300">{crop}</td>
      <td className="px-4 py-3.5 text-xs font-mono font-bold text-emerald-300">{amount}</td>
      <td className="px-4 py-3.5">
        <StatusBadge label={status} />
      </td>
    </tr>
  )
}
