import { ref, computed, onUnmounted } from 'vue'

/**
 * Real-time clock with Hijri date support
 */
export function useClock() {
  const now = ref(new Date())
  let timer = null

  const hours = computed(() => String(now.value.getHours()).padStart(2, '0'))
  const minutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))
  const seconds = computed(() => String(now.value.getSeconds()).padStart(2, '0'))

  const timeString = computed(() => `${hours.value}:${minutes.value}:${seconds.value}`)
  const dateString = computed(() => {
    return now.value.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })

  const hijriString = computed(() => toHijriManual(now.value))

  function start() {
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onUnmounted(stop)

  return {
    now,
    hours,
    minutes,
    seconds,
    timeString,
    dateString,
    hijriString,
    start,
    stop
  }
}

/**
 * Manual Hijri date conversion fallback
 */
function toHijriManual(date) {
  // Simple Hijri conversion (approximate)
  const JD = Math.floor((date.getTime() / 86400000) + 2440588)
  const L = JD - 1948440 + 10632
  const N = Math.floor((L - 1) / 10631)
  const L2 = L - 10631 * N + 354
  const J = Math.floor((10985 - L2) / 5316) * Math.floor((50 * L2) / 17719)
    + Math.floor(L2 / 5670) * Math.floor((43 * L2) / 15238)
  const L3 = L2 - Math.floor((30 - J) / 15) * Math.floor((17719 * J) / 50)
    - Math.floor(J / 16) * Math.floor((15238 * J) / 43) + 29
  const month = Math.floor((24 * L3) / 709)
  const day = L3 - Math.floor((709 * month) / 24)
  const year = 30 * N + J - 30

  const hijriMonths = [
    'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
    'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
    'Ramadhan', 'Syawwal', "Dzulqa'dah", 'Dzulhijjah'
  ]

  return `${day} ${hijriMonths[month - 1]} ${year} H`
}
