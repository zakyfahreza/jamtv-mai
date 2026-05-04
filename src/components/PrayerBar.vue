<template>
  <div class="prayer-bar flex items-center justify-between gap-4 px-6 py-4 w-full">
    <div 
      v-for="prayer in prayerList" 
      :key="prayer.key"
      class="flex-1 flex flex-col items-center justify-center rounded-2xl py-3 border transition-all duration-500"
      :class="[
        nextPrayerKey === prayer.key 
          ? 'bg-gold/15 border-gold/60 shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-[1.02]' 
          : 'bg-white/5 border-white/10 opacity-80'
      ]"
    >
      <span 
        class="font-display font-bold uppercase tracking-widest text-sm mb-1" 
        :style="{ color: nextPrayerKey === prayer.key ? '#D4AF37' : '#95D5B2' }"
      >
        {{ prayer.name }}
      </span>
      <span 
        class="font-digital font-bold tabular-nums text-5xl mt-1" 
        :style="{ color: nextPrayerKey === prayer.key ? '#D4AF37' : '#FFFFFF' }"
      >
        {{ prayer.time }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  prayerList: { type: Array, default: () => [] },
  nextPrayerKey: { type: String, default: null }
})
</script>
