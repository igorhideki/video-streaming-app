<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="h-screen bg-neutral-200 text-neutral-900">
    <div class="mx-auto max-w-3xl p-4">
      <header>
        <nav class="flex justify-between py-4">
          <div class="flex gap-4">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </div>
          <span>Theme</span>
        </nav>
      </header>

      <RouterView />
    </div>
  </div>
</template>
