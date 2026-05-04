import { ref, computed } from 'vue'

const CACHE_VERSION = 'v2_kemenag'
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours

const PRAYER_NAMES = {
  subuh: 'Subuh',
  syuruq: 'Syuruq',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya'
}

// Kemenag API for Kota Solo (city_id: 1434)
const KEMENAG_URL = 'https://api.myquran.com/v2/sholat/jadwal'

export function usePrayerTimes() {
  const prayerTimes = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetched = ref(null)

  const prayerList = computed(() => {
    if (!prayerTimes.value) return []
    return [
      { key: 'subuh', name: 'Subuh', time: prayerTimes.value.subuh },
      { key: 'syuruq', name: 'Syuruq', time: prayerTimes.value.syuruq },
      { key: 'dzuhur', name: 'Dzuhur', time: prayerTimes.value.dzuhur },
      { key: 'ashar', name: 'Ashar', time: prayerTimes.value.ashar },
      { key: 'maghrib', name: 'Maghrib', time: prayerTimes.value.maghrib },
      { key: 'isya', name: 'Isya', time: prayerTimes.value.isya }
    ]
  })

  function applyOffsets(times, offsets = {}) {
    const result = { ...times }
    Object.keys(offsets).forEach(prayer => {
      const offset = parseInt(offsets[`prayer_offset_${prayer}`] || 0)
      if (offset !== 0 && result[prayer]) {
        const [h, m] = result[prayer].split(':').map(Number)
        const totalMins = h * 60 + m + offset
        const newH = Math.floor(((totalMins % (24 * 60)) + 24 * 60) / 60) % 24
        const newM = ((totalMins % 60) + 60) % 60
        result[prayer] = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
      }
    })
    return result
  }

  function getCacheKey(cityId) {
    return `prayer_times_cache_${CACHE_VERSION}_${cityId}`
  }

  function loadFromCache(cityId) {
    try {
      const cached = localStorage.getItem(getCacheKey(cityId))
      if (!cached) return null
      const { data, timestamp, date } = JSON.parse(cached)
      const today = new Date().toDateString()
      if (date !== today) return null // stale date
      if (Date.now() - timestamp > CACHE_DURATION) return null
      return data
    } catch { return null }
  }

  function saveToCache(cityId, data) {
    try {
      localStorage.setItem(getCacheKey(cityId), JSON.stringify({
        data,
        timestamp: Date.now(),
        date: new Date().toDateString()
      }))
    } catch { /* ignore */ }
  }

  async function fetchFromKemenag(cityId, date = new Date()) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    const url = `${KEMENAG_URL}/${cityId}/${year}-${month}-${day}`

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`Kemenag API error: ${res.status}`)

    const json = await res.json()
    if (!json.status || !json.data || !json.data.jadwal) {
      throw new Error('No valid data from Kemenag API')
    }

    const timings = json.data.jadwal
    return {
      subuh: timings.subuh,
      syuruq: timings.terbit, // Using terbit as syuruq
      dzuhur: timings.dzuhur,
      ashar: timings.ashar,
      maghrib: timings.maghrib,
      isya: timings.isya
    }
  }

  async function fetchPrayerTimes(settings = {}) {
    loading.value = true
    error.value = null

    // Purge any old-format cache keys (from Aladhan API era)
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('prayer_times_cache') && !k.includes(CACHE_VERSION)) {
          localStorage.removeItem(k)
        }
      })
    } catch { /* ignore */ }

    const cityId = String(settings.city_id || '1434')

    try {
      // Check cache first (keyed by cityId)
      const cached = loadFromCache(cityId)
      if (cached) {
        prayerTimes.value = applyOffsets(cached, settings)
        loading.value = false
        lastFetched.value = new Date()
        return
      }

      // Fetch from Kemenag API
      const raw = await fetchFromKemenag(cityId, new Date())
      saveToCache(cityId, raw)
      prayerTimes.value = applyOffsets(raw, settings)
      lastFetched.value = new Date()

    } catch (err) {
      console.error('Prayer times fetch error:', err)
      error.value = err.message
      // Use fallback times for Surakarta
      prayerTimes.value = getFallbackTimes()
    } finally {
      loading.value = false
    }
  }

  function getActivePrayer(now = new Date()) {
    if (!prayerTimes.value) return null
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    // Prayers that have iqomah (not syuruq)
    const iqomahPrayers = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya']
    let active = null

    for (let i = 0; i < iqomahPrayers.length; i++) {
      const prayer = iqomahPrayers[i]
      const time = prayerTimes.value[prayer]
      if (!time) continue

      const [h, m] = time.split(':').map(Number)
      const prayerMinutes = h * 60 + m

      if (currentMinutes >= prayerMinutes) {
        active = prayer
      }
    }

    return active
  }

  function getNextPrayer(now = new Date()) {
    if (!prayerTimes.value) return null
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const allPrayers = ['subuh', 'syuruq', 'dzuhur', 'ashar', 'maghrib', 'isya']

    for (const prayer of allPrayers) {
      const time = prayerTimes.value[prayer]
      if (!time) continue
      const [h, m] = time.split(':').map(Number)
      if (h * 60 + m > currentMinutes) {
        return { prayer, time }
      }
    }

    return { prayer: 'subuh', time: prayerTimes.value.subuh }
  }

  function getPrayerMinutes(prayer) {
    if (!prayerTimes.value?.[prayer]) return -1
    const [h, m] = prayerTimes.value[prayer].split(':').map(Number)
    return h * 60 + m
  }

  function getFallbackTimes() {
    // Approximate prayer times for Surakarta (WIB/UTC+7) - from Kemenag data
    return {
      subuh: '04:21',
      syuruq: '05:37',
      dzuhur: '11:36',
      ashar: '14:57',
      maghrib: '17:31',
      isya: '18:42'
    }
  }

  return {
    prayerTimes,
    prayerList,
    loading,
    error,
    lastFetched,
    fetchPrayerTimes,
    getActivePrayer,
    getNextPrayer,
    getPrayerMinutes,
    PRAYER_NAMES
  }
}
