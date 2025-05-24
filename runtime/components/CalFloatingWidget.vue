<template>
  <ClientOnly>
    <teleport to="body">
      <div
        :id="widgetId"
        ref="widgetRef"
        :class="[
          'cal-floating-widget',
          `cal-floating-${position}`,
          animationClass,
          { 'cal-floating-hidden': !isVisible }
        ]"
        :style="widgetStyle"
      >
        <button
          :class="[buttonClass, dynamicButtonClass]"
          :style="dynamicButtonStyle"
          :data-cal-link="calLink"
          :data-cal-namespace="namespace"
          :data-cal-config="configString"
        >
          <slot>{{ text }}</slot>
        </button>
      </div>
    </teleport>
    <template #fallback>
      <!-- No fallback needed for floating widget -->
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRuntimeConfig, useNuxtApp } from '#app'
import { parseAndValidateCalLink } from '../utils/calLinkParser'

interface Props {
  calLink?: string
  text?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  uiOptions?: Record<string, any>
  buttonClass?: string
  buttonStyle?: Record<string, any>
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
  text: 'Schedule time with me',
  position: 'bottom-right',
  uiOptions: () => ({}),
  isVisible: true,
  offset: () => ({ x: 20, y: 20 }),
  size: 'medium',
  variant: 'solid',
  rounded: true,
  shadow: 'medium',
  animation: 'slide'
})

const config = useRuntimeConfig()
const { $calcom } = useNuxtApp()
const widgetRef = ref<HTMLElement>()

// Generate unique widget ID and namespace
const widgetId = ref(`cal-floating-${Math.random().toString(36).substr(2, 9)}`)
const namespace = ref(`floating-${Math.random().toString(36).substr(2, 9)}`)

