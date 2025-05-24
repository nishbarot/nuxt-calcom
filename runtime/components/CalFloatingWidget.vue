<template>
  <ClientOnly>
    <teleport to="body">
      <div
        :id="widgetId"
        ref="widgetRef"
        :class="[
          'cal-floating-widget',
          `cal-floating-${position}`,
          { 'cal-floating-hidden': !isVisible }
        ]"
        :style="widgetStyle"
      >
        <button
          :class="buttonClass"
          :style="buttonStyle"
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
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Schedule time with me',
  position: 'bottom-right',
  uiOptions: () => ({}),
  isVisible: true,
  offset: () => ({ x: 20, y: 20 })
})

const config = useRuntimeConfig()
const { $calcom } = useNuxtApp()
const widgetRef = ref<HTMLElement>()

// Generate unique widget ID and namespace
const widgetId = ref(`cal-floating-${Math.random().toString(36).substr(2, 9)}`)
const namespace = ref(`floating-${Math.random().toString(36).substr(2, 9)}`)

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

.cal-floating-widget button {
  cursor: pointer;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 50px;
  background: #0ea5e9;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cal-floating-widget button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.6);
  background: #0284c7;
}

.cal-floating-widget button:active {
  transform: translateY(0);
}

/* Position-specific animations */
.cal-floating-bottom-right {
  animation: slideInFromBottomRight 0.5s ease-out;
}

.cal-floating-bottom-left {
  animation: slideInFromBottomLeft 0.5s ease-out;
}

.cal-floating-top-right {
  animation: slideInFromTopRight 0.5s ease-out;
}

.cal-floating-top-left {
  animation: slideInFromTopLeft 0.5s ease-out;
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
</style> 