<script setup lang="ts">
import { ref } from 'vue'
import StreamPlayer from '@/components/StreamPlayer.vue'

const videoSource = ref('http://localhost:3333/video')
</script>

<template>
  <main>
    <StreamPlayer :videoSource="videoSource" />
  </main>
</template>
