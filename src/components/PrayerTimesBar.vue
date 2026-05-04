<template>
  <div class="prayer-times-bar w-full px-6 py-3">
    <!-- Section label -->
    <div class="flex items-center gap-2 mb-3">
      <div class="divider-green flex-1"></div>
      <span
        class="font-display text-xs uppercase tracking-widest px-3"
        style="color: #6AAF8A;"
      >Jadwal Sholat</span>
      <div class="divider-green flex-1"></div>
    </div>

    <!-- Prayer pills — horizontal -->
    <div class="flex items-stretch justify-around gap-2">
      <div
        v-for="prayer in prayerList"
        :key="prayer.key"
        class="prayer-pill flex-1"
        :class="{
          'active': nextPrayerKey === prayer.key,
          'past': isPast(prayer) && nextPrayerKey !== prayer.key
        }"
      >
        <!-- Prayer name -->
        <span
          class="font-display font-bold uppercase tracking-wider mb-1"
          :style="{
            fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
            color: nextPrayerKey === prayer.key ? '#D4AF37' : '#95D5B2'
          }"
        >{{ prayer.name }}</span>

        <!-- Time -->
        <span
          class="font-digital font-bold tabular-nums"
          :style="{
            fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
            color: nextPrayerKey === prayer.key ? '#D4AF37' : '#FFFFFF',
            textShadow: nextPrayerKey === prayer.key ? '0 0 15px rgba(212,175,55,0.6)' : 'none'
          }"
        >{{ prayer.time }}</span>


      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  prayerList:    { type: Array,  default: () => [] },
  nextPrayerKey: { type: String, default: null },
  now:           { type: Date,   default: () => new Date() },
})
function isPast(prayer) {
  if (!prayer.time) return false
  const [h, m] = prayer.time.split(':').map(Number)
  const pmin = h * 60 + m
  const now  = props.now.getHours() * 60 + props.now.getMinutes()
  return now > pmin
}
</script>
