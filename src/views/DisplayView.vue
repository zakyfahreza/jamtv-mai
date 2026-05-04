<template>
  <div class="display-view tv-display w-full h-screen overflow-hidden relative">

    <!-- Iqomah Countdown Overlay -->
    <IqomahCountdown
      :show="iqomah.isCountingDown.value"
      :prayer="iqomah.currentPrayer.value"
      :formatted-remaining="iqomah.formattedRemaining.value"
      :progress-percent="iqomah.progressPercent.value"
      :is-urgent="iqomah.isUrgent.value"
      :prayer-names="prayer.PRAYER_NAMES"
    />

    <!-- Mode switcher -->
    <Transition name="fade">
      <!-- Clock Mode -->
      <ClockMode
        v-if="currentMode === 'clock'"
        key="clock"
        :hours="clock.hours.value"
        :minutes="clock.minutes.value"
        :seconds="clock.seconds.value"
        :date-string="clock.dateString.value"
        :hijri-string="clock.hijriString.value"
        :now="clock.now.value"
        :settings="settings"
        :prayer-list="prayer.prayerList.value"
        :next-prayer="prayer.getNextPrayer(clock.now.value)"
        :prayer-loading="prayer.loading.value"
        :announcements="announcements"
        :announcement-interval="announcementInterval"
      />

      <!-- Slideshow Mode -->
      <DisplaySlideshow
        v-else-if="currentMode === 'slideshow'"
        key="slideshow"
        :hours="clock.hours.value"
        :minutes="clock.minutes.value"
        :seconds="clock.seconds.value"
        :date-string="clock.dateString.value"
        :hijri-string="clock.hijriString.value"
        :now="clock.now.value"
        :settings="settings"
        :prayer-list="prayer.prayerList.value"
        :next-prayer="prayer.getNextPrayer(clock.now.value)"
        :announcements="announcements"
        :announcement-interval="announcementInterval"
        :slides="slides"
      />
    </Transition>

    <!-- Mode dots -->
    <div class="absolute top-3 right-4 z-20 flex gap-1.5">
      <div class="w-1.5 h-1.5 rounded-full transition-all duration-500"
        :style="{ background: currentMode === 'clock' ? '#D4AF37' : 'rgba(255,255,255,0.15)' }"
      ></div>
      <div class="w-1.5 h-1.5 rounded-full transition-all duration-500"
        :style="{ background: currentMode === 'slideshow' ? '#D4AF37' : 'rgba(255,255,255,0.15)' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ClockMode      from '@/components/ClockMode.vue'
import DisplaySlideshow from '@/components/DisplaySlideshow.vue'
import IqomahCountdown from '@/components/IqomahCountdown.vue'
import { useClock }        from '@/composables/useClock'
import { usePrayerTimes }  from '@/composables/usePrayerTimes'
import { useIqomah }       from '@/composables/useIqomah'
import { useAudio }        from '@/composables/useAudio'
import {
  getSettings, getAnnouncements, getIqomahTimes
} from '@/composables/useSupabase'
import slideImg from '@/assets/slides/slide.png'

// Load all images from /src/assets/slides/ at build time
const localSlideModules = import.meta.glob('@/assets/slides/*.{png,jpg,jpeg,webp,gif}', { eager: true })

// Try to load local notification audio if it exists
let notificationAudio = null
try {
  const audioMods = import.meta.glob('@/assets/notification.{mp3,wav,ogg}', { eager: true })
  const audioKeys = Object.keys(audioMods)
  if (audioKeys.length > 0) notificationAudio = audioMods[audioKeys[0]].default
} catch (e) { /* no notification audio file */ }

// ─── State ───────────────────────────────────────────────────────────────────
const settings      = ref({})
const slides        = ref([])
const announcements = ref([])
const iqomahTimes   = ref({})
const currentMode   = ref('clock')
let modeSwitchTimer = null
let refreshTimer    = null

// Derived: announcement interval from settings (seconds → ms), default 12s
const announcementInterval = computed(() =>
  (parseInt(settings.value.announcement_interval) || 12) * 1000
)

