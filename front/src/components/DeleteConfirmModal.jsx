export default function DeleteConfirmModal({ wine, onMoveToWishlist, onDelete, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-30 flex items-end justify-center"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-neutral-900 rounded-t-[20px] w-full max-w-[420px] px-5 pt-4 pb-8">
        <div className="w-9 h-1 bg-white/10 rounded-full mx-auto mb-5" />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-wine-red/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-wine-red" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 3h6l1 2H8L9 3zM4 5h16M6 5l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2L18 5" />
              <path d="M10 11v4M14 11v4" />
            </svg>
          </div>
        </div>

        <h2 className="text-white/90 text-base font-medium text-center mb-1">
          Did you drink this wine?
        </h2>
        <p className="text-white/40 text-sm text-center leading-relaxed mb-6">
          <span className="text-white/65">{wine.wine_name}</span>
          <br />
          Move it to your Wishlist to remember it, or delete it completely.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onMoveToWishlist(wine.id)}
            className="w-full py-3 rounded-xl bg-neutral-800 text-white/85 text-sm font-medium flex items-center justify-center gap-2 hover:bg-neutral-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-wine-red-light" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Move to Wishlist
          </button>
          <button
            onClick={() => onDelete(wine.id)}
            className="w-full py-3 rounded-xl bg-wine-red text-white text-sm font-medium hover:bg-wine-red-light transition-colors"
          >
            Delete Permanently
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