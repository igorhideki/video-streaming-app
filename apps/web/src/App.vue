<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Sun, Moon } from 'lucide-vue-next'

const isDarkMode = ref(false)

onMounted(() => {
  isDarkMode.value = localStorage.getItem('theme') === 'dark'

  updateTheme()
})

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')

  updateTheme()
}

function updateTheme() {
  isDarkMode.value
    ? document.documentElement.classList.add('dark')
    : document.documentElement.classList.remove('dark')
}
</script>

<template>
  <div
    class="h-screen bg-neutral-200 text-neutral-900 duration-500 ease-in-out dark:bg-neutral-800 dark:text-neutral-300"
  >
    <div class="mx-auto max-w-4xl p-4">
      <header class="mb-4">
        <nav class="flex justify-between py-4 font-bold">
          <div class="flex gap-4">
            <RouterLink to="/" class="hover:text-neutral-700 dark:hover:text-neutral-400"
              >Home</RouterLink
            >
            <RouterLink to="/about" class="hover:text-neutral-700 dark:hover:text-neutral-400"
              >About</RouterLink
            >
          </div>
          <button @click="toggleTheme" class="hover:text-neutral-700 dark:hover:text-neutral-400">
            <Sun v-if="isDarkMode" />
            <Moon v-else />
          </button>
        </nav>
      </header>

      <RouterView />
    </div>
  </div>
</template>
