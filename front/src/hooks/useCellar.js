import { useState, useEffect, useCallback } from 'react'
import { fetchWines, scanWine } from '../services/api.js'

export function useCellar() {
  const [wines, setWines] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(new Set())
  const [activeStatus, setActiveStatus] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [showingWishlist, setShowingWishlist] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedWine, setSelectedWine] = useState(null)

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
    if (showingWishlist && !favorites.has(w.id)) return false
    if (activeStatus === 'drink' && !w.drink_now) return false
    if (activeStatus === 'age' && w.drink_now) return false
    if (activeType !== 'all' && w.type !== activeType) return false
    return true
  })

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleWishlistView = useCallback(() => {
    setShowingWishlist(prev => !prev)
  }, [])

  const handleScan = useCallback(async (file) => {
    setScanning(true)
    try {
      const wine = await scanWine(file)
      setWines(prev => [wine, ...prev])
      showToast('Wine added to your cellar!')
    } catch (err) {
      showToast(err.message || 'Could not scan wine.', true)
    } finally {
      setScanning(false)
    }
  }, [])

  return {
    wines,
    loading,
    filteredWines,
    favorites,
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
  }
}