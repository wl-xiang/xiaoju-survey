<template>
  <button
    class="theme-toggle"
    type="button"
    :title="isDark ? '切换为浅色模式' : '切换为深色模式'"
    @click="handleToggle"
  >
    <svg v-if="isDark" class="theme-icon" viewBox="0 0 1024 1024" aria-hidden="true">
      <path
        fill="currentColor"
        d="M512 256a256 256 0 1 0 0 512 256 256 0 0 0 0-512z m0 96a160 160 0 1 1 0 320 160 160 0 0 1 0-320z m32-288v128a32 32 0 0 1-64 0V64a32 32 0 0 1 64 0z m0 768v128a32 32 0 0 1-64 0V832a32 32 0 0 1 64 0z m-412.9-355.9l90.5 90.5a32 32 0 0 1-45.3 45.3L85.8 421.4a32 32 0 0 1 45.3-45.3z m537.4 537.4l90.5 90.5a32 32 0 0 1-45.3 45.3l-90.5-90.5a32 32 0 0 1 45.3-45.3z m-628.1 0l90.5-90.5a32 32 0 0 1 45.3 45.3l-90.5 90.5a32 32 0 0 1-45.3-45.3z m537.4-537.4l90.5-90.5a32 32 0 0 1 45.3 45.3l-90.5 90.5a32 32 0 0 1-45.3-45.3z"
      />
    </svg>
    <svg v-else class="theme-icon" viewBox="0 0 1024 1024" aria-hidden="true">
      <path
        fill="currentColor"
        d="M600.7 132.5c46 12.4 88.6 34.4 125.5 65.1 33.3 27.6 61 61.4 81.6 99.3 21.3 39.2 34.2 82.2 38.2 126.4 7.9 88.6-18.1 176.6-71.1 246.2-27.6 36.1-62.2 66.4-101.5 88.8-40.5 23-85.4 37.3-131.6 41.1-88.6 7.2-176.4-19.4-245.5-72.9-35.9-27.8-65.9-62.6-88-102.1-22.8-40.7-36.7-85.8-40.2-132.2-1.5-19.7 13.3-36.9 33-38.4 13.4-1 26.4 5.3 33.7 16.6 37.8 58.4 98.8 98.4 167.5 110.2 20.3 3.5 41 4.5 61.5 3 24.9-1.8 49.4-7.4 72.6-16.6 20.9-8.2 40.5-19.3 58.3-32.9 15.9-12.2 30.1-26.4 42.2-42.2 13.9-18.1 25.2-38 33.6-59.2 9.3-23.5 14.9-48.3 16.6-73.5 1.4-20.6 0.4-41.3-3.1-61.7-11.9-68.6-51.9-129.5-110.2-167.2-11.3-7.3-17.6-20.3-16.6-33.7 1.5-19.7 18.7-34.5 38.4-33 2.8 0.2 5.6 0.7 8.1 1.7z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getThemeMode, toggleThemeMode } from '@/management/utils/theme'

const isDark = ref(getThemeMode() === 'dark')

const handleToggle = () => {
  const mode = toggleThemeMode()
  isDark.value = mode === 'dark'
}

onMounted(() => {
  isDark.value = getThemeMode() === 'dark'
})
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--app-border-color, #e3e4e8);
  border-radius: 8px;
  background: var(--app-bg-card, #fff);
  color: var(--app-text-regular, #6e707c);
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  color: var(--primary-color, #ffa600);
  border-color: var(--primary-color, #ffa600);
}
.theme-icon {
  width: 18px;
  height: 18px;
}
</style>
