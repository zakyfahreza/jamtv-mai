<template>
  <div 
    class="display-slideshow w-full h-full flex flex-col arabesque-bg overflow-hidden relative"
    style="background: linear-gradient(160deg, #0D2218 0%, #0B1E17 50%, #091A13 100%);"
  >

    <!-- 1. HEADER (Top Center) -->
    <div class="relative z-10 pt-1 transform origin-top scale-90">
      <HeaderMasjid 
        :mosque-name-display="settings.mosque_name || 'Masjid Al-Ikhlas'"
        :subtitle="settings.mosque_subtitle"
        :logo-url="settings.mosque_logo"
        :date-string="dateString"
        :hijri-string="hijriString"
      />
    </div>

    <!-- top divider -->
    <div class="divider-green mx-6 relative z-10"></div>

    <!-- 2 & 3. MAIN BODY (Split Left/Right) -->
    <div class="flex-1 flex flex-row px-8 pb-2 gap-12 relative z-10 overflow-hidden">
      
      <!-- LEFT: Info Panel -->
      <div class="w-[38%] flex flex-col justify-center items-center">

        <!-- Main Clock -->
        <MainClock :hours="hours" :minutes="minutes" :seconds="seconds" />

        <!-- Next Prayer Box -->
        <NextPrayerCard :prayer-name="nextPrayerName" :countdown="nextPrayerCountdown" />

      </div>

      <!-- RIGHT: Slideshow -->
      <div class="w-[62%] h-full py-1 flex flex-col justify-center">
        <SlideshowPanel :slides="slides" />
      </div>

    </div>

    <!-- bottom divider -->
    <div class="divider-green mx-6 mt-1 relative z-10"></div>

    <!-- 4. PRAYER TIMES BAR (Bottom) -->
    <div class="relative z-10 px-4 pb-4">
      <PrayerTimesBar 
        :prayer-list="prayerList" 
        :next-prayer-key="nextPrayer?.prayer" 
        :now="now" 
      />
    </div>

    <!-- 5. FOOTER ANNOUNCEMENTS -->
    <div class="relative z-20">
      <FooterText :items="announcements" :interval="announcementInterval" />
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import HeaderMasjid from '@/components/HeaderMasjid.vue'
import MainClock from '@/components/MainClock.vue'
import NextPrayerCard from '@/components/NextPrayerCard.vue'
import SlideshowPanel from '@/components/SlideshowPanel.vue'
import PrayerTimesBar from '@/components/PrayerTimesBar.vue'
import FooterText from '@/components/FooterText.vue'

const props = defineProps({
  hours: { type: String, default: '00' },
  minutes: { type: String, default: '00' },
  seconds: { type: String, default: '00' },
  dateString: { type: String, default: '' },
  hijriString: { type: String, default: '' },
  now: { type: Object, default: () => new Date() },
  settings: { type: Object, default: () => ({}) },
  prayerList: { type: Array, default: () => [] },
  nextPrayer: { type: Object, default: null },
  announcements: { type: Array, default: () => [] },
  announcementInterval: { type: Number, default: 12000 },
  slides: { type: Array, default: () => [] }
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
