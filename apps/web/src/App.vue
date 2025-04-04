<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Sun, Moon, PlayCircle } from 'lucide-vue-next'

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
    class="h-screen bg-neutral-200 text-neutral-700 duration-300 ease-in-out dark:bg-neutral-900 dark:text-neutral-400"
  >
    <div class="mx-auto max-w-4xl p-2 lg:max-w-5xl">
      <header class="mb-4">
        <nav class="flex justify-between py-4 font-bold">
          <div class="flex gap-8">
            <RouterLink to="/" class="text-green-800 duration-200 ease-in-out hover:text-green-900">
              <div class="flex">
                <PlayCircle />
                <span class="pl-1">VideoStreaming</span>
              </div>
            </RouterLink>

            <RouterLink
              to="/about"
              class="duration-200 ease-in-out hover:text-neutral-800 dark:hover:text-neutral-500"
            >
              About
            </RouterLink>
          </div>
          <button
            @click="toggleTheme"
            class="duration-200 ease-in-out hover:text-neutral-800 dark:hover:text-neutral-500"
          >
            <Sun v-if="isDarkMode" />
            <Moon v-else />
          </button>
        </nav>
      </header>

      <RouterView />
    </div>
  </div>
</template>
