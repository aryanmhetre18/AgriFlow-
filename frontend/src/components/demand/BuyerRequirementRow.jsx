import React from 'react'
import DemandLevelBadge from './DemandLevelBadge.jsx'
import { getCropEmoji } from '../../utils/cropUtils.js'

export default function BuyerRequirementRow({ req, onView }) {
  const deadline = req.deadline
    ? new Date(req.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <tr className="hover:bg-slate-800/50 transition-colors duration-150 border-b border-white/5">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{getCropEmoji(req.cropName, req.category)}</span>
          <div>
            <p className="text-sm font-bold text-white">{req.cropName}</p>
            <p className="text-xs text-slate-400">{req.variety || req.category}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm font-semibold text-slate-200">{req.companyName || req.buyerName}</p>
        <p className="text-xs text-slate-400">{req.buyerName}</p>
      </td>
      <td className="px-4 py-3.5 text-sm font-medium text-slate-200">
        {req.requiredQuantity.toLocaleString()} {req.unit}
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-300 font-medium">{req.qualityGrade}</td>
      <td className="px-4 py-3.5 text-sm font-black text-emerald-400">
        ₹{req.expectedPrice}/{req.unit}
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-300">{req.deliveryLocation}</td>
      <td className="px-4 py-3.5 text-xs text-slate-400">{deadline}</td>
      <td className="px-4 py-3.5">
        <DemandLevelBadge level={req.demandLevel} />
      </td>
      <td className="px-4 py-3.5">
        <button
          onClick={() => onView(req)}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all whitespace-nowrap"
        >
          View Details
        </button>
      </td>
    </tr>
  )
}
