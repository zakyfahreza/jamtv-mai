<template>
  <header 
    class="w-full px-8 py-4 flex"
    :class="align === 'center' ? 'flex-col items-center justify-center text-center gap-2' : 'items-center justify-between'"
  >
    <!-- LEFT / CENTER: Logo + Mosque Name -->
    <div 
      class="flex gap-4"
      :class="align === 'center' ? 'flex-col items-center' : 'items-center'"
    >


      <!-- Name -->
      <div :class="align === 'center' ? 'text-center' : 'text-left'">
        <h1
          class="font-display font-bold leading-tight"
          style="font-size: clamp(1.2rem, 2.2vw, 1.8rem); color: #95D5B2;"
        >
          {{ mosqueNameDisplay }}
        </h1>
      </div>
    </div>

    <!-- RIGHT: Date info -->
    <div v-if="align !== 'center'" class="text-right">
      <p
        class="font-display font-bold"
        style="font-size: clamp(1.1rem, 2vw, 1.5rem); color: #E8F5EE;"
      >
        {{ dateString }}
      </p>
      <p
        class="font-display font-bold mt-0.5"
        style="font-size: clamp(1rem, 1.8vw, 1.3rem); color: #D4AF37;"
      >
        {{ hijriString }}
      </p>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  mosqueNameDisplay: { type: String, default: 'Masjid Al-Ikhlas' },
  subtitle:          { type: String, default: '' },
  logoUrl:           { type: String, default: '' },
  dateString:        { type: String, default: '' },
  hijriString:       { type: String, default: '' },
  align:             { type: String, default: 'left' },
})
</script>