// ─── Composables ─────────────────────────────────────────────────────────────
const clock  = useClock()
const prayer = usePrayerTimes()
const audio  = useAudio()
const iqomah = useIqomah(prayer.prayerTimes, iqomahTimes)

// ─── Mode Switching ───────────────────────────────────────────────────────────
function getModeDuration(mode) {
  if (mode === 'clock')     return (parseInt(settings.value.clock_duration)  || 30) * 1000
  if (mode === 'slideshow') return (parseInt(settings.value.slide_duration)  || 20) * 1000
  return 30000
}

function switchMode() {
  if (iqomah.isCountingDown.value) { scheduleNextSwitch(); return }
  
  if (settings.value.display_mode === 'clock') {
    currentMode.value = 'clock'
  } else if (settings.value.display_mode === 'slideshow') {
    currentMode.value = (slides.value.length > 0) ? 'slideshow' : 'clock'
  } else {
    currentMode.value = (currentMode.value === 'clock' && slides.value.length > 0)
      ? 'slideshow' : 'clock'
  }
  scheduleNextSwitch()
}

function scheduleNextSwitch() {
  if (modeSwitchTimer) clearTimeout(modeSwitchTimer)
  modeSwitchTimer = setTimeout(switchMode, getModeDuration(currentMode.value))
}

// ─── Prayer / Iqomah ─────────────────────────────────────────────────────────
function onPrayerTriggered(prayerName) {
  playNotification()
  currentMode.value = 'clock'
  if (modeSwitchTimer) clearTimeout(modeSwitchTimer)
  // start countdown after adzan (~3 min)
  setTimeout(() => {
    const mins = iqomahTimes.value[prayerName] || 10
    iqomah.startCountdown(prayerName, mins, onIqomahComplete)
  }, 3 * 60 * 1000)
}

function onIqomahComplete(prayerName) {
  playNotification()
  setTimeout(scheduleNextSwitch, 5000)
}

// ─── Local Notification Audio ────────────────────────────────────────────────
function playNotification() {
  try {
    const a = new Audio(notificationAudio)
    a.play().catch(() => {})
  } catch (e) { /* ignore */ }
}

// ─── Data ────────────────────────────────────────────────────────────────────
async function loadAllData() {
  const [s, an, it] = await Promise.all([
    getSettings(), getAnnouncements(),
    getIqomahTimes()
  ])
  settings.value = s

  // Load slides from local assets
  const localSlides = Object.entries(localSlideModules).map(([path, mod], i) => ({
    id: `local_${i}`,
    image_url: mod.default,
    title: '',
    duration: parseInt(s.slide_duration) || 8,
    is_active: true
  }))
  slides.value = localSlides.length > 0 ? localSlides
    : [{ id: 'dummy', image_url: slideImg, title: '', duration: 10, is_active: true }]

  announcements.value = an
  iqomahTimes.value   = it
  await prayer.fetchPrayerTimes(s)
}

function setupMidnightReset() {
  const ms = new Date().setHours(24, 0, 0, 0) - Date.now()
  setTimeout(() => {
    iqomah.resetDailyTriggers()
    prayer.fetchPrayerTimes(settings.value)
    setupMidnightReset()
  }, ms)
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  // Set TV overflow mode
  document.documentElement.classList.add('tv-mode')
  document.body.style.overflow = 'hidden'

  clock.start()
  await loadAllData()
  
  if (settings.value.display_mode === 'slideshow') {
    currentMode.value = slides.value.length > 0 ? 'slideshow' : 'clock'
  } else {
    currentMode.value = 'clock'
  }
  
  scheduleNextSwitch()
  iqomah.startMonitoring(onPrayerTriggered)
  setupMidnightReset()
  refreshTimer = setInterval(loadAllData, 24 * 60 * 60 * 1000)

  // Unlock audio after 5s (TV autoplay)
  setTimeout(() => audio.unlockAudio(), 5000)
})

onUnmounted(() => {
  document.documentElement.classList.remove('tv-mode')
  document.body.style.overflow = ''
  clock.stop()
  if (modeSwitchTimer) clearTimeout(modeSwitchTimer)
  if (refreshTimer)    clearInterval(refreshTimer)
  iqomah.stopMonitoring()
})
</script>
