import Bottle, { getInitials } from './Bottle.jsx'

export default function WineCard({ wine, isFavorite, onToggleFavorite, onOpen }) {
  const initials = getInitials(wine.wine_name)
  const shortName = wine.wine_name.length > 20 ? wine.wine_name.slice(0, 18) + '…' : wine.wine_name

  return (
    <div className="bg-neutral-950 rounded-xl border border-white/[0.07] overflow-hidden">
      <button
        className="w-full flex flex-col items-center pt-2.5 pb-2 px-2 relative cursor-pointer transition-colors hover:bg-white/[0.03] active:scale-[0.97]"
        onClick={onOpen}
        aria-label={`View ${wine.wine_name}`}
      >
        {/* Heart */}
        <button
          className="absolute top-1.5 right-1.5 p-1 z-10"
          onClick={e => { e.stopPropagation(); onToggleFavorite(wine.id) }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 transition-colors" fill={isFavorite ? '#E74C3C' : 'none'} stroke={isFavorite ? '#E74C3C' : 'rgba(245,240,235,0.25)'} strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <Bottle type={wine.type} initials={initials} size="sm" />

        <p className="mt-1.5 text-[10px] text-white/90 font-medium text-center leading-snug px-0.5">{shortName}</p>
        {wine.vintage && <p className="text-[9px] text-white/40 mt-0.5">{wine.vintage}</p>}

        {/* Ideal drinking years — shown if available, otherwise ready/aging badge */}
        {wine.ideal_drinking_years ? (
          <span className="mt-1.5 text-[9px] text-amber-400/80 font-medium">{wine.ideal_drinking_years}</span>
        ) : (
          <span className={`mt-1 text-[8px] px-1.5 py-0.5 rounded-full border ${wine.drink_now ? 'bg-green-900/20 text-green-400 border-green-500/25' : 'bg-amber-900/20 text-amber-400 border-amber-500/25'}`}>
            {wine.drink_now ? 'Ready' : 'Aging'}
          </span>
        )}
      </button>
    </div>
  )
}