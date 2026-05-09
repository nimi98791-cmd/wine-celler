import { useCellar } from './hooks/useCellar.js'
import FilterBar from './components/FilterBar.jsx'
import CellarGrid from './components/CellarGrid.jsx'
import WineModal from './components/WineModal.jsx'
import BottomNav from './components/BottomNav.jsx'
import ScanningOverlay from './components/ScanningOverlay.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const {
    filteredWines,
    favorites,
    loading,
    activeStatus,
    setActiveStatus,
    activeType,
    setActiveType,
    showingWishlist,
    toggleWishlistView,
    scanning,
    toast,
    selectedWine,
    setSelectedWine,
    toggleFavorite,
    handleScan,
  } = useCellar()

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-neutral-900 flex flex-col">
      <FilterBar
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        activeType={activeType}
        setActiveType={setActiveType}
      />

      <CellarGrid
        wines={filteredWines}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onOpenWine={setSelectedWine}
        loading={loading}
      />

      <BottomNav
        onScan={handleScan}
        showingWishlist={showingWishlist}
        onToggleWishlist={toggleWishlistView}
        favoriteCount={favorites.size}
      />

      {selectedWine && (
        <WineModal
          wine={selectedWine}
          isFavorite={favorites.has(selectedWine.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedWine(null)}
        />
      )}

      {scanning && <ScanningOverlay />}

      <Toast toast={toast} />
    </div>
  )
}
