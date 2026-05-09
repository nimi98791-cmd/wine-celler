import { useState, useEffect, useCallback } from 'react'
import { fetchWines, scanWine, updateWineStatus, deleteWine } from '../services/api.js'

export function useCellar() {
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [showingWishlist, setShowingWishlist] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedWine, setSelectedWine] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null) // wine pending delete confirmation

  useEffect(() => {
    fetchWines()
      .then(data => setWines(data ?? []))
      .catch(() => setWines([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (message, error = false) => setToast({ message, error })

  const filteredWines = wines.filter(w => {
    if (showingWishlist && w.status !== 'wishlist') return false
    if (!showingWishlist && w.status === 'wishlist') return false // hide wishlist wines in main cellar view
    if (activeStatus === 'drink' && !w.drink_now) return false
    if (activeStatus === 'age' && w.drink_now) return false
    if (activeType !== 'all' && w.type !== activeType) return false
    return true
  })

  const handleScan = useCallback(async (file, status = 'cellar') => {
    setScanning(true)
    try {
      const wine = await scanWine(file, status)
      setWines(prev => [wine, ...prev])
      showToast(status === 'wishlist' ? 'Added to your Wishlist!' : 'Wine added to your Cellar!')
    } catch (err) {
      showToast(err.message || 'Could not scan wine.', true)
    } finally {
      setScanning(false)
    }
  }, [])

  // Called from the confirmation modal
  const handleMoveToWishlist = useCallback(async (id) => {
    try {
      const updated = await updateWineStatus(id, 'wishlist')
      setWines(prev => prev.map(w => w.id === id ? updated : w))
      setDeleteTarget(null)
      setSelectedWine(null)
      showToast('Moved to your Wishlist!')
    } catch (err) {
      showToast(err.message, true)
    }
  }, [])

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteWine(id)
      setWines(prev => prev.filter(w => w.id !== id))
      setDeleteTarget(null)
      setSelectedWine(null)
      showToast('Wine removed from your cellar.')
    } catch (err) {
      showToast(err.message, true)
    }
  }, [])

  const toggleWishlistView = useCallback(() => setShowingWishlist(prev => !prev), [])

  return {
    wines,
    loading,
    filteredWines,
    activeStatus, setActiveStatus,
    activeType, setActiveType,
    showingWishlist, toggleWishlistView,
    scanning,
    toast,
    selectedWine, setSelectedWine,
    deleteTarget, setDeleteTarget,
    handleScan,
    handleMoveToWishlist,
    handleDelete,
  }
}