<template>
  <Teleport to="body">
    <button
      v-show="isVisible"
      :class="computedClasses"
      :style="computedStyles"
      @click="openCalPopup"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="fab-content">
        <div v-if="hasIcon" class="fab-icon">
          <slot name="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </slot>
        </div>
        <div v-if="showText" class="fab-text">
          <slot>{{ text || 'Schedule Meeting' }}</slot>
        </div>
      </div>

      <!-- Ripple effect -->
      <div v-if="showRipple" class="fab-ripple" />
    </button>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
  calLink: { type: String, default: undefined },
  text: { type: String, default: 'Schedule Meeting' },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value: string) =>
      ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'custom'].includes(value),
  },
  offset: { type: Object, default: () => ({ x: 24, y: 24 }) },
  isVisible: { type: Boolean, default: true },
  buttonClass: { type: String, default: '' },
  buttonStyle: { type: Object, default: () => ({}) },
  size: {
    type: String,
    default: 'large',
    validator: (value: string) => ['small', 'medium', 'large', 'xl', 'custom'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) =>
      ['primary', 'secondary', 'success', 'warning', 'custom'].includes(value),
  },
  showText: { type: Boolean, default: true },
  hasIcon: { type: Boolean, default: true },
  pulse: { type: Boolean, default: true },
  showRipple: { type: Boolean, default: true },
  customColors: {
    type: Object,
    default: () => ({}), // { background, hover, text, shadow }
  },
  customSizes: {
    type: Object,
    default: () => ({}), // { width, height, fontSize, padding, iconSize }
  },
  customAnimations: {
    type: Object,
    default: () => ({}), // { duration, easing, pulseScale, rippleColor }
  },
  zIndex: { type: [String, Number], default: 2147483647 },
  borderRadius: { type: String, default: '' },
  boxShadow: { type: String, default: '' },
  fontFamily: { type: String, default: '' },
  fontWeight: { type: String, default: '' },
  disableDefaultStyles: { type: Boolean, default: false },
  uiOptions: { type: Object, default: () => ({}) },
})

const nuxtApp = useNuxtApp()
const isHovered = ref(false)

const computedClasses = computed(() => {
  const classes = ['cal-floating-widget']

  if (!props.disableDefaultStyles) {
    // Position classes
    if (props.position !== 'custom') {
      const positionClasses = {
        'bottom-right': 'fab-bottom-right',
        'bottom-left': 'fab-bottom-left',
        'top-right': 'fab-top-right',
        'top-left': 'fab-top-left',
      }
      classes.push(positionClasses[props.position as keyof typeof positionClasses])
    }

    // Size classes
    if (props.size !== 'custom') {
      const sizeClasses = {
        small: 'fab-small',
        medium: 'fab-medium',
        large: 'fab-large',
        xl: 'fab-xl',
      }
      classes.push(sizeClasses[props.size as keyof typeof sizeClasses])
    }

    // Variant classes
    if (props.variant !== 'custom') {
      const variantClasses = {
        primary: 'fab-primary',
        secondary: 'fab-secondary',
        success: 'fab-success',
        warning: 'fab-warning',
      }
      classes.push(variantClasses[props.variant as keyof typeof variantClasses])
    }

    // State classes
    if (isHovered.value) {
      classes.push('fab-hovered')
    }

    if (props.pulse) {
      classes.push('fab-pulse')
    }

    if (props.showText && props.hasIcon) {
      classes.push('fab-extended')
    } else if (!props.showText) {
      classes.push('fab-icon-only')
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

  styles.position = 'fixed'
  styles.zIndex = props.zIndex.toString()
  styles.cursor = 'pointer'

  if (props.position !== 'custom') {
    const { x = 24, y = 24 } = props.offset
    if (props.position.includes('right')) styles.right = `${x}px`
    if (props.position.includes('left')) styles.left = `${x}px`
    if (props.position.includes('bottom')) styles.bottom = `${y}px`
    if (props.position.includes('top')) styles.top = `${y}px`
  }

  if (props.customColors.background) {
    styles['--fab-bg'] = props.customColors.background
  }
  if (props.customColors.hover) {
    styles['--fab-bg-hover'] = props.customColors.hover
  }
  if (props.customColors.text) {
    styles['--fab-text'] = props.customColors.text
  }
  if (props.customColors.shadow) {
    styles['--fab-shadow'] = props.customColors.shadow
  }

  if (props.customSizes.width) {
    styles['--fab-width'] = props.customSizes.width
  }
  if (props.customSizes.height) {
    styles['--fab-height'] = props.customSizes.height
  }
  if (props.customSizes.fontSize) {
    styles['--fab-font-size'] = props.customSizes.fontSize
  }
  if (props.customSizes.padding) {
    styles['--fab-padding'] = props.customSizes.padding
  }
  if (props.customSizes.iconSize) {
    styles['--fab-icon-size'] = props.customSizes.iconSize
  }

  if (props.customAnimations.duration) {
    styles['--fab-transition-duration'] = props.customAnimations.duration
  }
  if (props.customAnimations.easing) {
    styles['--fab-transition-easing'] = props.customAnimations.easing
  }
  if (props.customAnimations.pulseScale) {
    styles['--fab-pulse-scale'] = props.customAnimations.pulseScale
  }
  if (props.customAnimations.rippleColor) {
    styles['--fab-ripple-color'] = props.customAnimations.rippleColor
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

  return { ...styles, ...props.buttonStyle }
})

const openCalPopup = async () => {
  if (import.meta.server) return

  if (!nuxtApp.$calcom) {
    console.error('[nuxt-calcom] Cal.com plugin not available.')
    return
  }

  try {
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
        ...props.uiOptions,
      },
    })
  } catch (error) {
    console.error('[nuxt-calcom] Failed to open Cal.com popup:', error)
  }
}

