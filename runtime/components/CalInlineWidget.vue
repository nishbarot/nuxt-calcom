<template>
  <div :class="['cal-inline-container', containerClass]" :style="computedStyles">
    <!-- This div is the target for the Cal.com embed -->
    <div :id="containerId" ref="containerRef" class="cal-inline-widget-embed" />

    <!-- Loading State Overlay -->
    <div
      v-if="isLoading"
      class="cal-state-overlay loading-overlay"
      :class="loadingClass"
      :style="loadingStyle"
    >
      <div class="loading-content">
        <div v-if="showLoadingSpinner" class="loading-spinner">
          <slot name="loading-spinner">
            <div class="default-spinner" />
          </slot>
        </div>
        <div v-if="showLoadingText" class="loading-text">
          <slot name="loading-text">
            <p>{{ loadingText }}</p>
          </slot>
        </div>
      </div>
    </div>

    <!-- Error State Overlay -->
    <div
      v-if="loadError"
      class="cal-state-overlay error-overlay"
      :class="errorClass"
      :style="errorStyle"
    >
      <div class="error-content">
        <div v-if="showErrorIcon" class="error-icon">
          <slot name="error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </slot>
        </div>
        <div class="error-text">
          <slot name="error-text" :error="loadError">
            <h3>{{ errorTitle }}</h3>
            <p>{{ loadError }}</p>
            <button v-if="showRetryButton" class="retry-button" @click="retryLoad">
              {{ retryButtonText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRuntimeConfig, useNuxtApp } from '#app'

const props = defineProps({
  calLink: { type: String, default: undefined },
  uiOptions: { type: Object, default: () => ({}) },
  containerClass: { type: String, default: '' },
  containerStyle: { type: Object, default: () => ({}) },
  height: { type: [String, Number], default: '630px' },
  width: { type: [String, Number], default: '100%' },
  minHeight: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '' },
  // Loading customization
  loadingText: { type: String, default: 'Loading Cal.com calendar...' },
  showLoadingSpinner: { type: Boolean, default: true },
  showLoadingText: { type: Boolean, default: true },
  loadingClass: { type: String, default: '' },
  loadingStyle: { type: Object, default: () => ({}) },
  // Error customization
  errorTitle: { type: String, default: 'Failed to Load Calendar' },
  showErrorIcon: { type: Boolean, default: true },
  showRetryButton: { type: Boolean, default: true },
  retryButtonText: { type: String, default: 'Try Again' },
  errorClass: { type: String, default: '' },
  errorStyle: { type: Object, default: () => ({}) },
  // Enhanced customization
  theme: {
    type: String,
    default: 'auto',
    validator: (value: string) => ['light', 'dark', 'auto', 'custom'].includes(value),
  },
  borderRadius: { type: String, default: '' },
  border: { type: String, default: '' },
  boxShadow: { type: String, default: '' },
  backgroundColor: { type: String, default: '' },
  // Custom colors for theming
  customColors: {
    type: Object,
    default: () => ({}), // { background, border, text, accent, loading, error }
  },
  // Animation settings
  customAnimations: {
    type: Object,
    default: () => ({}), // { fadeIn, slideIn, duration, easing }
  },
  // Responsive settings
  responsive: { type: Boolean, default: true },
  breakpoints: {
    type: Object,
    default: () => ({
      mobile: { width: '100%', height: '500px' },
      tablet: { width: '100%', height: '600px' },
      desktop: { width: '100%', height: '630px' },
    }),
  },
  disableDefaultStyles: { type: Boolean, default: false },
})

const config = useRuntimeConfig()
const { $calcom } = useNuxtApp()
const containerRef = ref<HTMLElement>()
const isLoading = ref(true)
const loadError = ref<string | null>(null)

// Generate a stable ID based on component instance
const instanceId = Math.random().toString(36).substr(2, 9)
const containerId = ref(`cal-inline-${instanceId}`)

const isEmbedInitialized = ref(false)

