const BASE = 'https://wine-celler.onrender.com/api';

export async function fetchWines() {
  const res = await fetch(`${BASE}/wines`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch wines')
  return data.data
}

export async function scanWine(file, status = 'cellar') {
  const fd = new FormData()
  fd.append('image', file)
  fd.append('status', status)  // 'cellar' or 'wishlist'
  const res = await fetch(`${BASE}/wines/scan`, { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Scan failed')
  return data.data
}

export async function updateWineStatus(id, status) {
  const res = await fetch(`${BASE}/wines/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update status')
  return data.data
}

export async function deleteWine(id) {
  const res = await fetch(`${BASE}/wines/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete wine')
}