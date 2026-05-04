<template>
  <div class="footer-text w-full overflow-hidden whitespace-nowrap bg-[#0B1E17]/95 border-t border-[#52B788]/30 py-3 px-8 relative flex items-center shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
    <!-- Icon/Label Left -->
    <div class="flex-shrink-0 z-10 bg-[#0B1E17] pr-6 flex items-center gap-3">
      <span class="text-gold text-2xl">📢</span>
      <span class="font-display font-bold text-[#95D5B2] text-sm tracking-widest uppercase">INFO MASJID</span>
    </div>
    
    <!-- Scrolling / Fading Text -->
    <div class="flex-1 overflow-hidden relative h-7">
      <Transition name="ann" mode="out-in">
        <p :key="currentIndex" class="font-body text-white font-medium absolute inset-0 flex items-center justify-center text-lg">
          {{ currentText }}
        </p>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  interval: { type: Number, default: 12000 }
})

const currentIndex = ref(0)
let timer = null
const currentText = computed(() => props.items[currentIndex.value]?.text || '')

function start() {
  if (timer) clearInterval(timer)
  if (props.items.length > 1) {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.items.length
    }, props.interval)
  }
}

watch(() => props.items, () => { currentIndex.value = 0; start() }, { deep: true, immediate: true })
onMounted(start)
onUnmounted(() => { if(timer) clearInterval(timer) })
</script>
