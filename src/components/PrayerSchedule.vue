<template>
  <div class="prayer-schedule h-full flex flex-col gap-2">
    <!-- Title -->
    <div class="flex items-center gap-2 mb-1">
      <div class="w-1 h-5 bg-gold rounded-full"></div>
      <h3 class="font-display text-sm font-semibold text-gold uppercase tracking-widest">
        Jadwal Sholat
      </h3>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="flex gap-1">
        <div class="w-2 h-2 rounded-full bg-gold animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 rounded-full bg-gold animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 rounded-full bg-gold animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>

    <!-- Prayer list -->
    <div v-else class="flex flex-col gap-2 flex-1">
      <div
        v-for="prayer in prayerList"
        :key="prayer.key"
        class="prayer-card flex items-center justify-between"
        :class="{
          'active': activePrayer === prayer.key,
          'opacity-40': isPrayerPast(prayer) && activePrayer !== prayer.key
        }"
      >
        <!-- Prayer icon & name -->
        <div class="flex items-center gap-2">
          <span class="text-lg leading-none">{{ getPrayerEmoji(prayer.key) }}</span>
          <span
            class="font-display font-semibold text-base"
            :class="activePrayer === prayer.key ? 'text-gold' : 'text-masjid-text'"
          >
            {{ prayer.name }}
          </span>
        </div>

        <!-- Time -->
        <div class="flex items-center gap-2">
          <span
            class="font-digital text-xl font-bold tracking-wider"
            :class="activePrayer === prayer.key ? 'gold-text animate-pulse-gold' : 'text-masjid-text'"
          >
            {{ prayer.time }}
          </span>

          <!-- Active indicator -->
          <div
            v-if="activePrayer === prayer.key"
            class="flex items-center gap-1"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prayerList: {
    type: Array,
    default: () => []
  },
  activePrayer: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  now: {
    type: Date,
    default: () => new Date()
  }
})

function getPrayerEmoji(key) {
  const emojis = {
    subuh: '🌙',
    syuruq: '🌅',
    dzuhur: '☀️',
    ashar: '🌤️',
    maghrib: '🌇',
    isya: '🌃'
  }
  return emojis[key] || '🕌'
}

function isPrayerPast(prayer) {
  if (!prayer.time) return false
  const [h, m] = prayer.time.split(':').map(Number)
  const prayerMins = h * 60 + m
  const nowMins = props.now.getHours() * 60 + props.now.getMinutes()
  return nowMins > prayerMins
}
</script>
