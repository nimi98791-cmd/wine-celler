const BASE = 'https://wine-celler.onrender.com/api'

/**
 * Fetches all wines from the backend.
 * @returns {Promise<object[]>}
 */
export async function fetchWines() {
  const res = await fetch(`${BASE}/wines`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to fetch wines')
  return data.data
}

/**
 * Uploads an image file and scans the wine label.
 * @param {File} file
 * @returns {Promise<object>} The newly created wine record.
 */
export async function scanWine(file) {
  const fd = new FormData()
  fd.append('image', file)
  const res = await fetch(`${BASE}/wines/scan`, { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Scan failed')
  return data.data
}