onMounted(() => {
  // Component is ready
})
</script>

<style scoped>
.cal-floating-widget {
  --fab-bg: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  --fab-bg-hover: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  --fab-text: white;
  --fab-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  --fab-shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.15);
  --fab-width: 64px;
  --fab-height: 64px;
  --fab-font-size: 16px;
  --fab-padding: 0 24px;
  --fab-icon-size: 24px;
  --fab-border-radius: 56px;
  --fab-transition-duration: 0.3s;
  --fab-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --fab-pulse-scale: 1.1;
  --fab-ripple-color: rgba(255, 255, 255, 0.3);

  border: none;
  outline: none;
  user-select: none;
  font-family: var(
    --fab-font-family,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif
  );
  font-weight: var(--fab-font-weight, 600);
  font-size: var(--fab-font-size);
  color: var(--fab-text);

  width: var(--fab-width);
  height: var(--fab-height);
  border-radius: var(--fab-border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  background: var(--fab-bg);
  box-shadow: var(--fab-shadow);
  backdrop-filter: blur(10px);

  transition: all var(--fab-transition-duration) var(--fab-transition-easing);
  transform: translateZ(0);
}

.fab-bottom-right {
  bottom: 24px;
  right: 24px;
}
.fab-bottom-left {
  bottom: 24px;
  left: 24px;
}
.fab-top-right {
  top: 24px;
  right: 24px;
}
.fab-top-left {
  top: 24px;
  left: 24px;
}

.fab-small {
  --fab-width: 48px;
  --fab-height: 48px;
  --fab-font-size: 14px;
  --fab-icon-size: 20px;
  --fab-padding: 0 16px;
}

.fab-medium {
  --fab-width: 56px;
  --fab-height: 56px;
  --fab-font-size: 16px;
  --fab-icon-size: 22px;
  --fab-padding: 0 20px;
}

.fab-large {
  --fab-width: 64px;
  --fab-height: 64px;
  --fab-font-size: 16px;
  --fab-icon-size: 24px;
  --fab-padding: 0 24px;
}

.fab-xl {
  --fab-width: 72px;
  --fab-height: 72px;
  --fab-font-size: 18px;
  --fab-icon-size: 28px;
  --fab-padding: 0 28px;
}

.fab-extended {
  width: auto;
  min-width: var(--fab-width);
  padding: var(--fab-padding);
  border-radius: calc(var(--fab-height) / 2);
}

.fab-primary {
  --fab-bg: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  --fab-bg-hover: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.fab-secondary {
  --fab-bg: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  --fab-bg-hover: linear-gradient(135deg, #4b5563 0%, #1f2937 100%);
}

.fab-success {
  --fab-bg: linear-gradient(135deg, #10b981 0%, #047857 100%);
  --fab-bg-hover: linear-gradient(135deg, #059669 0%, #065f46 100%);
}

.fab-warning {
  --fab-bg: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --fab-bg-hover: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}

.fab-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.fab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fab-icon svg {
  width: var(--fab-icon-size);
  height: var(--fab-icon-size);
}

.fab-text {
  white-space: nowrap;
  font-weight: inherit;
  letter-spacing: 0.025em;
}

.fab-icon-only .fab-content {
  gap: 0;
}

.cal-floating-widget:hover,
.fab-hovered {
  background: var(--fab-bg-hover);
  box-shadow: var(--fab-shadow-hover);
  transform: translateY(-2px) scale(1.05);
}

.cal-floating-widget:active {
  transform: translateY(-1px) scale(1.02);
  transition-duration: 0.1s;
}

.cal-floating-widget:focus-visible {
  outline: 3px solid rgba(59, 130, 246, 0.4);
  outline-offset: 2px;
}

.fab-pulse::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: inherit;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  opacity: 0.3;
  z-index: -1;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(var(--fab-pulse-scale));
    opacity: 0.1;
  }
}

.fab-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--fab-ripple-color);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.cal-floating-widget:active .fab-ripple {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

.cal-floating-widget {
  animation: fabEnter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes fabEnter {
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .fab-bottom-right {
    bottom: 16px;
    right: 16px;
  }
  .fab-bottom-left {
    bottom: 16px;
    left: 16px;
  }
  .fab-top-right {
    top: 16px;
    right: 16px;
  }
  .fab-top-left {
    top: 16px;
    left: 16px;
  }

  .fab-extended {
    padding: 0 16px;
  }

  .fab-text {
    font-size: 14px;
  }
}

@media (prefers-color-scheme: dark) {
  .cal-floating-widget {
    --fab-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
    --fab-shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cal-floating-widget,
  .fab-pulse::before,
  .fab-ripple {
    animation: none;
    transition: none;
  }

  .cal-floating-widget:hover {
    transform: none;
  }
}
</style>
