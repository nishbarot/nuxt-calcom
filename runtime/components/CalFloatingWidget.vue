<template>
  <div />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'

interface Props {
  calLink: string
  text?: string
  buttonColor?: string
  textColor?: string
  position?: 'bottom-right' | 'bottom-left'
  offset?: {
    x?: number
    y?: number
  }
}

const props = defineProps<Props>()

const nuxtApp = useNuxtApp()

// Reactive state
const isScriptReady = ref(false)

const initializeFloatingWidget = async () => {
  if (import.meta.server) return
  if (!nuxtApp.$calcom) {
    console.error('[nuxt-calcom] Cal.com plugin not available.')
    return
  }
  try {
    const Cal = await nuxtApp.$calcom.waitForCal()
    isScriptReady.value = true

    const widgetConfig = {
      floatingButton: {
        calLink: props.calLink,
        ...(props.text && { text: props.text }),
        ...(props.buttonColor && { buttonColor: props.buttonColor }),
        ...(props.textColor && { textColor: props.textColor }),
        ...(props.position && { position: props.position }),
        ...(props.offset && { offset: props.offset }),
      },
    }

    Cal('floatingButton', widgetConfig.floatingButton)
  } catch (error) {
    console.error('[nuxt-calcom] FloatingWidget failed to initialize:', error)
  }
}

onMounted(() => {
  initializeFloatingWidget()
})

onUnmounted(() => {
  if (import.meta.server || !isScriptReady.value) return

  // Use the Cal.com API to cleanly remove the widget.
  // This is the idiomatic way and avoids manual DOM manipulation.
  if (window.Cal) {
    try {
      window.Cal('destroy')
      console.log('[nuxt-calcom] FloatingWidget destroyed via Cal.com API.')
    } catch (e) {
      console.error('[nuxt-calcom] Failed to destroy floating widget via API', e)
    }
  }
})
</script>

<style scoped>
/* Scoped styles are no longer needed as Cal.com injects its own styles */
</style>