// Computed styles
const computedStyles = computed(() => {
  const styles: Record<string, string> = {}

  styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width

  if (props.minHeight)
    styles.minHeight =
      typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  if (props.maxHeight)
    styles.maxHeight =
      typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight

  if (props.borderRadius) styles.borderRadius = props.borderRadius
  if (props.border) styles.border = props.border
  if (props.boxShadow) styles.boxShadow = props.boxShadow
  if (props.backgroundColor) styles.backgroundColor = props.backgroundColor

  if (props.customColors.background) styles['--cal-bg'] = props.customColors.background
  if (props.customColors.border) styles['--cal-border'] = props.customColors.border
  if (props.customColors.text) styles['--cal-text'] = props.customColors.text
  if (props.customColors.accent) styles['--cal-accent'] = props.customColors.accent
  if (props.customColors.loading) styles['--cal-loading'] = props.customColors.loading
  if (props.customColors.error) styles['--cal-error'] = props.customColors.error

  if (props.customAnimations.duration)
    styles['--cal-animation-duration'] = props.customAnimations.duration
  if (props.customAnimations.easing)
    styles['--cal-animation-easing'] = props.customAnimations.easing

  return { ...styles, ...props.containerStyle }
})

const computedUiOptions = computed(() => {
  const calcomConfig = config.public.calcom as Record<string, unknown>
  return {
    ...(calcomConfig?.uiOptions as Record<string, unknown>),
    ...props.uiOptions,
    theme: props.theme !== 'auto' ? props.theme : calcomConfig?.theme,
    branding: calcomConfig?.branding,
    hideEventTypeDetails: calcomConfig?.hideEventTypeDetails,
  }
})

const effectiveCalLink = computed(() => {
  const calcomConfig = config.public.calcom as { defaultLink?: string }
  return props.calLink || calcomConfig?.defaultLink
})

const initializeEmbed = async () => {
  if (!import.meta.client || !effectiveCalLink.value) return

  isLoading.value = true
  loadError.value = null

  await nextTick()

  const element = containerRef.value

  if (!element) {
    const errorMessage = `Container element could not be found.`
    console.error(`[nuxt-calcom] ${errorMessage}`)
    loadError.value = errorMessage
    isLoading.value = false
    return
  }

  try {
    const Cal = await $calcom.waitForCal()

    // Clean up any previous embed in this container
    element.innerHTML = ''

    // Set up event listeners for the embed
    Cal('on', {
      action: 'linkReady',
      callback: () => {
        console.log('[nuxt-calcom] Inline widget loaded successfully')
        isLoading.value = false
        loadError.value = null
        isEmbedInitialized.value = true
      },
    })

    Cal('on', {
      action: 'linkFailed',
      callback: (e: any) => {
        console.error('[nuxt-calcom] Inline widget failed to load:', e)
        isLoading.value = false
        loadError.value = 'Failed to load calendar'
      },
    })

    // Configure UI styling first if needed
    if (Object.keys(computedUiOptions.value).length > 0) {
      Cal('ui', {
        styles: {
          body: {
            background: 'transparent',
          },
          eventTypeListItem: {
            background: 'transparent',
          },
        },
      })
    }

    console.log('[nuxt-calcom] Initializing inline widget for:', effectiveCalLink.value)

    // Use the correct Cal.com inline API - pass the actual HTMLElement for robustness
    Cal('inline', {
      elementOrSelector: element,
      calLink: effectiveCalLink.value,
    })

    // Add a fallback timeout to handle cases where linkReady never fires
    setTimeout(() => {
      if (isLoading.value) {
        // Check if iframe was actually created
        const iframe = element.querySelector('iframe')
        if (iframe) {
          console.log('[nuxt-calcom] Iframe detected, assuming load success')
          isLoading.value = false
          loadError.value = null
          isEmbedInitialized.value = true
        } else {
          console.warn('[nuxt-calcom] No iframe detected after timeout')
          isLoading.value = false
          loadError.value = 'Calendar took too long to load'
        }
      }
    }, 10000) // 10 second timeout
  } catch (error) {
    isLoading.value = false
    loadError.value = error instanceof Error ? error.message : 'Failed to initialize'
    console.error(`[nuxt-calcom] Error initializing inline widget:`, error)
  }
}

