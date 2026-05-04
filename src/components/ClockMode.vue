<template>
  <!--
    TV Clock Layout (landscape, 16:9):
    ┌────────────────────────────────────────────────┐
    │ Header: Logo | Mosque name          Date       │  ~12%
    ├────────────────────────────────────────────────┤
    │             HH:MM  :SS (top-right)             │  ~52%
    │          Tanggal Masehi / Hijriyah             │
    ├────────────────────────────────────────────────┤
    │  📢 Announcement (fade)                        │  ~11%
    ├────────────────────────────────────────────────┤
    │  Subuh  Syuruq  Dzuhur  Ashar  Maghrib  Isya  │  ~25%
    └────────────────────────────────────────────────┘
  -->
  <div
    class="clock-mode w-full h-full flex flex-col arabesque-bg overflow-hidden"
    style="background: linear-gradient(160deg, #0D2218 0%, #0B1E17 50%, #091A13 100%);"
  >

    <!-- ── ROW 1: Header ── -->
    <HeaderMasjid
      :mosque-name-display="settings.mosque_name || 'Masjid Al-Ikhlas'"
      :subtitle="settings.mosque_subtitle"
      :logo-url="settings.mosque_logo"
      :date-string="dateString"
      :hijri-string="hijriString"
    />

    <!-- top divider -->
    <div class="divider-green mx-6"></div>

    <!-- ── ROW 2: Big Clock + Dates ── -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 pb-2">
      <!-- Clock -->
      <ClockDisplay :hours="hours" :minutes="minutes" :seconds="seconds" />

      <!-- Waktu Shalat Berikutnya & Countdown -->
      <div class="mt-4 px-6 py-2 rounded-full border flex items-center justify-center gap-3"
           style="background: rgba(24, 51, 34, 0.4); border-color: rgba(82, 183, 136, 0.2); backdrop-filter: blur(8px);">
        <p
          class="font-display font-bold tracking-widest uppercase"
          style="font-size: clamp(0.75rem, 1.2vw, 1rem); color: #95D5B2;"
        >Waktu Shalat Berikutnya: <span style="color: #FFFFFF;">{{ nextPrayerName }}</span></p>
        <p
          class="font-digital font-bold tabular-nums"
          style="font-size: clamp(1.4rem, 2.5vw, 2.2rem); color: #D4AF37; line-height: 1;"
        >-{{ nextPrayerCountdown }}</p>
      </div>
    </div>

    <!-- ── ROW 3: Announcement Banner ── -->
    <AnnouncementBanner
      v-if="announcements.length > 0"
      :items="announcements"
      :interval="announcementInterval"
    />

    <!-- bottom divider -->
    <div class="divider-green mx-6 mt-2"></div>

    <!-- ── ROW 4: Prayer Times Bar ── -->
    <PrayerTimesBar
      :prayer-list="prayerList"
      :next-prayer-key="nextPrayer ? nextPrayer.prayer : null"
      :now="now"
    />

    <!-- status strip -->
    <div class="flex items-center justify-between px-6 pb-2 pt-1">
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span>
        <span style="font-size:0.65rem; color:#6AAF8A;" class="font-body">LIVE</span>
      </div>
      <span style="font-size:0.65rem; color:#6AAF8A;" class="font-body">Kota Solo, Jawa Tengah</span>
    </div>
  </div>
</template>

<script setup>
import HeaderMasjid       from './HeaderMasjid.vue'
import ClockDisplay       from './ClockDisplay.vue'
import PrayerTimesBar     from './PrayerTimesBar.vue'
import AnnouncementBanner from './AnnouncementBanner.vue'
import { computed }       from 'vue'

const props = defineProps({
  hours:               { type: String, default: '00' },
  minutes:             { type: String, default: '00' },
  seconds:             { type: String, default: '00' },
  dateString:          { type: String, default: '' },
  hijriString:         { type: String, default: '' },
  now:                 { type: Date,   default: () => new Date() },
  settings:            { type: Object, default: () => ({}) },
  prayerList:          { type: Array,  default: () => [] },
  nextPrayer:          { type: Object, default: null },
  prayerLoading:       { type: Boolean,default: false },
  announcements:       { type: Array,  default: () => [] },
  announcementInterval:{ type: Number, default: 12000 },
})

const nextPrayerName = computed(() => {
  if (!props.nextPrayer) return ''
  const names = { subuh: 'Subuh', syuruq: 'Syuruq', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' }
  return names[props.nextPrayer.prayer] || props.nextPrayer.prayer
})

const nextPrayerCountdown = computed(() => {
  if (!props.nextPrayer || !props.now) return '00:00:00'
  const [h, m] = props.nextPrayer.time.split(':').map(Number)
  let targetTime = new Date(props.now)
  targetTime.setHours(h, m, 0, 0)
  
  if (targetTime < props.now) {
    targetTime.setDate(targetTime.getDate() + 1)
  }
  
  const diff = targetTime - props.now
  if (diff <= 0) return '00:00:00'
  
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})
</script>
