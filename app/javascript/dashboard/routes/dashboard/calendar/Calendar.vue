<template>
  <div class="h-full w-full">
    <iframe
      :key="iframeSrc"
      :src="iframeSrc"
      class="w-full h-full border-0 transition-opacity duration-300"
      :style="{ opacity: iframeLoaded ? 1 : 0 }"
      @load="iframeLoaded = true"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAccount } from 'dashboard/composables/useAccount';

const iframeSrc = ref('')
const iframeLoaded = ref(false)

const { accountId } = useAccount();

const CALENDAR_DOMAIN = "https://" + window.PROJECT_NAME + "-" + window.CALENDAR_SERVICE_NAME + "." + window.CHATWOOT_DOMAIN.split('.').slice(1).join('.')

function updateIframeSrc() {
  const theme = localStorage.getItem('color_scheme') || 'system'
  const currentAccountId = accountId.value;

  iframeLoaded.value = false

  if (currentAccountId) {
    iframeSrc.value = `${CALENDAR_DOMAIN}/admin?theme=${encodeURIComponent(theme)}&accountId=${encodeURIComponent(currentAccountId)}`
  } else {

    iframeSrc.value = `${CALENDAR_DOMAIN}/admin?theme=${encodeURIComponent(theme)}`
  }
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


watch(accountId, (newAccountId, oldAccountId) => {
  if (newAccountId !== oldAccountId && newAccountId) {
    updateIframeSrc();
  }
}, { immediate: true });

</script>

<style scoped>
iframe {
  transition: opacity 0.3s ease;
}
</style>
