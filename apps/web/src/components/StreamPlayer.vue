<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { Play, Pause, Pencil, PencilOff, Eraser, Pointer, PointerOff } from 'lucide-vue-next'
import StreamPlayerButton from './StreamPlayerButton.vue'

const { videoSource } = defineProps<{
  videoSource: string
}>()

const videoRef = useTemplateRef('videoRef')
const canvasRef = useTemplateRef('canvasRef')
const isVideoPlaying = ref(false)
const progress = ref(0)
const isDrawing = ref(false)
const isDrawingActive = ref(false)
const isPointerActive = ref(false)

let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  setupCanvas()
  window.addEventListener('resize', updateCanvasSize)
  videoRef.value?.addEventListener('play', handlePlay)
  videoRef.value?.addEventListener('pause', handlePause)
  videoRef.value?.addEventListener('timeupdate', handleProgress)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
  videoRef.value?.removeEventListener('play', handlePlay)
  videoRef.value?.removeEventListener('pause', handlePause)
  videoRef.value?.removeEventListener('timeupdate', handleProgress)
})

function handlePlay() {
  isVideoPlaying.value = true
}

function handlePause() {
  isVideoPlaying.value = false
}

function togglePlay() {
  isVideoPlaying.value ? videoRef.value?.pause() : videoRef.value?.play()
}

function handleProgress() {
  if (!videoRef.value) return

  progress.value = (videoRef.value.currentTime / videoRef.value.duration) * 10000
}

function updateProgress(event: Event) {
  if (!videoRef.value) return

  const target = event.target as HTMLInputElement

  videoRef.value.currentTime = (Number(target.value) / 10000) * videoRef.value.duration
}

function setupCanvas() {
  if (!videoRef.value || !canvasRef.value) return

  canvasRef.value.width = videoRef.value.clientWidth
  canvasRef.value.height = videoRef.value.clientHeight
  ctx = canvasRef.value.getContext('2d')
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
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

function pointer(event: MouseEvent) {
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
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
  canvasRef.value?.addEventListener('mousedown', startDrawing)
  canvasRef.value?.addEventListener('mouseup', stopDrawing)
  canvasRef.value?.addEventListener('mousemove', draw)
  canvasRef.value?.addEventListener('mouseleave', stopDrawing)
}

function removeDrawingSetup() {
  canvasRef.value?.removeEventListener('mousedown', startDrawing)
  canvasRef.value?.removeEventListener('mouseup', stopDrawing)
  canvasRef.value?.removeEventListener('mousemove', draw)
  canvasRef.value?.removeEventListener('mouseleave', stopDrawing)
}

function addPointerSetup() {
  canvasRef.value?.addEventListener('mousemove', pointer)
}

function removePointerSetup() {
  canvasRef.value?.removeEventListener('mousemove', pointer)
  clearCanvas()
}

function updateCanvasSize() {
  if (!canvasRef.value) return

  canvasRef.value.width = videoRef.value?.clientWidth ?? 0
  canvasRef.value.height = videoRef.value?.clientHeight ?? 0
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
      class="absolute top-0 left-0 h-full w-full rounded-t-md"
      :class="{ 'cursor-crosshair': isDrawingActive, 'cursor-none': isPointerActive }"
    ></canvas>
  </div>
  <div
    class="flex items-center justify-center gap-2 rounded-b-sm bg-neutral-950 p-2 text-neutral-50"
  >
    <StreamPlayerButton
      @click="togglePlay"
      :icon="isVideoPlaying ? Pause : Play"
      :isActive="isVideoPlaying"
    />

    <input
      type="range"
      min="0"
      max="10000"
      v-model="progress"
      class="mx-4 w-full accent-white"
      @input="updateProgress"
    />

    <StreamPlayerButton
      @click="toggleDrawing"
      :icon="isDrawingActive ? PencilOff : Pencil"
      :isActive="isDrawingActive"
    />

    <StreamPlayerButton
      @click="togglePointer"
      :icon="isPointerActive ? PointerOff : Pointer"
      :isActive="isPointerActive"
    />

    <StreamPlayerButton @click="clearCanvas" :icon="Eraser" />
  </div>
</template>
