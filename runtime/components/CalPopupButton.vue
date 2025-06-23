<template>
    <button
    :class="computedClasses"
    :style="computedStyles"
    @click="openCalPopup"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="button-content">
      <div v-if="hasIcon" class="button-icon">
        <slot name="icon">
          <svg v-if="loading" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 2v4"/>
            <path d="M16 2v4"/>
            <rect width="18" height="18" x="3" y="4" rx="2"/>
            <path d="M3 10h18"/>
          </svg>
        </slot>
      </div>
      <div v-if="showText" class="button-text">
        <slot>{{ loading ? (loadingText || 'Opening...') : text }}</slot>
      </div>
    </div>
    
    <!-- Ripple effect -->
    <div v-if="showRipple" class="button-ripple"></div>
      </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// @ts-ignore
import { useNuxtApp } from '#app'

const props = defineProps({
  calLink: { type: String, required: false },
  text: { type: String, default: 'Schedule Meeting' },
  loadingText: { type: String, default: 'Opening...' },
  buttonClass: { type: String, default: '' },
  buttonStyle: { type: Object, default: () => ({}) },
  size: { 
    type: String, 
    default: 'medium',
    validator: (value: string) => ['xs', 'small', 'medium', 'large', 'xl', 'custom'].includes(value)
  },
  variant: { 
    type: String, 
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'ghost', 'custom'].includes(value)
  },
  shape: {
    type: String,
    default: 'rounded',
    validator: (value: string) => ['square', 'rounded', 'pill', 'custom'].includes(value)
  },
  showText: { type: Boolean, default: true },
  hasIcon: { type: Boolean, default: false },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'right', 'top', 'bottom'].includes(value)
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showRipple: { type: Boolean, default: true },
  fullWidth: { type: Boolean, default: false },
  // Enhanced customization props
  customColors: { 
    type: Object, 
    default: () => ({}) // { background, hover, active, text, border, shadow }
  },
  customSizes: { 
    type: Object, 
    default: () => ({}) // { padding, fontSize, iconSize, minWidth, height }
  },
  customAnimations: { 
    type: Object, 
    default: () => ({}) // { duration, easing, hoverScale, activeScale, rippleColor }
  },
  borderWidth: { type: String, default: '' },
  borderRadius: { type: String, default: '' },
  boxShadow: { type: String, default: '' },
  fontFamily: { type: String, default: '' },
  fontWeight: { type: String, default: '' },
  letterSpacing: { type: String, default: '' },
  textTransform: { type: String, default: '' },
  disableDefaultStyles: { type: Boolean, default: false },
  uiOptions: { type: Object, default: () => ({}) }
})

const nuxtApp = useNuxtApp()
const isHovered = ref(false)
const isLoading = ref(false)

const computedClasses = computed(() => {
  const classes = ['cal-popup-button']
  
  // Only apply preset classes if not using custom styling
  if (!props.disableDefaultStyles) {
    // Size classes
    if (props.size !== 'custom') {
      const sizeClasses = {
        xs: 'btn-xs',
        small: 'btn-small',
        medium: 'btn-medium', 
        large: 'btn-large',
        xl: 'btn-xl'
      }
      classes.push(sizeClasses[props.size as keyof typeof sizeClasses])
    }
    
    // Variant classes
    if (props.variant !== 'custom') {
      const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        warning: 'btn-warning',
        danger: 'btn-danger',
        outline: 'btn-outline',
        ghost: 'btn-ghost'
      }
      classes.push(variantClasses[props.variant as keyof typeof variantClasses])
    }
    
    // Shape classes
    if (props.shape !== 'custom') {
      const shapeClasses = {
        square: 'btn-square',
        rounded: 'btn-rounded',
        pill: 'btn-pill'
      }
      classes.push(shapeClasses[props.shape as keyof typeof shapeClasses])
    }
    
    // State classes
    if (isHovered.value) {
      classes.push('btn-hovered')
    }
    
    if (props.loading || isLoading.value) {
      classes.push('btn-loading')
    }
    
    if (props.disabled) {
      classes.push('btn-disabled')
    }
    
    if (props.fullWidth) {
      classes.push('btn-full-width')
    }
    
    // Icon position classes
    if (props.hasIcon && props.showText) {
      classes.push(`btn-icon-${props.iconPosition}`)
    } else if (props.hasIcon && !props.showText) {
      classes.push('btn-icon-only')
    }
  }
  
  // Always apply custom classes
  if (props.buttonClass) {
    classes.push(props.buttonClass)
  }
  
  return classes.join(' ')
})

