<template>
  <div class="scroll-text-container overflow-hidden h-full relative" :style="{ height: height + 'px' }">
    <!-- Gradient overlays -->
    <div class="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none"
      style="background: linear-gradient(to bottom, #111111, transparent)"></div>
    <div class="absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none"
      style="background: linear-gradient(to top, #111111, transparent)"></div>

    <!-- Scrolling content -->
    <div
      ref="scrollWrapper"
      class="scroll-wrapper flex flex-col gap-4"
      :style="{ transform: `translateY(${offsetY}px)`, transition: isTransitioning ? 'transform 0.5s linear' : 'none' }"
    >
      <div
        v-for="(item, index) in doubledItems"
        :key="`item-${index}`"
        class="scroll-item px-4 py-3 glass-card rounded-lg border border-gold/20"
      >
        <div class="flex items-start gap-3">
          <span class="text-gold mt-0.5 flex-shrink-0">📢</span>
          <p class="font-body text-masjid-text leading-relaxed text-sm">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  speed: {
    type: Number,
    default: 40 // pixels per second
  },
  height: {
    type: Number,
    default: 200
  }
})

const scrollWrapper = ref(null)
const offsetY = ref(0)
const isTransitioning = ref(false)
const itemHeight = ref(80)
let animFrame = null
let lastTime = null

const doubledItems = computed(() => {
  if (!props.items.length) return []
  return [...props.items, ...props.items]
})

function animate(timestamp) {
  if (!lastTime) lastTime = timestamp
  const delta = (timestamp - lastTime) / 1000
  lastTime = timestamp

  offsetY.value -= props.speed * delta

  // Reset when first set of items scrolled past
  if (scrollWrapper.value) {
    const totalHeight = scrollWrapper.value.scrollHeight / 2
    if (Math.abs(offsetY.value) >= totalHeight) {
      offsetY.value = 0
    }
  }

  animFrame = requestAnimationFrame(animate)
}

function startScroll() {
  if (animFrame) cancelAnimationFrame(animFrame)
  lastTime = null
  animFrame = requestAnimationFrame(animate)
}

function stopScroll() {
  if (animFrame) {
    cancelAnimationFrame(animFrame)
    animFrame = null
  }
}

watch(() => props.items, (newItems) => {
  if (newItems.length > 0) {
    offsetY.value = 0
    lastTime = null
  }
}, { deep: true })

onMounted(() => {
  if (props.items.length > 0) {
    setTimeout(startScroll, 500)
  }
})

onUnmounted(stopScroll)

defineExpose({ startScroll, stopScroll })
</script>

<style scoped>
.scroll-text-container {
  position: relative;
}

.scroll-wrapper {
  will-change: transform;
}
</style>
