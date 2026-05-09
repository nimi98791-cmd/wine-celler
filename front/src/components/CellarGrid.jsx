export default function CellarGrid({ wines, favorites, onToggleFavorite, onOpenWine, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-wine-red/25 border-t-wine-red animate-spin mb-4" />
        <p className="text-white/30 text-sm">Loading your cellar…</p>
      </div>
    )
  }

  if (wines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-wine-red/25 mb-3" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M8 3v2M16 3v2M7 12h10M5 8h14l-1.5 11a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 8z" />
        </svg>
        <p className="text-white/30 text-sm leading-relaxed">
          Your cellar is empty.<br />Scan a wine to add one!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 p-3 pb-24">
      {wines.map(wine => (
        <WineCard
          key={wine.id}
          wine={wine}
          isFavorite={favorites.has(wine.id)}
          onToggleFavorite={onToggleFavorite}
          onOpen={() => onOpenWine(wine)}
        />
      ))}
    </div>
  )
}