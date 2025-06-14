<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { parseAndValidateCalLink } from '../utils/calLinkParser'
import { useRuntimeConfig, useNuxtApp } from '#app'

interface Props {
  calLink?: string
  text?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  uiOptions?: Record<string, unknown>
  buttonClass?: string
  buttonStyle?: Record<string, unknown>
  isVisible?: boolean
  offset?: {
    x?: number
    y?: number
  }
  // Enhanced customization props
  size?: 'small' | 'medium' | 'large'
  variant?: 'solid' | 'outline' | 'ghost'
  rounded?: boolean
  shadow?: 'none' | 'small' | 'medium' | 'large'
  animation?: 'slide' | 'fade' | 'bounce' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  calLink: undefined,
  text: 'Schedule time with me',
  position: 'bottom-right',
  uiOptions: () => ({}),
  buttonClass: undefined,
  buttonStyle: undefined,
  isVisible: true,
  offset: () => ({ x: 20, y: 20 }),
  size: 'medium',
  variant: 'solid',
  rounded: true,
  shadow: 'medium',
  animation: 'slide',
})

const config = useRuntimeConfig()
const { $calcom } = useNuxtApp()

// Generate unique widget ID and namespace
const instanceId = Math.random().toString(36).substr(2, 9)
const widgetId = `cal-floating-container-${instanceId}` // Changed for clarity, this is the container
const widgetNamespace = `floating-${instanceId}`

// Compute the cal link to use (prop takes precedence over config) with URL parsing
const calLink = computed(() => {
  const calcomConfig = config.public.calcom as Record<string, unknown>
  const rawLink = props.calLink || (calcomConfig?.defaultLink as string)

  if (!rawLink) {
    console.warn('[nuxt-calcom] No calLink provided and no defaultLink configured')
    return 'demo' // fallback to demo
  }

  // Parse and validate the link to handle both username and full URL formats
  const parsedLink = parseAndValidateCalLink(rawLink, 'demo')

  // Log the transformation for debugging
  if (rawLink !== parsedLink) {
    console.log('[nuxt-calcom] FloatingWidget normalized Cal.com link:', {
      original: rawLink,
      parsed: parsedLink,
    })
  }

  console.log('[nuxt-calcom] FloatingWidget calLink computed:', {
    rawLink,
    parsedLink,
    propCalLink: props.calLink,
  })
  return parsedLink
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

let isInitialized = false

const initializeFloatingWidget = async () => {
  if (import.meta.client && $calcom && !isInitialized) {
    try {
      await $calcom.waitForCal()

      if (window.Cal && typeof window.Cal === 'function') {
        // Use the global Cal object for floatingButton as it's a global UI element
        window.Cal('floatingButton', {
          calLink: calLink.value,
          config: computedUiOptions.value,
          buttonText: props.text,
          buttonColor: props.buttonStyle?.backgroundColor as string | undefined,
          buttonTextColor: props.buttonStyle?.color as string | undefined,
          // Note: Not all style props may be supported by the embed script.
        })
        isInitialized = true
        console.log(
          '[nuxt-calcom] FloatingWidget initialized via global Cal("floatingButton") for:',
          calLink.value
        )
      } else {
        console.error('[nuxt-calcom] Cal.com script not available for FloatingWidget')
      }
    } catch (error) {
      console.error('[nuxt-calcom] Failed to initialize FloatingWidget:', error)
    }
  }
}

// Watch for calLink changes and reinitialize when needed
watch(
  calLink,
  async (newCalLink, oldCalLink) => {
    if (newCalLink !== oldCalLink && newCalLink) {
      console.log('[nuxt-calcom] FloatingWidget calLink changed, reinitializing:', {
        old: oldCalLink,
        new: newCalLink,
      })
      isInitialized = false // Reset initialization state
      // The embed script should handle removing the old button and creating a new one on re-init.
      await initializeFloatingWidget()
    }
  },
  { immediate: false }
)

onMounted(async () => {
  await initializeFloatingWidget()
})

onUnmounted(() => {
  // Try to remove the floating button if the script provides a way
  if (window.Cal && typeof window.Cal === 'function' && isInitialized) {
    // This is speculative, assuming a 'destroy' or similar command might exist for floatingButton
    // to clean up the UI element it created.
    try {
      window.Cal('floatingButton', { hide: true }) // Example of a potential hide command
      console.log('[nuxt-calcom] Attempted to hide FloatingButton on unmount.')
    } catch (e) {
      // It's likely to fail if not a supported command, so we just warn.
      console.warn(
        '[nuxt-calcom] Could not hide FloatingButton on unmount, API may not support it.',
        e
      )
    }
  }
})
</script>

<style scoped>
/* Scoped styles are no longer needed as Cal.com script will inject its own button */
</style>
