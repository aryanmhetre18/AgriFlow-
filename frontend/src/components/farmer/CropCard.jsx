import React from 'react'
import StatusBadge from '../ui/StatusBadge.jsx'
import { getCropEmoji, getCropTheme } from '../../utils/cropUtils.js'

export default function CropCard({ name, qty, grade, price, status, category }) {
  const emoji = getCropEmoji(name, category)
  const theme = getCropTheme(name, category)

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 hover:bg-slate-900 transition-all duration-300 shadow-xl group flex flex-col justify-between backdrop-blur-xl">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${theme.bg} ${theme.border} ${theme.glow}`}>
            {emoji}
          </div>
          <StatusBadge label={status} />
        </div>
        <h3 className="font-bold text-white text-base">{name}</h3>
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Harvest Quantity</span>
            <span className="font-mono font-medium text-slate-200">{qty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Quality Spec</span>
            <span className="font-mono font-bold text-emerald-400">{grade}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-white/10">
            <span className="text-slate-400">Target Price</span>
            <span className="font-mono font-black text-emerald-400 text-sm">{price}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
