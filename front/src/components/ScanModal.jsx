export default function ScanModal({ onScan, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-30 flex items-end justify-center"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-neutral-900 rounded-t-[20px] w-full max-w-[420px] px-5 pt-4 pb-8">
        <div className="w-9 h-1 bg-white/10 rounded-full mx-auto mb-5" />

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-wine-red/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-wine-red" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>

        <h2 className="text-white/90 text-base font-medium text-center mb-1">
          Scan a Wine Bottle
        </h2>
        <p className="text-white/40 text-sm text-center mb-6">
          Where would you like to add this wine?
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onScan('cellar')}
            className="w-full py-3 rounded-xl bg-wine-red text-white text-sm font-medium hover:bg-wine-red-light transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M8 3v2M16 3v2M7 12h10M5 8h14l-1.5 11a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 8z" />
            </svg>
            Add to Cellar
          </button>
          <button
            onClick={() => onScan('wishlist')}
            className="w-full py-3 rounded-xl bg-neutral-800 text-white/85 text-sm font-medium hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-wine-red-light" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Add to Wishlist
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 text-white/35 text-sm hover:text-white/60 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}