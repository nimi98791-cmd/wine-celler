import { useRef, useState, useEffect } from 'react'
import { useCellar } from './hooks/useCellar.js'
import FilterBar from './components/FilterBar.jsx'
import CellarGrid from './components/CellarGrid.jsx'
import WineModal from './components/WineModal.jsx'
import BottomNav from './components/BottomNav.jsx'
import ScanningOverlay from './components/ScanningOverlay.jsx'
import ScanModal from './components/ScanModal.jsx'
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('hasSeenWineNotice');
    
    if (!hasSeenNotice) {
      alert(
        "Welcome to my Wine Cellar App!\n\n" +
        "Please note: This live application currently displays my personal wine collection data.\n\n" +
        "An advanced multi-user authentication system is under development and will be deployed soon!"
      );
      localStorage.setItem('hasSeenWineNotice', 'true');
    }
  }, []);
  
  const fileInputRef = useRef(null)
  const [scanDestination, setScanDestination] = useState(null) // 'cellar' | 'wishlist' | null
  const [showScanModal, setShowScanModal] = useState(false)

  const {
    loading, filteredWines,
    activeStatus, setActiveStatus,
    activeType, setActiveType,
    showingWishlist, toggleWishlistView,
    scanning, toast,
    selectedWine, setSelectedWine,
    deleteTarget, setDeleteTarget,
    handleScan, handleMoveToWishlist, handleDelete,
  } = useCellar()

  // User taps Scan → show destination picker
  const handleScanClick = () => setShowScanModal(true)

  // User picks cellar or wishlist → open file picker
  const handleDestinationChosen = (status) => {
    setScanDestination(status)
    setShowScanModal(false)
    fileInputRef.current?.click()
  }

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (file) handleScan(file, scanDestination || 'cellar')
    e.target.value = ''
  }

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-neutral-900 flex flex-col">
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

      <FilterBar activeStatus={activeStatus} setActiveStatus={setActiveStatus} activeType={activeType} setActiveType={setActiveType} />

      <CellarGrid
        wines={filteredWines}
        loading={loading}
        onToggleFavorite={() => {}} // favorites are local-only; pass your favorites state if needed
        favorites={new Set()}
        onOpenWine={setSelectedWine}
      />

      <BottomNav
        onScanClick={handleScanClick}
        showingWishlist={showingWishlist}
        onToggleWishlist={toggleWishlistView}
        favoriteCount={0}
      />

      {showScanModal && (
        <ScanModal onScan={handleDestinationChosen} onCancel={() => setShowScanModal(false)} />
      )}

      {selectedWine && (
        <WineModal
          wine={selectedWine}
          isFavorite={false}
          onToggleFavorite={() => {}}
          onClose={() => setSelectedWine(null)}
          onDelete={(wine) => setDeleteTarget(wine)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          wine={deleteTarget}
          onMoveToWishlist={handleMoveToWishlist}
          onDelete={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {scanning && <ScanningOverlay />}
      <Toast toast={toast} />
    </div>
  )
}