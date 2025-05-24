<template>
  <ClientOnly>
    <button
      :id="buttonId"
      ref="buttonRef"
      :class="buttonClass"
      :style="buttonStyle"
      :data-cal-link="calLink"
      :data-cal-namespace="namespace"
      :data-cal-config="configString"
    >
      <slot>{{ text }}</slot>
    </button>
    <template #fallback>
      <button
        :class="buttonClass"
        :style="buttonStyle"
        disabled
      >
        <slot>{{ text }}</slot>
      </button>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig, useNuxtApp } from '#app'

interface Props {
  calLink?: string
  text?: string
  uiOptions?: Record<string, any>
  buttonClass?: string
  buttonStyle?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Schedule Meeting',
  uiOptions: () => ({})
})

const config = useRuntimeConfig()
const { $calcom } = useNuxtApp()
const buttonRef = ref<HTMLElement>()

// Generate unique button ID and namespace
const buttonId = ref(`cal-popup-btn-${Math.random().toString(36).substr(2, 9)}`)
const namespace = ref(`popup-${Math.random().toString(36).substr(2, 9)}`)

// Compute the cal link to use (prop takes precedence over config)
const calLink = computed(() => {
  const calcomConfig = config.public.calcom as any
  const link = props.calLink || calcomConfig?.defaultLink
  if (!link) {
    console.warn('[nuxt-calcom] No calLink provided and no defaultLink configured')
    return 'demo' // fallback to demo
  }
  return link
})

// Compute UI options with defaults from config
const computedUiOptions = computed(() => {
  const calcomConfig = config.public.calcom as any
  return {
    ...calcomConfig?.uiOptions,
    ...props.uiOptions,
    theme: calcomConfig?.theme,
    branding: calcomConfig?.branding,
    hideEventTypeDetails: calcomConfig?.hideEventTypeDetails
  }
})

// Convert UI options to JSON string for data-cal-config
const configString = computed(() => {
  const options = computedUiOptions.value
  return Object.keys(options).length > 0 ? JSON.stringify(options) : ''
})

onMounted(async () => {
  // Only register namespace on client-side where $calcom is available
  if (process.client && $calcom) {
    try {
      // Register the namespace immediately - this ensures it's ready before any clicks
      await $calcom.registerNamespace(namespace.value, computedUiOptions.value)
      
      // Verify the namespace is ready
      if ($calcom.isNamespaceReady(namespace.value)) {
        console.log('[nuxt-calcom] Popup button ready - namespace properly initialized and ready for clicks')
      } else {
        console.warn('[nuxt-calcom] Namespace not ready yet:', namespace.value)
        // Wait a bit and check again
        setTimeout(() => {
          if ($calcom.isNamespaceReady(namespace.value)) {
            console.log('[nuxt-calcom] Popup button ready (delayed) - namespace now ready')
          } else {
            console.error('[nuxt-calcom] Namespace registration failed:', namespace.value)
          }
        }, 100)
      }
    } catch (error) {
      console.error('[nuxt-calcom] Failed to register namespace:', error)
    }
  } else {
    console.log('[DEBUG] Skipping namespace registration - not on client or $calcom not available')
  }
})
</script>

<style scoped>
button {
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2563eb;
}

button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style> 