/**
 * CropForm — shared form component used by both AddCrop and EditCrop.
 */
import React, { useState } from 'react'
import { CROP_CATEGORIES, QUALITY_GRADES, UNITS, CROP_STATUSES } from '../../data/cropData.js'
import { getCropEmoji, getCropTheme } from '../../utils/cropUtils.js'

const EMPTY_FORM = {
  name:                '',
  variety:             '',
  category:            'Vegetables',
  totalQty:            '',
  availableQty:        '',
  unit:                'kg',
  expectedHarvestDate: '',
  shelfLifeDays:       '',
  expectedPrice:       '',
  minPrice:            '',
  farmLocation:        'Kolhapur, Maharashtra',
  grade:               'Grade A',
  status:              'Pre-Harvest',
  notes:               '',
}

function FormSection({ title, icon, children }) {
  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-7 shadow-2xl mb-6 relative overflow-hidden">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 pb-3 border-b border-white/10 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
        {label}{required && <span className="text-emerald-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function CropForm({ initialData = {}, onSubmit, onCancel, isEdit = false, loading = false }) {
  const [form, setForm]     = useState({ ...EMPTY_FORM, ...initialData })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Live emoji and theme preview
  const liveEmoji = getCropEmoji(form.name, form.category)
  const liveTheme = getCropTheme(form.name, form.category)

  // ── Validation ──────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (!form.name.trim())                    e.name           = 'Crop name is required.'
    if (!form.category)                       e.category       = 'Category is required.'
    if (!form.totalQty || Number(form.totalQty) <= 0)
                                              e.totalQty       = 'Total quantity must be greater than 0.'
    if (form.availableQty === '' || Number(form.availableQty) < 0)
                                              e.availableQty   = 'Available quantity is required.'
    if (Number(form.availableQty) > Number(form.totalQty))
                                              e.availableQty   = 'Cannot exceed total quantity.'
    if (!form.unit)                           e.unit           = 'Unit is required.'
    if (!form.expectedHarvestDate)            e.expectedHarvestDate = 'Harvest date is required.'
    if (!form.expectedPrice || Number(form.expectedPrice) <= 0)
                                              e.expectedPrice  = 'Expected price is required.'
    if (form.minPrice && Number(form.minPrice) > Number(form.expectedPrice))
                                              e.minPrice       = 'Min price cannot exceed expected price.'
    if (!form.farmLocation.trim())            e.farmLocation   = 'Farm location is required.'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstKey = Object.keys(errs)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onSubmit({
      ...form,
      totalQty:      Number(form.totalQty),
      availableQty:  Number(form.availableQty),
      expectedPrice: Number(form.expectedPrice),
      minPrice:      form.minPrice ? Number(form.minPrice) : 0,
      shelfLifeDays: form.shelfLifeDays ? Number(form.shelfLifeDays) : 0,
    })
  }

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-slate-800/90 border text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
      errors[field] ? 'border-rose-500' : 'border-white/15'
    }`

  const selectCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-slate-800/90 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer ${
      errors[field] ? 'border-rose-500' : 'border-white/15'
    }`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* ── Live Visual Allocation Preview Banner ── */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 flex items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${liveTheme.bg} ${liveTheme.border} ${liveTheme.glow}`}>
            {liveEmoji}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Allocated Crop Identity & Icon
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              {form.name || 'Unnamed Crop'} {form.variety ? `· ${form.variety}` : ''}
            </h4>
            <p className="text-xs text-slate-400">
              Categorized under <span className="text-emerald-300 font-semibold">{form.category}</span>
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end text-xs text-slate-400">
          <span>Automatic Icon: <strong className="text-white text-base">{liveEmoji}</strong></span>
          <span>Theme: <strong className="text-emerald-400">Agricultural Glass</strong></span>
        </div>
      </div>

      {/* ── Basic Info ── */}
      <FormSection title="Basic Information & Category" icon="🌱">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Crop Name" required hint="e.g. Tomato, Onion, Mango, Marigold, Rose, Wheat">
            <input
              id="field-name"
              type="text"
              className={inputCls('name')}
              placeholder="e.g. Tomato or Marigold"
              value={form.name}
              onChange={set('name')}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </Field>

          <Field label="Variety / Hybrid" hint="e.g. Hybrid Roma, Nasik Red, Alphonso, Pusa Narangi">
            <input
              type="text"
              className={inputCls('variety')}
              placeholder="e.g. Hybrid Roma"
              value={form.variety}
              onChange={set('variety')}
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" required hint="Select Fruits, Vegetables, Flowers, or Grains">
            <select id="field-category" className={selectCls('category')} value={form.category} onChange={set('category')}>
              {CROP_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category}</p>}
          </Field>

          <Field label="Quality Grade">
            <select className={selectCls('grade')} value={form.grade} onChange={set('grade')}>
              {QUALITY_GRADES.map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-white">
                  {g}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Farm Location" required hint="District and State where crop is cultivated">
          <input
            id="field-farmLocation"
            type="text"
            className={inputCls('farmLocation')}
            placeholder="e.g. Kolhapur, Maharashtra"
            value={form.farmLocation}
            onChange={set('farmLocation')}
          />
          {errors.farmLocation && <p className="text-xs text-rose-400 mt-1">{errors.farmLocation}</p>}
        </Field>
      </FormSection>

      {/* ── Quantity ── */}
      <FormSection title="Harvest Quantity & Unit" icon="⚖️">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Total Quantity" required>
            <input
              id="field-totalQty"
              type="number"
              min="0"
              className={inputCls('totalQty')}
              placeholder="800"
              value={form.totalQty}
              onChange={set('totalQty')}
            />
            {errors.totalQty && <p className="text-xs text-rose-400 mt-1">{errors.totalQty}</p>}
          </Field>

          <Field label="Available for Sale" required>
            <input
              id="field-availableQty"
              type="number"
              min="0"
              className={inputCls('availableQty')}
              placeholder="800"
              value={form.availableQty}
              onChange={set('availableQty')}
            />
            {errors.availableQty && <p className="text-xs text-rose-400 mt-1">{errors.availableQty}</p>}
          </Field>

          <Field label="Measurement Unit" required>
            <select id="field-unit" className={selectCls('unit')} value={form.unit} onChange={set('unit')}>
              {UNITS.map((u) => (
                <option key={u} value={u} className="bg-slate-900 text-white">
                  {u}
                </option>
              ))}
            </select>
            {errors.unit && <p className="text-xs text-rose-400 mt-1">{errors.unit}</p>}
          </Field>
        </div>
      </FormSection>

      {/* ── Harvest & Shelf Life ── */}
      <FormSection title="Harvest Date & Freshness" icon="📅">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Expected Harvest Date" required>
            <input
              id="field-expectedHarvestDate"
              type="date"
              className={inputCls('expectedHarvestDate')}
              value={form.expectedHarvestDate}
              onChange={set('expectedHarvestDate')}
            />
            {errors.expectedHarvestDate && (
              <p className="text-xs text-rose-400 mt-1">{errors.expectedHarvestDate}</p>
            )}
          </Field>

          <Field label="Expected Shelf Life (days)" hint="How many days the crop stays fresh after harvest">
            <input
              type="number"
              min="1"
              className={inputCls('shelfLifeDays')}
              placeholder="7"
              value={form.shelfLifeDays}
              onChange={set('shelfLifeDays')}
            />
          </Field>
        </div>
      </FormSection>

      {/* ── Pricing ── */}
      <FormSection title="Expected & Minimum Floor Pricing" icon="💰">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Target Price / unit (₹)" required hint="Your target selling rate">
            <input
              id="field-expectedPrice"
              type="number"
              min="0"
              className={inputCls('expectedPrice')}
              placeholder="25"
              value={form.expectedPrice}
              onChange={set('expectedPrice')}
            />
            {errors.expectedPrice && <p className="text-xs text-rose-400 mt-1">{errors.expectedPrice}</p>}
          </Field>

          <Field label="Floor Minimum Price / unit (₹)" hint="Lowest price you will accept from buyers">
            <input
              id="field-minPrice"
              type="number"
              min="0"
              className={inputCls('minPrice')}
              placeholder="20"
              value={form.minPrice}
              onChange={set('minPrice')}
            />
            {errors.minPrice && <p className="text-xs text-rose-400 mt-1">{errors.minPrice}</p>}
          </Field>
        </div>
      </FormSection>

      {/* ── Status & Notes ── */}
      <FormSection title="Status & Crop Notes" icon="📝">
        {isEdit && (
          <Field label="Crop Status">
            <select className={selectCls('status')} value={form.status} onChange={set('status')}>
              {CROP_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Cultivation Details / Storage Notes">
          <textarea
            rows={3}
            className={`${inputCls('notes')} resize-none`}
            placeholder="Details on irrigation, pesticide-free harvest, post-harvest cooling, or loading access…"
            value={form.notes}
            onChange={set('notes')}
          />
        </Field>
      </FormSection>

      {/* ── Form Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-white/15 text-slate-300 hover:bg-white/10 text-sm font-semibold transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-8 flex items-center gap-2 shadow-xl shadow-emerald-950/40 disabled:opacity-70 disabled:cursor-not-allowed text-sm font-bold"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving to Blockchain…
            </>
          ) : (isEdit ? 'Save Changes' : 'Register Crop Listing')}
        </button>
      </div>
    </form>
  )
}
