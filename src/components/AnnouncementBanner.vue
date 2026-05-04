<template>
  <div
    v-if="items.length > 0"
    class="announcement-banner w-full px-6 py-2"
  >
    <div
      class="rounded-xl px-5 py-3 flex items-center gap-4"
      style="
        background: rgba(11,30,23,0.75);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(82,183,136,0.2);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      "
    >
      <!-- Icon -->
      <span
        class="flex-shrink-0 text-xl"
        style="color: #D4AF37;"
      >📢</span>

      <!-- Announcement text with fade transition -->
      <Transition name="ann" mode="out-in">
        <p
          :key="currentIndex"
          class="font-body font-medium flex-1 leading-snug text-center"
          style="
            font-size: clamp(0.85rem, 1.6vw, 1.15rem);
            color: #E8F5EE;
          "
        >
          {{ currentText }}
        </p>
      </Transition>

      <!-- Dots indicator -->
      <div v-if="items.length > 1" class="flex gap-1.5 flex-shrink-0">
        <span
          v-for="(_, i) in items"
          :key="i"
          class="rounded-full transition-all duration-500"
          :style="{
            width:   i === currentIndex ? '16px' : '6px',
            height:  '6px',
            background: i === currentIndex ? '#D4AF37' : 'rgba(82,183,136,0.35)',
          }"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items:    { type: Array,  default: () => [] },
  interval: { type: Number, default: 12000 },  // ms per announcement
})

const currentIndex = ref(0)
let timer = null

const currentText = computed(() =>
  props.items[currentIndex.value]?.text || ''
)

function advance() {
  if (!props.items.length) return
  currentIndex.value = (currentIndex.value + 1) % props.items.length
}

function start() {
  stop()
  if (props.items.length > 1) {
    timer = setInterval(advance, props.interval)
  }
}

function stop() {
  if (timer) { clearInterval(timer); timer = null }
}

watch(() => props.items, (v) => {
  currentIndex.value = 0
  start()
}, { deep: true, immediate: true })

onMounted(start)
onUnmounted(stop)
</script>
