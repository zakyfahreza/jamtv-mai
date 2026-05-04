<template>
  <div class="main-clock flex items-start justify-center py-4">
    <div class="flex items-baseline">
      <span 
        class="font-digital font-bold tabular-nums tracking-tight relative" 
        style="font-size: clamp(5rem, 12vw, 9rem); color: #FFFFFF; line-height: 1; text-shadow: 0 4px 20px rgba(0,0,0,0.5);"
      >
        {{ hours }}:{{ minutes }}
        <span 
          class="font-digital font-normal tabular-nums absolute -right-12 top-2" 
          style="font-size: clamp(1.2rem, 2.5vw, 2.2rem); color: #FFFFFF; line-height: 1; letter-spacing: 0.04em; text-shadow: none;"
        >:{{ seconds }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hours: { type: String, default: '00' },
  minutes: { type: String, default: '00' },
  seconds: { type: String, default: '00' }
})
</script>
