const ICON_SIZE = 'w-[22px] h-[22px]'
const ICON_STROKE = 1.8

function CameraIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function HeartIcon({ className, filled }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={ICON_STROKE} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function BottomNav({ onScanClick, showingWishlist, onToggleWishlist, favoriteCount }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-neutral-900 border-t border-white/[0.07] flex justify-around items-center px-6 pt-2.5 pb-4 z-10">
      <button onClick={onScanClick} className="flex flex-col items-center gap-1" aria-label="Scan a wine bottle">
        <div className="w-11 h-11 rounded-full bg-wine-red flex items-center justify-center transition-colors hover:bg-wine-red-light active:scale-95">
          <CameraIcon className={`${ICON_SIZE} text-white`} />
        </div>
        <span className="text-[10px] text-white/45">Scan</span>
      </button>

      <button onClick={onToggleWishlist} className="flex flex-col items-center gap-1" aria-label={showingWishlist ? 'Show cellar' : 'Show wishlist'} aria-pressed={showingWishlist}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center relative transition-colors hover:bg-white/[0.05] active:scale-95">
          <HeartIcon className={`${ICON_SIZE} transition-colors ${showingWishlist ? 'text-wine-red-light' : 'text-white/40'}`} filled={showingWishlist} />
          {favoriteCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-wine-red-light text-white text-[8px] flex items-center justify-center font-medium">
              {favoriteCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] transition-colors ${showingWishlist ? 'text-wine-red-light' : 'text-white/45'}`}>Wishlist</span>
      </button>
    </nav>
  )
}