// Compute the cal link to use (prop takes precedence over config) with URL parsing
const calLink = computed(() => {
  const calcomConfig = config.public.calcom as any
  const rawLink = props.calLink || calcomConfig?.defaultLink
  
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

// Compute widget positioning styles
const widgetStyle = computed(() => {
  const styles: Record<string, string> = {
    position: 'fixed',
    zIndex: '9999'
  }

  const { x = 20, y = 20 } = props.offset

  switch (props.position) {
    case 'bottom-right':
      styles.bottom = `${y}px`
      styles.right = `${x}px`
      break
    case 'bottom-left':
      styles.bottom = `${y}px`
      styles.left = `${x}px`
      break
    case 'top-right':
      styles.top = `${y}px`
      styles.right = `${x}px`
      break
    case 'top-left':
      styles.top = `${y}px`
      styles.left = `${x}px`
      break
  }

  return styles
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

// Compute dynamic button classes based on props
const dynamicButtonClass = computed(() => {
  const classes = []
  
  // Size classes
  classes.push(`cal-btn-${props.size}`)
  
  // Variant classes
  classes.push(`cal-btn-${props.variant}`)
  
  // Rounded class
  if (props.rounded) {
    classes.push('cal-btn-rounded')
  }
  
  // Shadow class
  classes.push(`cal-btn-shadow-${props.shadow}`)
  
  return classes.join(' ')
})

// Compute dynamic button style based on props
const dynamicButtonStyle = computed(() => {
  const styles: Record<string, string> = {}
  
  // Apply custom button styles
  if (props.buttonStyle) {
    Object.assign(styles, props.buttonStyle)
  }
  
  return styles
})

// Compute animation class
const animationClass = computed(() => {
  return `cal-floating-${props.position}-${props.animation}`
})

onMounted(async () => {
  console.log('[DEBUG] Floating widget mounted')
  console.log('[DEBUG] Widget ID:', widgetId.value)
  console.log('[DEBUG] Namespace:', namespace.value)
  console.log('[DEBUG] Cal link:', calLink.value)
  
  // Only register namespace on client-side where $calcom is available
  if (process.client && $calcom) {
    try {
      // Register the namespace immediately - this ensures it's ready before any clicks
      await $calcom.registerNamespace(namespace.value, computedUiOptions.value)
      
      // Verify the namespace is ready
      if ($calcom.isNamespaceReady(namespace.value)) {
        console.log('[nuxt-calcom] Floating widget ready - namespace properly initialized and ready for clicks')
      } else {
        console.warn('[nuxt-calcom] Floating widget namespace not ready yet:', namespace.value)
        // Wait a bit and check again
        setTimeout(() => {
          if ($calcom.isNamespaceReady(namespace.value)) {
            console.log('[nuxt-calcom] Floating widget ready (delayed) - namespace now ready')
          } else {
            console.error('[nuxt-calcom] Floating widget namespace registration failed:', namespace.value)
          }
        }, 100)
      }
    } catch (error) {
      console.error('[nuxt-calcom] Failed to register floating widget namespace:', error)
    }
  } else {
    console.log('[DEBUG] Skipping floating widget namespace registration - not on client or $calcom not available')
  }
})

onUnmounted(() => {
  console.log('[nuxt-calcom] Floating widget unmounted')
})
</script>

<style scoped>
.cal-floating-widget {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cal-floating-hidden {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.8);
}

/* Base button styles */
.cal-floating-widget button {
  cursor: pointer;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Size variants */
.cal-btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.cal-btn-medium {
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
}

.cal-btn-large {
  padding: 1rem 1.5rem;
  font-size: 1rem;
}

/* Variant styles */
.cal-btn-solid {
  background: #0ea5e9;
  color: white;
}

.cal-btn-solid:hover {
  background: #0284c7;
}

.cal-btn-outline {
  background: transparent;
  color: #0ea5e9;
  border: 2px solid #0ea5e9;
}

.cal-btn-outline:hover {
  background: #0ea5e9;
  color: white;
}

.cal-btn-ghost {
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.cal-btn-ghost:hover {
  background: rgba(14, 165, 233, 0.2);
}

/* Rounded styles */
.cal-btn-rounded {
  border-radius: 50px;
}

/* Shadow variants */
.cal-btn-shadow-none {
  box-shadow: none;
}

.cal-btn-shadow-small {
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.cal-btn-shadow-medium {
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
}

.cal-btn-shadow-large {
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.6);
}

/* Hover effects for shadows */
.cal-btn-shadow-small:hover {
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  transform: translateY(-1px);
}

.cal-btn-shadow-medium:hover {
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.6);
  transform: translateY(-2px);
}

.cal-btn-shadow-large:hover {
  box-shadow: 0 12px 35px rgba(14, 165, 233, 0.8);
  transform: translateY(-3px);
}

.cal-floating-widget button:active {
  transform: translateY(0);
}

/* Position-specific slide animations */
.cal-floating-bottom-right-slide {
  animation: slideInFromBottomRight 0.5s ease-out;
}

.cal-floating-bottom-left-slide {
  animation: slideInFromBottomLeft 0.5s ease-out;
}

.cal-floating-top-right-slide {
  animation: slideInFromTopRight 0.5s ease-out;
}

.cal-floating-top-left-slide {
  animation: slideInFromTopLeft 0.5s ease-out;
}

/* Fade animations */
.cal-floating-bottom-right-fade,
.cal-floating-bottom-left-fade,
.cal-floating-top-right-fade,
.cal-floating-top-left-fade {
  animation: fadeIn 0.5s ease-out;
}

/* Bounce animations */
.cal-floating-bottom-right-bounce,
.cal-floating-bottom-left-bounce,
.cal-floating-top-right-bounce,
.cal-floating-top-left-bounce {
  animation: bounceIn 0.6s ease-out;
}

/* No animation */
.cal-floating-bottom-right-none,
.cal-floating-bottom-left-none,
.cal-floating-top-right-none,
.cal-floating-top-left-none {
  animation: none;
}

@keyframes slideInFromBottomRight {
  from {
    opacity: 0;
    transform: translate(100px, 100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes slideInFromBottomLeft {
  from {
    opacity: 0;
    transform: translate(-100px, 100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes slideInFromTopRight {
  from {
    opacity: 0;
    transform: translate(100px, -100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes slideInFromTopLeft {
  from {
    opacity: 0;
    transform: translate(-100px, -100px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>