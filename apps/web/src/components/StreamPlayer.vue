<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { Play, Pause, Pencil, PencilOff, Eraser, Pointer, PointerOff } from 'lucide-vue-next'

const { videoSource } = defineProps({
  videoSource: String,
})

const videoRef = useTemplateRef('videoRef')
const canvasRef = useTemplateRef('canvasRef')
const isVideoPlaying = ref(false)
const progress = ref(0)
const hasError = ref(false)
const isDrawing = ref(false)
const isDrawingActive = ref(false)
const isPointerActive = ref(false)

let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  const video = videoRef.value

  if (!video) return

  video.addEventListener('play', handlePlay)
  video.addEventListener('pause', handlePause)
  video.addEventListener('timeupdate', handleProgress)

  const canvas = canvasRef.value

  if (!canvas) return

  video.addEventListener('loadedmetadata', setupCanvas)
})

onUnmounted(() => {
  const video = videoRef.value

  if (!video) return

  video.removeEventListener('play', handlePlay)
  video.removeEventListener('pause', handlePause)
  video.removeEventListener('timeupdate', handleProgress)

  const canvas = canvasRef.value

  if (!canvas) return

  video.removeEventListener('loadedmetadata', setupCanvas)
})

function handlePlay() {
  isVideoPlaying.value = true
}

function handlePause() {
  isVideoPlaying.value = false
}

function togglePlay() {
  const video = videoRef.value

  hasError.value = false

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

function updateProgress(event: Event) {
  const video = videoRef.value

  if (!video) return

  const target = event.target as HTMLInputElement
  video.currentTime = (Number(target.value) / 10000) * video.duration
}

function setupCanvas() {
  const video = videoRef.value
  const canvas = canvasRef.value

  if (!video || !canvas) return

  canvas.width = video.clientWidth
  canvas.height = video.clientHeight

  ctx = canvas.getContext('2d')
}

function startDrawing(event: MouseEvent) {
  if (!ctx) return

  isDrawing.value = true
  ctx.beginPath()
  ctx.moveTo(event.offsetX, event.offsetY)
}

function draw(event: MouseEvent) {
  if (!isDrawing.value || !ctx) return

  ctx.lineTo(event.offsetX, event.offsetY)
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 3
  ctx.stroke()
}

function stopDrawing() {
  isDrawing.value = false
}

function clearCanvas() {
  const canvas = canvasRef.value
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function pointer(event: MouseEvent) {
  const canvas = canvasRef.value

  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.beginPath()
  ctx.arc(event.offsetX, event.offsetY, 16, 0, Math.PI * 2)

  const gradient = ctx.createRadialGradient(
    event.offsetX,
    event.offsetY,
    0,
    event.offsetX,
    event.offsetY,
    16,
  )
  gradient.addColorStop(0, 'rgba(255, 0, 0, 1)')
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fill()
}

function toggleDrawing() {
  isDrawingActive.value = !isDrawingActive.value
  isPointerActive.value = false
  removePointerSetup()

  isDrawingActive.value ? addDrawingSetup() : removeDrawingSetup()
}

function togglePointer() {
  isPointerActive.value = !isPointerActive.value
  isDrawingActive.value = false
  removeDrawingSetup()

  isPointerActive.value ? addPointerSetup() : removePointerSetup()
}

function addDrawingSetup() {
  const canvas = canvasRef.value

  if (!canvas) return

  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseleave', stopDrawing)
}

function removeDrawingSetup() {
  const canvas = canvasRef.value

  if (!canvas) return

  canvas.removeEventListener('mousedown', startDrawing)
  canvas.removeEventListener('mouseup', stopDrawing)
  canvas.removeEventListener('mousemove', draw)
  canvas.removeEventListener('mouseleave', stopDrawing)
}

function addPointerSetup() {
  const canvas = canvasRef.value

  if (!canvas) return

  canvas.addEventListener('mousemove', pointer)
}

function removePointerSetup() {
  const canvas = canvasRef.value

  if (!canvas) return

  canvas.removeEventListener('mousemove', pointer)
  clearCanvas()
}
</script>

<template>
  <div class="relative">
    <video ref="videoRef" class="block w-full rounded-t-md bg-black">
      <source :src="videoSource" type="video/mp4" />
      Your browser doesn't support HTML video.
    </video>

    <canvas
      ref="canvasRef"
      :class="{ 'cursor-crosshair': isDrawingActive, 'cursor-none': isPointerActive }"
      class="absolute top-0 left-0 h-full w-full rounded-t-md"
    ></canvas>
  </div>
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
      class="mx-4 w-full accent-white"
      @input="updateProgress"
    />
    <button
      @click="toggleDrawing"
      class="rounded-md px-2 py-1 text-neutral-50 hover:bg-neutral-900"
    >
      <PencilOff v-if="isDrawingActive" stroke-width="2" :size="24" />
      <Pencil v-else stroke-width="2" :size="24" />
    </button>
    <button
      @click="togglePointer"
      class="rounded-md px-2 py-1 text-neutral-50 hover:bg-neutral-900"
    >
      <PointerOff v-if="isPointerActive" stroke-width="2" :size="24" />
      <Pointer v-else stroke-width="2" :size="24" />
    </button>
    <button @click="clearCanvas" class="rounded-md px-2 py-1 text-neutral-50 hover:bg-neutral-900">
      <Eraser stroke-width="2" :size="24" />
    </button>
  </div>
</template>
