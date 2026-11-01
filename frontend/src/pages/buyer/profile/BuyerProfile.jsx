import React, { useState } from 'react'
import { BuyerProfileProvider, useBuyerProfile } from '../../../context/BuyerProfileContext.jsx'
import { useAuth }             from '../../../hooks/useAuth.jsx'
import { changePassword as apiChangePassword } from '../../../services/profileApi.js'
import PageHeader              from '../../../components/ui/PageHeader.jsx'

const TABS = [
  { key: 'personal',  label: 'Personal / Business' },
  { key: 'business',  label: 'Business Details' },
  { key: 'verify',    label: 'Verification' },
  { key: 'payment',   label: 'Payment' },
  { key: 'notif',     label: 'Notifications' },
  { key: 'settings',  label: 'Settings' },
]

// ── Shared helpers ────────────────────────────────────────────────────────────
function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-white/10 last:border-0 gap-4">
      <span className="text-sm text-slate-400 flex-shrink-0">{label}</span>
      <span className="text-sm font-semibold text-white text-right">{value || '—'}</span>
    </div>
  )
}

function Feedback({ type, message }) {
  if (!message) return null
  const cls = type === 'error'
    ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
    : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
  return (
    <div className={`text-sm font-medium px-4 py-3 rounded-xl mb-5 flex items-center gap-2 backdrop-blur-md ${cls}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {type === 'error'
          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
      </svg>
      {message}
    </div>
  )
}

function SaveButton({ loading, label }) {
  return (
    <button type="submit" disabled={loading}
      className="btn-primary text-sm flex items-center gap-2 disabled:opacity-60">
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Saving…
        </>
      ) : (label || 'Save Changes')}
    </button>
  )
}

// ── 1. Personal Info ──────────────────────────────────────────────────────────
function PersonalTab() {
  const { profile, saveProfile }  = useBuyerProfile()
  const { updateUser }            = useAuth()
  const [form, setForm]           = useState({ name: profile?.name || '', phone: profile?.phone || '' })
  const [loading, setLoading]     = useState(false)
  const [feedback, setFeedback]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback('')
    setLoading(true)
    try {
      const updated = await saveProfile(form)
      updateUser(updated)
      setFeedback('Profile updated successfully.')
      setTimeout(() => setFeedback(''), 4000)
    } catch (err) {
      setFeedback(err.message)
    } finally { setLoading(false) }
  }

  if (!profile) return <div className="card h-48 animate-pulse" />

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'BK'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Feedback type={feedback.includes('success') ? 'success' : 'error'} message={feedback} />

      {/* Avatar strip */}
      <div className="card mb-5 flex items-center gap-5">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg shadow-blue-950/40 border border-blue-500/30">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-white tracking-wide">{profile.name}</p>
          <p className="text-sm text-slate-300 mt-0.5">{profile.email}</p>
          <span className="status-badge bg-blue-500/20 text-blue-300 border border-blue-500/30 mt-2 text-xs font-semibold">
            Buyer / Business
          </span>
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Full Name / Contact Person *</label>
          <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Email</label>
          <input type="email" className="input-field bg-slate-900/60 text-slate-300 cursor-not-allowed border-white/10" value={profile.email} disabled />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Phone</label>
          <input type="tel" className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="pt-2"><SaveButton loading={loading} /></div>
      </div>
    </form>
  )
}

// ── 2. Business Info ──────────────────────────────────────────────────────────
function BusinessTab() {
  const { buyerInfo, saveBuyerInfo } = useBuyerProfile()
  const [form, setForm] = useState({
    companyName:  buyerInfo?.companyName  || '',
    businessType: buyerInfo?.businessType || '',
    address:      buyerInfo?.address      || '',
    city:         buyerInfo?.city         || '',
    state:        buyerInfo?.state        || '',
    pincode:      buyerInfo?.pincode      || '',
    gstNumber:    buyerInfo?.gstNumber    || '',
    description:  buyerInfo?.description  || '',
  })
  const [loading, setLoading]   = useState(false)
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback('')
    setLoading(true)
    try {
      await saveBuyerInfo(form)
      setFeedback('Business information updated successfully.')
      setTimeout(() => setFeedback(''), 4000)
    } catch (err) {
      setFeedback(err.message)
    } finally { setLoading(false) }
  }

  if (!buyerInfo) return <div className="card h-48 animate-pulse" />

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Feedback type={feedback.includes('success') ? 'success' : 'error'} message={feedback} />
      <div className="card space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Company / Business Name</label>
            <input type="text" className="input-field" placeholder="FreshMart Pvt Ltd" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Business Type</label>
            <select className="input-field bg-slate-900 text-white" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })}>
              <option value="" className="bg-slate-900 text-white">Select type</option>
              <option className="bg-slate-900 text-white">Wholesale</option>
              <option className="bg-slate-900 text-white">Retail</option>
              <option className="bg-slate-900 text-white">Export</option>
              <option className="bg-slate-900 text-white">Restaurant / Hotel</option>
              <option className="bg-slate-900 text-white">Processing Unit</option>
              <option className="bg-slate-900 text-white">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Address</label>
          <input type="text" className="input-field" placeholder="Building / Street" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">City</label>
            <input type="text" className="input-field" placeholder="Pune" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">State</label>
            <input type="text" className="input-field" placeholder="Maharashtra" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Pincode</label>
            <input type="text" className="input-field" placeholder="411001" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">GST Number</label>
          <input type="text" className="input-field" placeholder="27AAAAA0000A1Z5" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Business Description</label>
          <textarea rows={3} className="input-field resize-none" placeholder="Brief description of your business and procurement needs…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="pt-2"><SaveButton loading={loading} /></div>
      </div>
    </form>
  )
}

// ── 3. Verification ──────────────────────────────────────────────────────────
function VerifyTab() {
  const { verification, requestVerification } = useBuyerProfile()
  const [docType, setDocType]   = useState('GST Certificate')
  const [loading, setLoading]   = useState(false)
  const [feedback, setFeedback] = useState('')

  if (!verification) return <div className="card h-48 animate-pulse" />

  const status = verification.status || 'Not Verified'
  const statusConfig = {
    'Not Verified': { cls: 'bg-slate-800 text-slate-300 border border-white/10',  icon: '⏳', label: 'Not Verified' },
    Pending:        { cls: 'bg-amber-500/20 text-amber-300 border border-amber-500/30', icon: '🔄', label: 'Pending Review' },
    Verified:       { cls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', icon: '✓',  label: 'Verified' },
  }
  const cfg = statusConfig[status] || statusConfig['Not Verified']

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback('')
    setLoading(true)
    try {
      await requestVerification({ documentType: docType })
      setFeedback('Verification request submitted. You will be notified when verified.')
      setTimeout(() => setFeedback(''), 5000)
    } catch (err) {
      setFeedback(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl">
      <Feedback type={feedback.includes('submitted') ? 'success' : 'error'} message={feedback} />
      <div className="card mb-5 flex items-center gap-5">
        <div className="w-14 h-14 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center text-3xl">{cfg.icon}</div>
        <div className="flex-1">
          <p className="font-bold text-white text-base">Verification Status</p>
          <span className={`status-badge text-xs mt-1.5 font-semibold ${cfg.cls}`}>{cfg.label}</span>
        </div>
      </div>
      <div className="card mb-5">
        <Row label="Document Type"  value={verification.documentType || '—'} />
        {verification.submittedAt && <Row label="Submitted On" value={new Date(verification.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />}
        {verification.verifiedAt && <Row label="Verified On"  value={new Date(verification.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />}
        {verification.notes && <div className="pt-3"><p className="text-xs text-slate-400 mb-1">Notes</p><p className="text-sm text-slate-200">{verification.notes}</p></div>}
      </div>
      {status !== 'Verified' && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Document Type for Verification</label>
            <select className="input-field bg-slate-900 text-white" value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option className="bg-slate-900 text-white">GST Certificate</option>
              <option className="bg-slate-900 text-white">PAN Card</option>
              <option className="bg-slate-900 text-white">Trade License</option>
              <option className="bg-slate-900 text-white">FSSAI License</option>
              <option className="bg-slate-900 text-white">Aadhaar</option>
            </select>
            <p className="text-xs text-slate-400 mt-2">Document upload coming soon. This submits your verification request.</p>
          </div>
          <SaveButton loading={loading} label="Request Verification" />
        </form>
      )}
    </div>
  )
}

// ── 4. Payment Details ───────────────────────────────────────────────────────
function PaymentTab() {
  const { paymentDetails, savePaymentDetails } = useBuyerProfile()
  const [form, setForm] = useState({ accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '', preferredMethod: '' })
  const [loading, setLoading]   = useState(false)
  const [feedback, setFeedback] = useState('')
  const isSet = paymentDetails?.isSet

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback('')
    setLoading(true)
    try {
      await savePaymentDetails(form)
      setFeedback('Payment details saved successfully.')
      setForm({ accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '', preferredMethod: '' })
      setTimeout(() => setFeedback(''), 4000)
    } catch (err) {
      setFeedback(err.message)
    } finally { setLoading(false) }
  }

  if (!paymentDetails) return <div className="card h-48 animate-pulse" />

  return (
    <div className="max-w-2xl">
      <Feedback type={feedback.includes('success') ? 'success' : 'error'} message={feedback} />
      {isSet && (
        <div className="card mb-5">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 pb-3 border-b border-white/10">Current Payment Details</h3>
          <Row label="Account Holder"    value={paymentDetails.accountHolderName} />
          <Row label="Bank Name"         value={paymentDetails.bankName} />
          <Row label="Account Number"    value={paymentDetails.accountNumber} />
          <Row label="IFSC Code"         value={paymentDetails.ifscCode} />
          <Row label="UPI ID"            value={paymentDetails.upiId} />
          <Row label="Preferred Method"  value={paymentDetails.preferredMethod} />
          <p className="text-xs text-slate-400 mt-3">Details are masked. Enter new values below to update.</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-3 border-b border-white/10">
          {isSet ? 'Update Payment Details' : 'Add Payment Details'}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Account Holder Name</label>
            <input type="text" className="input-field" placeholder="Rajesh Mehta" value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Bank Name</label>
            <input type="text" className="input-field" placeholder="HDFC Bank" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Account Number</label>
            <input type="text" className="input-field" placeholder="Enter full account number" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">IFSC Code</label>
            <input type="text" className="input-field" placeholder="HDFC0001234" value={form.ifscCode} onChange={(e) => setForm({ ...form, ifscCode: e.target.value })} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">UPI ID</label>
            <input type="text" className="input-field" placeholder="rajesh@hdfcbank" value={form.upiId} onChange={(e) => setForm({ ...form, upiId: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Preferred Method</label>
            <select className="input-field bg-slate-900 text-white" value={form.preferredMethod} onChange={(e) => setForm({ ...form, preferredMethod: e.target.value })}>
              <option value="" className="bg-slate-900 text-white">Select method</option>
              <option className="bg-slate-900 text-white">Bank Transfer</option>
              <option className="bg-slate-900 text-white">UPI</option>
              <option className="bg-slate-900 text-white">Cash</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-slate-400">Leave blank to keep existing values.</p>
        <div className="pt-2"><SaveButton loading={loading} /></div>
      </form>
    </div>
  )
}

// ── 5. Notifications ─────────────────────────────────────────────────────────
function NotifTab() {
  const { notifications, unreadCount, readNotification, readAllNotifications } = useBuyerProfile()
  const typeIcon = { booking: '📋', order: '📦', payment: '💰', pickup: '🚛', system: '🔔' }
  const timeAgo = (d) => {
    const mins = Math.floor((Date.now() - new Date(d)) / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-400">{unreadCount} unread</p>
        {unreadCount > 0 && (
          <button onClick={readAllNotifications} className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center card">
          <div className="w-16 h-16 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center text-3xl mb-4">🔔</div>
          <p className="font-bold text-white">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} onClick={() => !n.isRead && readNotification(n.id)}
              className={`card cursor-pointer transition-all hover:border-emerald-500/40 hover:bg-slate-800/90 ${
                !n.isRead ? 'border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-950/30' : ''
              }`}>
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-slate-800/90 border border-white/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {typeIcon[n.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!n.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 animate-pulse" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 6. Settings ─────────────────────────────────────────────────────────────
function SettingsTab() {
  const { profile, saveNotifPrefs } = useBuyerProfile()
  const { logout }                  = useAuth()
  const [pwForm, setPwForm]         = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading]   = useState(false)
  const [pwFeedback, setPwFeedback] = useState('')
  const [prefs, setPrefs]           = useState(null)
  const [prefsLoading, setPrefsLoading] = useState(false)
  const [prefsFeedback, setPrefsFeedback] = useState('')

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPwFeedback('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwFeedback('New passwords do not match.')
      return
    }
    setPwLoading(true)
    try {
      await apiChangePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwFeedback('Password changed successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwFeedback(''), 4000)
    } catch (err) {
      setPwFeedback(err.message)
    } finally { setPwLoading(false) }
  }

  const prefsDefaults = { emailBookings: true, emailOrders: true, emailPayments: true, pushBookings: true, pushOrders: true, pushPayments: true }
  const currentPrefs  = prefs || profile?.notificationPrefs || prefsDefaults

  function Toggle({ field, label }) {
    return (
      <label className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0 cursor-pointer">
        <span className="text-sm text-slate-200">{label}</span>
        <input
          type="checkbox"
          checked={currentPrefs[field] ?? true}
          onChange={(e) => setPrefs({ ...currentPrefs, [field]: e.target.checked })}
          className="w-5 h-5 rounded-lg border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/30 cursor-pointer"
        />
      </label>
    )
  }

  async function handleSavePrefs() {
    setPrefsLoading(true)
    setPrefsFeedback('')
    try {
      await saveNotifPrefs(prefs || currentPrefs)
      setPrefsFeedback('Notification preferences saved.')
      setTimeout(() => setPrefsFeedback(''), 4000)
    } catch (err) {
      setPrefsFeedback(err.message)
    } finally { setPrefsLoading(false) }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handlePasswordChange} className="card space-y-4">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-3 border-b border-white/10">Change Password</h3>
        <Feedback type={pwFeedback.includes('success') ? 'success' : 'error'} message={pwFeedback} />
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-1.5">Current Password *</label>
          <input type="password" className="input-field" required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">New Password *</label>
            <input type="password" className="input-field" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Confirm New Password *</label>
            <input type="password" className="input-field" required value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
          </div>
        </div>
        <div className="pt-2"><SaveButton loading={pwLoading} label="Change Password" /></div>
      </form>

      <div className="card space-y-2">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-3 border-b border-white/10 mb-3">Notification Preferences</h3>
        <Feedback type={prefsFeedback.includes('saved') ? 'success' : 'error'} message={prefsFeedback} />
        <Toggle field="emailBookings" label="Email — Booking updates" />
        <Toggle field="emailOrders"   label="Email — Order updates" />
        <Toggle field="emailPayments"  label="Email — Payment notifications" />
        <Toggle field="pushBookings"   label="Push — Booking updates" />
        <Toggle field="pushOrders"     label="Push — Order updates" />
        <Toggle field="pushPayments"   label="Push — Payment notifications" />
        <div className="pt-3">
          <button onClick={handleSavePrefs} disabled={prefsLoading} className="btn-outline text-sm disabled:opacity-60">
            {prefsLoading ? 'Saving…' : 'Save Preferences'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 pb-3 border-b border-white/10">Account</h3>
        <button
          onClick={logout}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────
function BuyerProfileShell() {
  const [tab, setTab]        = useState('personal')
  const { loading, error }   = useBuyerProfile()

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account, business details, verification, and settings." />

      {error && (
        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
      )}

      {/* ── Modern Glassmorphic Tab Bar (No Stark White Background) ── */}
      <div className="flex gap-1.5 bg-slate-900/90 border border-white/10 rounded-2xl p-1.5 mb-6 flex-wrap backdrop-blur-xl">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap
              ${tab === t.key
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card h-48 animate-pulse" />
      ) : (
        <>
          {tab === 'personal' && <PersonalTab />}
          {tab === 'business' && <BusinessTab />}
          {tab === 'verify'   && <VerifyTab />}
          {tab === 'payment'  && <PaymentTab />}
          {tab === 'notif'    && <NotifTab />}
          {tab === 'settings' && <SettingsTab />}
        </>
      )}
    </div>
  )
}

export default function BuyerProfile() {
  return (
    <BuyerProfileProvider>
      <BuyerProfileShell />
    </BuyerProfileProvider>
  )
}
