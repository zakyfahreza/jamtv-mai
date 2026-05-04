<template>
  <div class="slideshow-panel w-full h-full rounded-[2rem] overflow-hidden relative border border-white/10" style="background: #000;">
    <!-- No slides -->
    <div v-if="!slides.length" class="w-full h-full flex flex-col items-center justify-center bg-[#091A13]">
      <div class="text-6xl mb-4 opacity-50">🕌</div>
      <p class="font-display text-masjid-muted text-xl">Belum ada slide</p>
    </div>

    <!-- Slides -->
    <Transition name="slide-fade" mode="out-in">
      <div v-if="currentSlide" :key="currentIndex" class="w-full h-full relative">
        <img :src="currentSlide.image_url" class="w-full h-full object-cover" @error="handleError" />
        
        <!-- Title -->
        <div v-if="currentSlide.title" class="absolute bottom-8 left-8 right-8">
          <h2 class="font-display font-semibold text-white text-3xl tracking-wide" style="text-shadow: 0 2px 15px rgba(0,0,0,0.9);">
            {{ currentSlide.title }}
          </h2>
        </div>
      </div>
    </Transition>

    <!-- Dots Indicator -->
    <div v-if="slides.length > 1" class="absolute top-6 right-6 flex gap-2 z-10 bg-black/20 px-3 py-2 rounded-full backdrop-blur-sm">
      <div 
        v-for="(_, i) in slides" 
        :key="i" 
        class="h-2 rounded-full transition-all duration-500" 
        :class="i === currentIndex ? 'bg-gold w-8 shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'bg-white/40 w-2'"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  slides: { type: Array, default: () => [] }
})

const currentIndex = ref(0)
let timer = null

const currentSlide = computed(() => {
  if (!props.slides.length) return null
  return props.slides[currentIndex.value]
})

function nextSlide() {
  if (!props.slides.length) return
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
}

function startAutoPlay() {
  stopAutoPlay()
  const duration = currentSlide.value?.duration || 8
  timer = setTimeout(() => {
    nextSlide()
    startAutoPlay()
  }, duration * 1000)
}

function stopAutoPlay() {
  if (timer) { clearTimeout(timer); timer = null }
}

function handleError(e) {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMUExQTFBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNDQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2FtYmFyIHRpZGFrIHRlcnNlZGlhPC90ZXh0Pjwvc3ZnPg=='
}

watch(() => props.slides, (n) => {
  if (n.length > 0) { currentIndex.value = 0; startAutoPlay() }
  else stopAutoPlay()
}, { deep: true })

onMounted(() => { if (props.slides.length > 0) startAutoPlay() })
onUnmounted(stopAutoPlay)
</script>
