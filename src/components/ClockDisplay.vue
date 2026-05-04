<template>
  <div class="clock-display-wrap flex flex-col items-center justify-center flex-1 select-none">
    <!-- Main time: HH:MM with seconds top-right -->
    <div class="relative inline-flex items-start">
      <!-- HH:MM -->
      <span
        class="font-digital font-bold tabular-nums animate-breathe"
        style="
          font-size: clamp(7rem, 18vw, 16rem);
          line-height: 1;
          color: #FFFFFF;
          letter-spacing: 0.04em;
        "
      >{{ hours }}:{{ minutes }}</span>

      <!-- Seconds — top-right corner of the clock -->
      <span
        class="font-digital font-normal tabular-nums absolute -right-20 top-2"
        style="
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          color: #FFFFFF;
          line-height: 1;
          letter-spacing: 0.04em;
        "
      >:{{ seconds }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hours:   { type: String, default: '00' },
  minutes: { type: String, default: '00' },
  seconds: { type: String, default: '00' },
})
</script>