const computedStyles = computed(() => {
  const styles: Record<string, string | number> = {}
  
  // Custom styling overrides
  if (props.customColors.background) {
    styles['--btn-bg'] = props.customColors.background
  }
  if (props.customColors.hover) {
    styles['--btn-bg-hover'] = props.customColors.hover
  }
  if (props.customColors.active) {
    styles['--btn-bg-active'] = props.customColors.active
  }
  if (props.customColors.text) {
    styles['--btn-text'] = props.customColors.text
  }
  if (props.customColors.border) {
    styles['--btn-border'] = props.customColors.border
  }
  if (props.customColors.shadow) {
    styles['--btn-shadow'] = props.customColors.shadow
  }
  
  if (props.customSizes.padding) {
    styles['--btn-padding'] = props.customSizes.padding
  }
  if (props.customSizes.fontSize) {
    styles['--btn-font-size'] = props.customSizes.fontSize
  }
  if (props.customSizes.iconSize) {
    styles['--btn-icon-size'] = props.customSizes.iconSize
  }
  if (props.customSizes.minWidth) {
    styles['--btn-min-width'] = props.customSizes.minWidth
  }
  if (props.customSizes.height) {
    styles['--btn-height'] = props.customSizes.height
  }
  
  if (props.customAnimations.duration) {
    styles['--btn-transition-duration'] = props.customAnimations.duration
  }
  if (props.customAnimations.easing) {
    styles['--btn-transition-easing'] = props.customAnimations.easing
  }
  if (props.customAnimations.hoverScale) {
    styles['--btn-hover-scale'] = props.customAnimations.hoverScale
  }
  if (props.customAnimations.activeScale) {
    styles['--btn-active-scale'] = props.customAnimations.activeScale
  }
  if (props.customAnimations.rippleColor) {
    styles['--btn-ripple-color'] = props.customAnimations.rippleColor
  }
  
  // Direct style overrides
  if (props.borderWidth) {
    styles.borderWidth = props.borderWidth
  }
  if (props.borderRadius) {
    styles.borderRadius = props.borderRadius
  }
  if (props.boxShadow) {
    styles.boxShadow = props.boxShadow
  }
  if (props.fontFamily) {
    styles.fontFamily = props.fontFamily
  }
  if (props.fontWeight) {
    styles.fontWeight = props.fontWeight
  }
  if (props.letterSpacing) {
    styles.letterSpacing = props.letterSpacing
  }
  if (props.textTransform) {
    styles.textTransform = props.textTransform
  }
  
  // Merge with user-provided styles (highest priority)
  return { ...styles, ...props.buttonStyle }
})

