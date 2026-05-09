import { useEffect } from 'react'
import Bottle, { getInitials } from './Bottle'

function DetailRow({ icon, label, children }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.06] last:border-0">
      <span className="flex items-center gap-2 text-[13px] text-white/45">
        {icon}
        {label}
      </span>
      <span className="text-[13px] text-white/90 font-medium text-right max-w-[55%]">
        {children}
      </span>
    </div>
  )
}

export default function WineModal({ wine, isFavorite, onToggleFavorite, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const ratingPct = Math.max(0, Math.min(100, ((wine.rating_out_of_100 || 80) - 80) / 20 * 100))

  return (
    <div
      className="fixed inset-0 bg-black/80 z-20 flex items-end justify-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={wine.wine_name}
    >
      <div className="bg-neutral-900 rounded-t-[20px] w-full max-w-[420px] max-h-[88vh] overflow-y-auto">
        {/* Handle */}
        <div className="w-9 h-1 bg-white/10 rounded-full mx-auto mt-3 mb-3.5" />

        {/* Hero */}
        <div className="bg-neutral-950 px-4 py-4 flex items-center gap-4">
          <Bottle type={wine.type} initials={getInitials(wine.wine_name)} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-white/95 text-base font-medium leading-snug mb-0.5">
              {wine.wine_name}
            </p>
            <p className="text-white/45 text-xs mb-2.5">{wine.winery}</p>
            <div className="flex flex-wrap gap-1.5">
              {wine.vintage && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-white/55">
                  {wine.vintage}
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-white/55">
                {wine.type}
              </span>
              <span
                className={[
                  'text-[10px] px-2 py-0.5 rounded-full border',
                  wine.drink_now
                    ? 'text-green-400 border-green-500/30'
                    : 'text-amber-400 border-amber-500/30',
                ].join(' ')}
              >
                {wine.drink_now ? 'Ready to Drink' : 'Needs Aging'}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pt-3.5">
          {/* Characteristics */}
          <div className="bg-neutral-950 rounded-xl px-3.5 py-3 mb-1">
            <p className="text-[13px] text-white/50 italic leading-relaxed">
              "{wine.characteristics}"
            </p>
          </div>

          {/* Details */}
          <DetailRow
            label="Rating"
            icon={<StarIcon />}
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-20 h-1.5 bg-white/10 rounded-full overflow-hidden align-middle">
                <span
                  className="block h-full bg-wine-red rounded-full"
                  style={{ width: `${ratingPct}%` }}
                />
              </span>
              {wine.rating_out_of_100}/100
            </span>
          </DetailRow>

          <DetailRow label="Est. Price" icon={<DollarIcon />}>
            ${(wine.estimated_price || 0).toLocaleString()}
          </DetailRow>

          <DetailRow label="Aging Potential" icon={<HourglassIcon />}>
            {wine.aging_potential}
          </DetailRow>

          <DetailRow label="Vintage" icon={<CalendarIcon />}>
            {wine.vintage || 'NV'}
          </DetailRow>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 px-4 pt-4 pb-2">
          <button
            onClick={() => onToggleFavorite(wine.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/15 text-[13px] text-white/85 transition-colors hover:bg-white/[0.05]"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={isFavorite ? '#E74C3C' : 'none'} stroke={isFavorite ? '#E74C3C' : 'currentColor'} strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {isFavorite ? 'Saved' : 'Save to Wishlist'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-wine-red text-white text-[13px] font-medium transition-colors hover:bg-wine-red-light"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Inline icon components (avoids external icon dependency)
const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const DollarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)
const HourglassIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </svg>
)
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
