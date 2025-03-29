<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { Play, Pause } from 'lucide-vue-next'

const videoRef = useTemplateRef('videoRef')
const isVideoPlaying = ref(false)
const videoSource = 'http://localhost:3333/video'
const progress = ref(0)

onMounted(() => {
  const video = videoRef.value

  if (!video) return

  video.addEventListener('play', handlePlay)
  video.addEventListener('pause', handlePause)
  video.addEventListener('timeupdate', handleProgress)
})

onUnmounted(() => {
  const video = videoRef.value

  if (!video) return

  video.removeEventListener('play', handlePlay)
  video.removeEventListener('pause', handlePause)
  video.removeEventListener('timeupdate', handleProgress)
})

function handlePlay() {
  isVideoPlaying.value = true
}

function handlePause() {
  isVideoPlaying.value = false
}

function togglePlay() {
  const video = videoRef.value

  if (!video) return

  if (isVideoPlaying.value) {
    video.pause()
  } else {
    video.play()
  }
}

function handleProgress() {
  const video = videoRef.value

  if (!video) return

  progress.value = (video.currentTime / video.duration) * 10000
}

function updateProgress(e: Event) {
  const video = videoRef.value

  if (!video) return

  const target = e.target as HTMLInputElement
  video.currentTime = (Number(target.value) / 10000) * video.duration
}
</script>

<template>
  <video ref="videoRef" class="block w-full rounded-t-md">
    <source :src="videoSource" type="video/mp4" />
    Your browser doesn't support HTML video.
  </video>
  <div
    class="flex items-center justify-center gap-2 rounded-b-sm bg-neutral-950 p-2 text-neutral-50"
  >
    <button @click="togglePlay" class="rounded-md px-2 py-1 text-neutral-50 hover:bg-neutral-900">
      <Pause v-if="isVideoPlaying" stroke-width="2" :size="24" />
      <Play v-else stroke-width="2" :size="24" />
    </button>
    <input
      type="range"
      min="0"
      max="10000"
      v-model="progress"
      class="w-full accent-white"
      @input="updateProgress"
    />
  </div>
  <p>{{ progress }}</p>
</template>
