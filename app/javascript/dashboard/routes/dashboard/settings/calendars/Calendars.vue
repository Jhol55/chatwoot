
<template>
  <div class="h-full w-full">
    <iframe
      :src="iframeSrc"
      class="w-full h-full border-0 transition-opacity duration-300"
      :style="{ opacity: iframeLoaded ? 1 : 0 }"
      @load="iframeLoaded = true"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const iframeSrc = ref('')
const iframeLoaded = ref(false)
const CALENDAR_DOMAIN = "https://" + window.PROJECT_NAME + "-" + window.CALENDAR_SERVICE_NAME + "." + window.CHATWOOT_DOMAIN.split('.').slice(1).join('.')

function updateIframeSrc() {
  const theme = localStorage.getItem('color_scheme') || 'system'
  iframeLoaded.value = false // Reset opacity before loading new URL
  iframeSrc.value = `${CALENDAR_DOMAIN}/calendars?theme=${encodeURIComponent(theme)}`
}

function handleStorageChange(event) {
  if (event.key === 'color_scheme') {
    updateIframeSrc()
  }
}

onMounted(() => {
  updateIframeSrc()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('theme-change', updateIframeSrc)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('theme-change', updateIframeSrc)
})
</script>

<style scoped>
iframe {
  transition: opacity 0.3s ease;
}
</style>