const retryLoad = () => {
  initializeEmbed()
}

watch(effectiveCalLink, (newLink, oldLink) => {
  if (newLink !== oldLink) {
    initializeEmbed()
  }
})

onMounted(initializeEmbed)

onUnmounted(() => {
  // Cleanup Cal.com listeners
  if (window.Cal && isEmbedInitialized.value) {
    try {
      window.Cal('off', { action: 'linkReady' })
      window.Cal('off', { action: 'linkFailed' })
    } catch (error) {
      console.warn('[nuxt-calcom] Error cleaning up Cal.com listeners:', error)
    }
  }
})
</script>

<style scoped>
.cal-inline-container {
  position: relative;
  /* Base styles that can be overridden by props */
  --cal-bg: #ffffff;
  --cal-border: #e5e7eb;
  --cal-text: #374151;
  --cal-accent: #3b82f6;
  --cal-loading: #6b7280;
  --cal-error: #ef4444;
  --cal-animation-duration: 0.3s;
  --cal-animation-easing: ease-in-out;

  background-color: var(--cal-bg);
  border: 1px solid var(--cal-border);
  border-radius: 0.5rem;
  overflow: auto;
  transition: all var(--cal-animation-duration) var(--cal-animation-easing);
}

.cal-inline-widget-embed {
  width: 100%;
  height: 100%;
}

.cal-state-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn var(--cal-animation-duration) var(--cal-animation-easing);
}

.loading-overlay {
  background: var(--cal-bg);
  color: var(--cal-loading);
}

.error-overlay {
  background: var(--cal-bg);
  color: var(--cal-error);
  border: 2px solid var(--cal-error);
}

.loading-content,
.error-content {
  text-align: center;
  padding: 2rem;
  max-width: 400px;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.default-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top: 4px solid var(--cal-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loading-text p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.error-icon {
  margin-bottom: 1rem;
}

.error-icon svg {
  width: 48px;
  height: 48px;
}

.error-text h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.error-text p {
  margin: 0 0 1.5rem 0;
  font-size: 0.875rem;
  color: var(--cal-text);
  opacity: 0.8;
}

.retry-button {
  background: var(--cal-accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.retry-button:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cal-state-overlay,
  .default-spinner {
    animation: none;
    transition: none;
  }
}

/* Theme variants */
.theme-light {
  --cal-bg: #ffffff;
  --cal-border: #e5e7eb;
  --cal-text: #374151;
}

.theme-dark {
  --cal-bg: #1f2937;
  --cal-border: #374151;
  --cal-text: #f9fafb;
}

.theme-auto {
  --cal-bg: #ffffff;
  --cal-border: #e5e7eb;
  --cal-text: #374151;
}

@media (prefers-color-scheme: dark) {
  .theme-auto {
    --cal-bg: #1f2937;
    --cal-border: #374151;
    --cal-text: #f9fafb;
  }
}

/* State styles */
.is-loading {
  opacity: 0.8;
}

.has-error {
  border-color: var(--cal-error);
}

/* Responsive behavior */
.responsive {
  width: 100%;
  max-width: 100%;
}

@media (max-width: 768px) {
  .responsive {
    height: 500px !important;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .responsive {
    height: 600px !important;
  }
}

/* Loading placeholder */
.cal-loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--cal-bg);
  border: 2px dashed var(--cal-border);
  border-radius: 0.5rem;
  color: var(--cal-loading);
  animation: fadeIn var(--cal-animation-duration) var(--cal-animation-easing);
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .cal-state-overlay,
  .default-spinner {
    animation: none;
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .cal-inline-widget {
    --cal-border: #000000;
    --cal-text: #000000;
    --cal-accent: #0000ff;
  }
}
</style>
