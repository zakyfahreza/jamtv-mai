import { ref, onUnmounted } from 'vue'

/**
 * Audio management composable
 * Handles adzan, beep, and iqomah audio playback
 */
export function useAudio() {
  const audioInstances = ref({})
  const isPlaying = ref(false)
  let currentAudio = null

  function createAudio(url) {
    const audio = new Audio(url)
    audio.preload = 'auto'
    return audio
  }

  function preloadAudios(audioFiles) {
    Object.entries(audioFiles).forEach(([type, url]) => {
      if (url) {
        audioInstances.value[type] = createAudio(url)
      }
    })
  }

  async function play(type) {
    const audio = audioInstances.value[type]
    if (!audio) return

    try {
      if (currentAudio && !currentAudio.paused) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }

      audio.currentTime = 0
      currentAudio = audio
      isPlaying.value = true

      await audio.play()
      audio.onended = () => {
        isPlaying.value = false
        currentAudio = null
      }
    } catch (err) {
      console.warn('Audio play failed (autoplay policy):', err)
      isPlaying.value = false
    }
  }

  function stop() {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio = null
    }
    isPlaying.value = false
  }

  function stopAll() {
    Object.values(audioInstances.value).forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
    isPlaying.value = false
    currentAudio = null
  }

  /**
   * Unlock audio context on first user interaction (TV autoplay workaround)
   */
  function unlockAudio() {
    const silentAudio = new Audio()
    silentAudio.src = 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAA'
    silentAudio.play().catch(() => {})
  }

  onUnmounted(stopAll)

  return {
    audioInstances,
    isPlaying,
    preloadAudios,
    play,
    stop,
    stopAll,
    unlockAudio
  }
}
