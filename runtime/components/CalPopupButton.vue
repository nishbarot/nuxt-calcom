<template>
  <ClientOnly>
    <button
      :id="buttonId"
      ref="buttonRef"
      :class="buttonClass"
      :style="buttonStyle"
      :data-cal-link="calLink"
      :data-cal-config="configString"
    >
      <slot>{{ text }}</slot>
    </button>
    <template #fallback>
      <button :class="buttonClass" :style="buttonStyle" disabled>
        <slot>{{ text }}</slot>
      </button>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import type { StyleValue } from 'vue'
import { parseAndValidateCalLink } from '../utils/calLinkParser'
import { useRuntimeConfig, useNuxtApp } from '#app'

interface Props {
  calLink?: string
  text?: string
  uiOptions?: Record<string, unknown>
  buttonClass?: string
  buttonStyle?: StyleValue
}

const props = withDefaults(defineProps<Props>(), {
  calLink: undefined,
  text: 'Schedule Meeting',
  uiOptions: () => ({}),
  buttonClass: undefined,
  buttonStyle: undefined,
})

const config = useRuntimeConfig()
const { $calcom } = useNuxtApp()
const buttonRef = ref<HTMLElement>()

// Generate a unique ID for the button and namespace, though namespace is no longer programmatically used for popup
const instanceId = Math.random().toString(36).substr(2, 9)
const buttonId = `cal-popup-btn-${instanceId}`

// Compute the cal link to use (prop takes precedence over config)
const calLink = computed(() => {
  const calcomConfig = config.public.calcom as Record<string, unknown>
  const rawLink = props.calLink || (calcomConfig?.defaultLink as string)
  if (!rawLink) {
    console.warn('[nuxt-calcom] No calLink provided and no defaultLink configured')
    return 'demo'
  }
  return parseAndValidateCalLink(rawLink, 'demo')
})

// Compute UI options with defaults from config
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

// Convert UI options to JSON string for data-cal-config
const configString = computed(() => {
  const options = computedUiOptions.value
  return Object.keys(options).length > 0 ? JSON.stringify(options) : ''
})

// The click handler is no longer needed. Cal.com's embed script
// will automatically detect the `data-cal-link` attribute and handle the popup.

const ensureCalScriptIsReady = async () => {
  if (import.meta.client && $calcom) {
    try {
      await $calcom.waitForCal()
      console.log('[nuxt-calcom] Cal script ready. PopupButton will be handled by embed.js.')
    } catch (error) {
      console.error('[nuxt-calcom] Error ensuring Cal.com script is loaded for PopupButton:', error)
    }
  }
}

watch(calLink, newCalLink => {
  if (newCalLink) {
    console.log(
      '[nuxt-calcom] PopupButton calLink changed. The data-cal-link attribute has been updated to:',
      newCalLink
    )
  }
})

onMounted(() => {
  ensureCalScriptIsReady()
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
