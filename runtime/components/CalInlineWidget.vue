<template>
  <ClientOnly>
    <div>
      <div :id="containerId" ref="containerRef" class="cal-inline-widget" :style="containerStyle" />
    </div>
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
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { parseAndValidateCalLink } from '../utils/calLinkParser'
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
const isLoading = ref(true) // Controls visibility of the loading placeholder
const loadError = ref<string | null>(null) // Stores error message if link fails

// Generate unique container ID
const containerId = ref(`cal-inline-${Math.random().toString(36).substr(2, 9)}`)
const widgetNamespace = computed(() => `cal-${containerId.value}`)

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
    console.log('[nuxt-calcom] Normalized Cal.com link:', { original: rawLink, parsed: parsedLink })
  }

  return parsedLink
})

// Compute container styles
const containerStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  ...props.style,
}))

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

let embedInitialized = false
let retryCount = 0

const resetEmbedState = () => {
  embedInitialized = false
  retryCount = 0
  isLoading.value = true
  loadError.value = null
}

const initializeEmbed = async () => {
  if (!calLink.value || embedInitialized) return

  try {
    console.log('[DEBUG] Starting inline embed initialization...')
    console.log('[DEBUG] Container ID:', containerId.value)
    console.log('[DEBUG] Cal link:', calLink.value)

    // Wait for Cal to be available first
    await $calcom.waitForCal()
    console.log('[DEBUG] Cal.com script ready')

    // Ensure Vue has finished rendering the DOM
    await nextTick()

    // Wait a bit more for hydration to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    // Now check if element exists using both methods
    const elementById = document.getElementById(containerId.value)
    const elementByRef = containerRef.value

    console.log('[DEBUG] Element by ID:', !!elementById, elementById)
    console.log('[DEBUG] Element by ref:', !!elementByRef, elementByRef)

    const element = elementByRef || elementById

    if (!element) {
      console.error('[DEBUG] Element still not found! DOM state:', {
        documentReady: document.readyState,
        bodyChildren: document.body?.children.length,
        containerId: containerId.value,
      })

      // Try one more time after a longer delay
      if (retryCount < 5) {
        retryCount++
        console.log(`[DEBUG] Retry attempt ${retryCount}/5 in 200ms...`)
        setTimeout(() => initializeEmbed(), 200)
        return
      } else {
        console.error('[DEBUG] Max retries reached. Element not found.')
        return
      }
    }

    // Ensure element is ready and has minimum dimensions
    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      console.log('[DEBUG] Element not ready (no dimensions), retrying...')
      setTimeout(() => initializeEmbed(), 100)
      return
    }

    console.log('[DEBUG] Element ready, initializing embed...')
    console.log('[DEBUG] Element details:', {
      id: element.id,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      parentElement: element.parentElement,
    })

    // Use the plugin to initialize and manage the namespace
    if (import.meta.client && $calcom) {
      try {
        await $calcom.waitForCal()
        if (window.Cal && typeof window.Cal === 'function') {
          window.Cal('init', widgetNamespace.value, { origin: 'https://cal.com' })

          // Debugging: check if element is available
          document.getElementById(containerId.value)

          // Call inline action under the specific namespace
          if (window.Cal.ns && typeof window.Cal.ns[widgetNamespace.value] === 'function') {
            window.Cal.ns[widgetNamespace.value]('inline', {
              elementOrSelector: `#${containerId.value}`,
              calLink: calLink.value,
              config: computedUiOptions.value,
            })

            // Listen for linkReady and linkFailed events on this namespace
            window.Cal.ns[widgetNamespace.value]('on', {
              action: 'linkReady',
              callback: () => {
                console.log(
                  `[nuxt-calcom] Inline widget linkReady for namespace: ${widgetNamespace.value}`
                )
                isLoading.value = false
                loadError.value = null
              },
            })

            window.Cal.ns[widgetNamespace.value]('on', {
              action: 'linkFailed',
              callback: (event: { detail: { data: { msg: string } } }) => {
                const errorData = event.detail?.data || {}
                const errorMessage = errorData.msg || 'Unknown error loading calendar.'
                console.error(
                  `[nuxt-calcom] Inline widget linkFailed for namespace: ${widgetNamespace.value}`,
                  errorData
                )
                isLoading.value = false
                loadError.value = errorMessage
              },
            })
          } else {
            // Fallback to global if namespace init somehow failed (should not happen)
            console.warn(
              `[nuxt-calcom] Namespace ${widgetNamespace.value} not found, falling back to global Cal('inline')`
            )
            window.Cal('inline', {
              elementOrSelector: `#${containerId.value}`,
              calLink: calLink.value,
              config: computedUiOptions.value,
            })
          }
        }

        embedInitialized = true
        retryCount = 0 // Reset retry count on success
        console.log('[nuxt-calcom] Inline widget initialized successfully for:', calLink.value)
      } catch (error) {
        console.error('[nuxt-calcom] Failed to initialize inline widget:', error)
        if (error instanceof Error) {
          console.error('[DEBUG] Error details:', error.message, error.stack)
        } else {
          console.error('[DEBUG] Error details:', String(error))
        }
      }
    }
  } catch (error) {
    console.error('[nuxt-calcom] Failed to initialize inline widget:', error)
    if (error instanceof Error) {
      console.error('[DEBUG] Error details:', error.message, error.stack)
    } else {
      console.error('[DEBUG] Error details:', String(error))
    }
  }
}

const destroyEmbed = () => {
  if (containerRef.value && embedInitialized) {
    // Clear any specific listeners if Cal.com API supports it for namespaces.
    // For now, they should cease to function once the iframe is gone or ns is reused.
    containerRef.value.innerHTML = ''
    embedInitialized = false
    isLoading.value = true // Reset for potential re-initialization
    loadError.value = null // Reset error state
    console.log('[nuxt-calcom] Inline widget destroyed for namespace:', widgetNamespace.value)
  }
}

// Watch for calLink changes and reinitialize when needed
watch(
  calLink,
  async (newCalLink, oldCalLink) => {
    if (newCalLink !== oldCalLink && newCalLink) {
      console.log('[nuxt-calcom] InlineWidget calLink changed, reinitializing:', {
        old: oldCalLink,
        new: newCalLink,
      })
      destroyEmbed()
      resetEmbedState()
      // Small delay to ensure cleanup is complete
      setTimeout(() => {
        initializeEmbed()
      }, 200)
    }
  },
  { immediate: false }
)

onMounted(async () => {
  console.log('[DEBUG] Component mounted, containerRef.value:', containerRef.value)
  console.log('[DEBUG] Document ready state:', document.readyState)

  // Wait for next tick to ensure DOM is fully rendered
  await nextTick()

  // Additional delay to ensure hydration is complete
  setTimeout(() => {
    console.log('[DEBUG] Starting initialization after mount delay')
    initializeEmbed()
  }, 150)
})

onUnmounted(() => {
  destroyEmbed()
})
</script>

<style scoped>
.cal-inline-widget {
  min-height: 500px;
  overflow: hidden;
}

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