const openCalPopup = async () => {
  if (import.meta.server || props.disabled || props.loading || isLoading.value) return
  
  if (!nuxtApp.$calcom) {
    console.error('[nuxt-calcom] Cal.com plugin not available.')
    return
  }
  
  try {
    isLoading.value = true
    const Cal = await nuxtApp.$calcom.waitForCal()
    
    const calcomConfig = nuxtApp.$config.public.calcom as { defaultLink?: string }
    const calLink = props.calLink || calcomConfig?.defaultLink
    
    if (!calLink) {
      console.error('[nuxt-calcom] No cal-link provided and no defaultLink configured.')
      return
    }
    
    Cal('modal', {
      calLink,
      config: {
        ...props.uiOptions
      }
    })
  } catch (error) {
    console.error('[nuxt-calcom] Failed to open Cal.com popup:', error)
  } finally {
    // Reset loading state after a short delay
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}
</script>

<style scoped>
.cal-popup-button {
  /* CSS Custom Properties for full customization */
  --btn-bg: #3b82f6;
  --btn-bg-hover: #2563eb;
  --btn-bg-active: #1d4ed8;
  --btn-text: #ffffff;
  --btn-border: transparent;
  --btn-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --btn-shadow-hover: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --btn-padding: 0.75rem 1.5rem;
  --btn-font-size: 1rem;
  --btn-icon-size: 1.25rem;
  --btn-min-width: auto;
  --btn-height: auto;
  --btn-border-radius: 0.5rem;
  --btn-border-width: 1px;
  --btn-transition-duration: 0.2s;
  --btn-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --btn-hover-scale: 1.02;
  --btn-active-scale: 0.98;
  --btn-ripple-color: rgba(255, 255, 255, 0.3);
  
  /* Base button styles using custom properties */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: var(--btn-min-width);
  height: var(--btn-height);
  padding: var(--btn-padding);
  font-family: var(--btn-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight, 500);
  line-height: 1.5;
  color: var(--btn-text);
  background: var(--btn-bg);
  border: var(--btn-border-width) solid var(--btn-border);
  border-radius: var(--btn-border-radius);
  box-shadow: var(--btn-shadow);
  cursor: pointer;
  user-select: none;
  outline: none;
  overflow: hidden;
  transition: all var(--btn-transition-duration) var(--btn-transition-easing);
  transform: translateZ(0);
}

/* Size variants */
.btn-xs {
  --btn-padding: 0.25rem 0.75rem;
  --btn-font-size: 0.75rem;
  --btn-icon-size: 1rem;
  --btn-border-radius: 0.25rem;
}

.btn-small {
  --btn-padding: 0.5rem 1rem;
  --btn-font-size: 0.875rem;
  --btn-icon-size: 1rem;
  --btn-border-radius: 0.375rem;
}

.btn-medium {
  --btn-padding: 0.75rem 1.5rem;
  --btn-font-size: 1rem;
  --btn-icon-size: 1.25rem;
  --btn-border-radius: 0.5rem;
}

.btn-large {
  --btn-padding: 1rem 2rem;
  --btn-font-size: 1.125rem;
  --btn-icon-size: 1.5rem;
  --btn-border-radius: 0.5rem;
}

.btn-xl {
  --btn-padding: 1.25rem 2.5rem;
  --btn-font-size: 1.25rem;
  --btn-icon-size: 1.75rem;
  --btn-border-radius: 0.75rem;
}

/* Variant styles */
.btn-primary {
  --btn-bg: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  --btn-bg-hover: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  --btn-bg-active: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
  --btn-text: #ffffff;
}

.btn-secondary {
  --btn-bg: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  --btn-bg-hover: linear-gradient(135deg, #4b5563 0%, #1f2937 100%);
  --btn-bg-active: linear-gradient(135deg, #374151 0%, #111827 100%);
  --btn-text: #ffffff;
}

.btn-success {
  --btn-bg: linear-gradient(135deg, #10b981 0%, #047857 100%);
  --btn-bg-hover: linear-gradient(135deg, #059669 0%, #065f46 100%);
  --btn-bg-active: linear-gradient(135deg, #047857 0%, #064e3b 100%);
  --btn-text: #ffffff;
}

.btn-warning {
  --btn-bg: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --btn-bg-hover: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  --btn-bg-active: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  --btn-text: #ffffff;
}

.btn-danger {
  --btn-bg: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  --btn-bg-hover: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  --btn-bg-active: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
  --btn-text: #ffffff;
}

.btn-outline {
  --btn-bg: transparent;
  --btn-bg-hover: #3b82f6;
  --btn-bg-active: #2563eb;
  --btn-text: #3b82f6;
  --btn-border: #3b82f6;
  --btn-border-width: 2px;
}

.btn-outline:hover,
.btn-outline.btn-hovered {
  --btn-text: #ffffff;
}

.btn-ghost {
  --btn-bg: transparent;
  --btn-bg-hover: rgba(59, 130, 246, 0.1);
  --btn-bg-active: rgba(59, 130, 246, 0.2);
  --btn-text: #3b82f6;
  --btn-border: transparent;
  --btn-shadow: none;
}

/* Shape variants */
.btn-square {
  --btn-border-radius: 0;
}

.btn-rounded {
  --btn-border-radius: 0.5rem;
}

.btn-pill {
  --btn-border-radius: 9999px;
}

/* Layout variants */
.btn-full-width {
  width: 100%;
}

.btn-icon-only {
  aspect-ratio: 1;
  padding: calc(var(--btn-padding) / 2);
}

/* Icon positioning */
.btn-icon-right .button-content {
  flex-direction: row-reverse;
}

.btn-icon-top .button-content {
  flex-direction: column;
}

.btn-icon-bottom .button-content {
  flex-direction: column-reverse;
}

/* Content layout */
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.button-icon svg {
  width: var(--btn-icon-size);
  height: var(--btn-icon-size);
}

.button-text {
  white-space: nowrap;
  font-weight: inherit;
}

/* State styles */
.cal-popup-button:hover,
.btn-hovered {
  background: var(--btn-bg-hover);
  box-shadow: var(--btn-shadow-hover);
  transform: scale(var(--btn-hover-scale));
}

.cal-popup-button:active {
  background: var(--btn-bg-active);
  transform: scale(var(--btn-active-scale));
  transition-duration: 0.1s;
}

.cal-popup-button:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  cursor: wait;
}

/* Ripple effect */
.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--btn-ripple-color);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.cal-popup-button:active .button-ripple {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

/* Spin animation for loading icon */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .cal-popup-button {
    --btn-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
    --btn-shadow-hover: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .cal-popup-button,
  .button-ripple,
  .animate-spin {
    animation: none;
    transition: none;
  }
  
  .cal-popup-button:hover {
    transform: none;
  }
}
</style>
