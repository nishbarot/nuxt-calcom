<template>
  <ClientOnly>
    <div :id="containerId" ref="containerRef" class="cal-inline-widget" :style="containerStyle" />
    <template #fallback>
      <div v-if="isLoading && !loadError" class="cal-loading-placeholder" :style="containerStyle">
        <div class="loading-content">
          <div class="loading-spinner" />
          <p>Loading Cal.com calendar...</p>
        </div>
      </div>
      <div v-if="loadError" class="cal-error-placeholder" :style="containerStyle">
        <p>Error loading calendar: {{ loadError }}</p>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRuntimeConfig, useNuxtApp } from '#app'

interface Props {
  calLink?: string
  uiOptions?: Record<string, unknown>
  style?: Record<string, unknown>
  height?: string | number
  width?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  calLink: undefined,
  uiOptions: () => ({}),
  style: () => ({}),
  height: '630px',
  width: '100%',
})

const config = useRuntimeConfig()
const { $calcom } = useNuxtApp()
const containerRef = ref<HTMLElement>()
const isLoading = ref(true)
const loadError = ref<string | null>(null)

// Generate a unique ID for the container
const instanceId = Math.random().toString(36).substr(2, 9)
const containerId = `cal-inline-${instanceId}`

// Compute container styles
const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  ...props.style,
}))

// Compute UI options
const computedUiOptions = computed(() => {
  const calcomConfig = config.public.calcom as Record<string, unknown>
  return {
    ...(calcomConfig?.uiOptions as Record<string, unknown>),
    ...props.uiOptions,
    theme: calcomConfig?.theme,
    branding: calcomConfig?.branding,
    hideEventTypeDetails: calcomConfig?.hideEventTypeDetails,
  }
})

let isEmbedInitialized = false

const initializeEmbed = async () => {
  if (isEmbedInitialized || !import.meta.client) return

  await nextTick()
  const element = document.getElementById(containerId)
  if (!element) {
    console.error(`[nuxt-calcom] Could not find element with ID: ${containerId}`)
    return
  }

  try {
    await $calcom.waitForCal()
    if (window.Cal) {
      window.Cal('inline', {
        elementOrSelector: `#${containerId}`,
        calLink: props.calLink,
        config: computedUiOptions.value,
      })
      window.Cal('on', {
        action: 'linkReady',
        callback: () => {
          isLoading.value = false
          loadError.value = null
          console.log(`[nuxt-calcom] Inline widget is ready for: ${props.calLink}`)
        },
      })
      window.Cal('on', {
        action: 'linkFailed',
        callback: (e: { detail: { data: { msg: string } } }) => {
          isLoading.value = false
          loadError.value = e.detail?.data?.msg || 'An unknown error occurred.'
          console.error(`[nuxt-calcom] Inline widget failed to load:`, e.detail)
        },
      })
      isEmbedInitialized = true
    }
  } catch (error) {
    console.error('[nuxt-calcom] Error initializing inline widget:', error)
    loadError.value = 'Failed to load Cal.com script.'
    isLoading.value = false
  }
}

onMounted(initializeEmbed)
</script>

<style scoped>
.cal-loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
}

.loading-content {
  text-align: center;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
