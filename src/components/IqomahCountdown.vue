<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="iqomah-overlay fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style="background: radial-gradient(ellipse at center, #0D2218 0%, #071410 50%, #030D09 100%);"
    >
      <!-- Arabesque bg -->
      <div class="absolute inset-0 arabesque-bg pointer-events-none opacity-60"></div>

      <!-- Decorative animated rings -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="ring r1" :class="{ urgent: isUrgent }"></div>
        <div class="ring r2" :class="{ urgent: isUrgent }"></div>
        <div class="ring r3" :class="{ urgent: isUrgent }"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center flex flex-col items-center gap-6 animate-slide-in">

        <!-- Label -->
        <p
          class="font-display uppercase tracking-widest"
          style="font-size:clamp(0.8rem,1.5vw,1.1rem); color:#6AAF8A;"
        >Menuju Iqomah</p>

        <!-- Prayer name -->
        <h2
          class="font-display font-bold uppercase tracking-wider"
          :style="{
            fontSize: 'clamp(2.2rem,5vw,4rem)',
            color: '#FFFFFF',
          }"
        >
          {{ PRAYER_NAMES[prayer] || prayer }}
        </h2>

        <!-- SVG countdown ring -->
        <div class="relative" style="width:260px; height:260px;">
          <svg class="absolute inset-0 -rotate-90" viewBox="0 0 260 260" width="260" height="260">
            <circle cx="130" cy="130" r="115"
              fill="none" stroke="rgba(82,183,136,0.08)" stroke-width="10" />
            <circle cx="130" cy="130" r="115"
              fill="none"
              :stroke="isUrgent ? '#F87171' : '#D4AF37'"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              style="transition: stroke-dashoffset 0.95s linear, stroke 0.5s ease;"
            />
          </svg>

          <!-- Inner text -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span
              class="font-digital font-bold tabular-nums"
              :class="{ 'animate-countdown-pulse': isUrgent }"
              :style="{
                fontSize: 'clamp(3.5rem,7vw,5.5rem)',
                lineHeight: '1',
                color: '#FFFFFF',
              }"
            >{{ formattedRemaining }}</span>
            <span style="font-size:0.8rem; color:#6AAF8A;" class="font-body mt-2">menit : detik</span>
          </div>
        </div>

        <!-- Arabic phrase -->
        <div class="text-center">
          <p class="font-arabic" style="font-size:clamp(1.4rem,3vw,2.2rem); color:#95D5B2; opacity:0.85;">
            اَلصَّلَاةُ خَيْرٌ مِّنَ النَّوْمِ
          </p>
          <p class="font-body mt-2" style="font-size:clamp(0.75rem,1.2vw,0.95rem); color:#6AAF8A;">
            "Sholat lebih baik daripada tidur"
          </p>
        </div>

      </div>

      <!-- Bottom hint -->
      <p
        class="absolute bottom-8 font-body text-center w-full"
        style="font-size:clamp(0.75rem,1.2vw,0.95rem); color:#6AAF8A;"
      >
        Bersiaplah untuk sholat <strong style="color:#95D5B2;">{{ PRAYER_NAMES[prayer] }}</strong> berjamaah
      </p>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show:             { type: Boolean, default: false },
  prayer:           { type: String,  default: '' },
  formattedRemaining:{ type: String, default: '00:00' },
  progressPercent:  { type: Number,  default: 0 },
  isUrgent:         { type: Boolean, default: false },
  PRAYER_NAMES:     { type: Object,  default: () => ({}) },
})

const circumference = 2 * Math.PI * 115  // ~722.6
const dashOffset = computed(() =>
  circumference * (1 - props.progressPercent / 100)
)
</script>

<style scoped>
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(82, 183, 136, 0.12);
  animation: expandRing 4s ease-out infinite;
}
.r1 { width: 380px; height: 380px; animation-delay: 0s; }
.r2 { width: 580px; height: 580px; animation-delay: 1.4s; }
.r3 { width: 780px; height: 780px; animation-delay: 2.8s; }
.ring.urgent {
  border-color: rgba(248,113,113,0.12);
}
@keyframes expandRing {
  0%   { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.2); opacity: 0; }
}
</style>
