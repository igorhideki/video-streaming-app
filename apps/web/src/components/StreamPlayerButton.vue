<script setup lang="ts">
import type { FunctionalComponent } from 'vue'

const props = defineProps<{
  isActive?: boolean
  icon: FunctionalComponent
  onClick: () => void
}>()
</script>

<template>
  <button
    @click="onClick"
    class="rounded-md px-2 py-1 text-neutral-50 hover:bg-neutral-900"
    :class="{ 'bg-neutral-800': isActive }"
  >
    <component :is="icon" stroke-width="2" :size="24" />
  </button>
</template>
