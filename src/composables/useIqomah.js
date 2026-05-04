import { ref, computed, onUnmounted } from 'vue'

/**
 * Iqomah countdown composable
 * Monitors prayer times and triggers iqomah countdown
 */
export function useIqomah(prayerTimesRef, iqomahTimesRef) {
  const isCountingDown = ref(false)
  const currentPrayer = ref(null)
  const remainingSeconds = ref(0)
  const totalSeconds = ref(0)
  let checkInterval = null
  let countdownInterval = null

  // Track which prayers have already triggered today
  const triggeredPrayers = ref(new Set())

  const progressPercent = computed(() => {
    if (totalSeconds.value === 0) return 0
    return ((totalSeconds.value - remainingSeconds.value) / totalSeconds.value) * 100
  })

  const formattedRemaining = computed(() => {
    const mins = Math.floor(remainingSeconds.value / 60)
    const secs = remainingSeconds.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  const isUrgent = computed(() => remainingSeconds.value <= 60)

  function startCountdown(prayer, iqomahMinutes, onComplete) {
    stopCountdown()

    currentPrayer.value = prayer
    totalSeconds.value = iqomahMinutes * 60
    remainingSeconds.value = totalSeconds.value
    isCountingDown.value = true

    countdownInterval = setInterval(() => {
      remainingSeconds.value -= 1

      if (remainingSeconds.value <= 0) {
        stopCountdown()
        if (onComplete) onComplete(prayer)
      }
    }, 1000)
  }

  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    isCountingDown.value = false
    currentPrayer.value = null
    remainingSeconds.value = 0
    totalSeconds.value = 0
  }

  function resetDailyTriggers() {
    triggeredPrayers.value = new Set()
  }

  function checkPrayerTime(now, onTrigger) {
    if (!prayerTimesRef.value || isCountingDown.value) return

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const currentSeconds = currentMinutes * 60 + now.getSeconds()

    const iqomahPrayers = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya']

    for (const prayer of iqomahPrayers) {
      if (triggeredPrayers.value.has(prayer)) continue

      const timeStr = prayerTimesRef.value[prayer]
      if (!timeStr) continue

      const [h, m] = timeStr.split(':').map(Number)
      const prayerMinutes = h * 60 + m
      const prayerSeconds = prayerMinutes * 60

      // Trigger at exact prayer time (within 5 second window)
      if (currentSeconds >= prayerSeconds && currentSeconds <= prayerSeconds + 5) {
        triggeredPrayers.value.add(prayer)
        if (onTrigger) onTrigger(prayer)
        break
      }
    }
  }

  function startMonitoring(onTrigger) {
    checkInterval = setInterval(() => {
      checkPrayerTime(new Date(), onTrigger)
    }, 1000)
  }

  function stopMonitoring() {
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }

  onUnmounted(() => {
    stopCountdown()
    stopMonitoring()
  })

  return {
    isCountingDown,
    currentPrayer,
    remainingSeconds,
    totalSeconds,
    progressPercent,
    formattedRemaining,
    isUrgent,
    startCountdown,
    stopCountdown,
    startMonitoring,
    stopMonitoring,
    resetDailyTriggers
  }
}
