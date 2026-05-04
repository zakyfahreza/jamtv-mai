<template>
  <div class="next-prayer-card w-full glass-card rounded-xl p-3 mt-2 flex flex-col items-center justify-center border-l-4" style="border-left-color: #D4AF37;">
    <p class="font-display font-bold uppercase tracking-widest text-masjid-muted text-[10px] md:text-xs mb-0.5">
      Waktu Shalat Berikutnya
    </p>
    <p class="font-display font-bold uppercase text-white" style="font-size: clamp(1rem, 1.8vw, 1.4rem); text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
      {{ prayerName }}
    </p>
    <p class="font-digital font-bold tabular-nums text-gold mt-0.5" style="font-size: clamp(1.5rem, 2.5vw, 2rem); line-height: 1;">
      -{{ countdown }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  prayerName: { type: String, default: '' },
  countdown: { type: String, default: '00:00:00' }
})
</script>
