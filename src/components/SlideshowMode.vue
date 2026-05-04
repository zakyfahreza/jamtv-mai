<template>
  <div class="slideshow-mode w-full h-screen relative overflow-hidden" style="background-color: #000000 !important; z-index: 10;">
    <!-- No slides fallback -->
    <div
      v-if="!slides.length"
      class="w-full h-full flex flex-col items-center justify-center"
    >
      <div class="text-6xl mb-4">🕌</div>
      <p class="font-display text-masjid-muted text-xl">Belum ada slide</p>
      <p class="font-body text-masjid-muted text-sm mt-2">Tambahkan slide melalui Admin Panel</p>
    </div>

    <!-- Slides -->
    <Transition name="slide-fade" mode="out-in">
      <div
        v-if="currentSlide"
        :key="currentIndex"
        class="w-full h-full relative"
      >
        <!-- Background image -->
        <img
          :src="currentSlide.image_url"
          :alt="currentSlide.title || ''"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />

        <!-- Overlay gradient -->
        <div class="absolute inset-0"
          style="background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)">
        </div>

        <!-- Slide info overlay -->
        <div v-if="currentSlide.title" class="absolute bottom-0 left-0 right-0 p-8 tv-safe">
          <h2 class="font-display text-2xl font-semibold text-white" style="text-shadow: 0 2px 10px rgba(0,0,0,0.8)">
            {{ currentSlide.title }}
          </h2>
        </div>

        <!-- Mosque name watermark -->
        <div class="absolute top-6 right-8 flex items-center gap-2 opacity-70">
          <span class="text-gold text-sm">☪</span>
          <span class="font-display text-white text-sm font-semibold">{{ mosqueNameWatermark }}</span>
        </div>
      </div>
    </Transition>

    <!-- Progress dots -->
    <div v-if="slides.length > 1"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      <div
        v-for="(_, i) in slides"
        :key="i"
        class="h-1.5 rounded-full transition-all duration-500 cursor-none"
        :class="i === currentIndex ? 'bg-gold w-6' : 'bg-white/40 w-1.5'"
      ></div>
    </div>

    <!-- Progress bar -->
    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-10">
      <div
        class="h-full bg-gold transition-none"
        :style="{ width: progressWidth + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  slides: { type: Array, default: () => [] },
  mosqueNameWatermark: { type: String, default: 'Masjid' }
})

const emit = defineEmits(['slide-change'])

const currentIndex = ref(0)
const progressWidth = ref(0)
let timer = null
let progressTimer = null
let progressInterval = null

const currentSlide = computed(() => {
  if (!props.slides.length) return null
  return props.slides[currentIndex.value]
})

const slideDuration = computed(() => {
  const dur = currentSlide.value?.duration || 8
  return dur * 1000
})

function nextSlide() {
  if (!props.slides.length) return
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
  emit('slide-change', currentIndex.value)
  resetProgress()
}

function resetProgress() {
  progressWidth.value = 0
  if (progressInterval) clearInterval(progressInterval)

  const duration = currentSlide.value?.duration || 8
  const step = 100 / (duration * 20) // update 20x per second
  progressInterval = setInterval(() => {
    progressWidth.value = Math.min(progressWidth.value + step, 100)
  }, 50)
}

function startAutoPlay() {
  stopAutoPlay()
  const duration = currentSlide.value?.duration || 8
  timer = setTimeout(() => {
    nextSlide()
    startAutoPlay()
  }, duration * 1000)
  resetProgress()
}

function stopAutoPlay() {
  if (timer) { clearTimeout(timer); timer = null }
  if (progressInterval) { clearInterval(progressInterval); progressInterval = null }
}

function handleImageError(e) {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMUExQTFBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNDQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2FtYmFyIHRpZGFrIHRlcnNlZGlhPC90ZXh0Pjwvc3ZnPg=='
}

watch(() => props.slides, (newSlides) => {
  if (newSlides.length > 0) {
    currentIndex.value = 0
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}, { deep: true })

onMounted(() => {
  if (props.slides.length > 0) {
    startAutoPlay()
  }
})

onUnmounted(stopAutoPlay)
</script>
