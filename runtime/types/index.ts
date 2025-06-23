export interface CalFunction {
  (action: string, ...args: any[]): any
  loaded?: boolean
  ns?: Record<string, any>
  q?: unknown[]
  l?: (args: unknown[]) => void
}

export interface CalcomPlugin {
  waitForCal: () => Promise<CalFunction>
  registerNamespace: (namespace: string, config?: Record<string, unknown>) => Promise<void>
  isNamespaceReady: (namespace: string) => boolean
  destroyNamespace: (namespace: string) => Promise<void>
}

declare module '#app' {
  interface NuxtApp {
    $calcom: CalcomPlugin
  }
}

export interface CalFloatingWidgetProps {
  calLink?: string
  text?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'custom'
  offset?: { x?: number; y?: number }
  isVisible?: boolean
  buttonClass?: string
  buttonStyle?: Record<string, any>
  size?: 'small' | 'medium' | 'large' | 'xl' | 'custom'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'custom'
  showText?: boolean
  hasIcon?: boolean
  pulse?: boolean
  showRipple?: boolean
  // Enhanced customization options
  customColors?: {
    background?: string
    hover?: string
    text?: string
    shadow?: string
  }
  customSizes?: {
    width?: string
    height?: string
    fontSize?: string
    padding?: string
    iconSize?: string
  }
  customAnimations?: {
    duration?: string
    easing?: string
    pulseScale?: string
    rippleColor?: string
  }
  zIndex?: string | number
  borderRadius?: string
  boxShadow?: string
  fontFamily?: string
  fontWeight?: string
  disableDefaultStyles?: boolean
  uiOptions?: Record<string, any>
}

export interface CalPopupButtonProps {
  calLink?: string
  text?: string
  loadingText?: string
  buttonClass?: string
  buttonStyle?: Record<string, any>
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'custom'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'custom'
  shape?: 'square' | 'rounded' | 'pill' | 'custom'
  showText?: boolean
  hasIcon?: boolean
  iconPosition?: 'left' | 'right' | 'top' | 'bottom'
  loading?: boolean
  disabled?: boolean
  showRipple?: boolean
  fullWidth?: boolean
  // Enhanced customization options
  customColors?: {
    background?: string
    hover?: string
    active?: string
    text?: string
    border?: string
    shadow?: string
  }
  customSizes?: {
    padding?: string
    fontSize?: string
    iconSize?: string
    minWidth?: string
    height?: string
  }
  customAnimations?: {
    duration?: string
    easing?: string
    hoverScale?: string
    activeScale?: string
    rippleColor?: string
  }
  borderWidth?: string
  borderRadius?: string
  boxShadow?: string
  fontFamily?: string
  fontWeight?: string
  letterSpacing?: string
  textTransform?: string
  disableDefaultStyles?: boolean
  uiOptions?: Record<string, any>
}

export interface CalInlineWidgetProps {
  calLink?: string
  uiOptions?: Record<string, unknown>
  containerClass?: string
  containerStyle?: Record<string, unknown>
  height?: string | number
  width?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  // Loading customization
  loadingText?: string
  showLoadingSpinner?: boolean
  showLoadingText?: boolean
  loadingClass?: string
  loadingStyle?: Record<string, unknown>
  // Error customization
  errorTitle?: string
  showErrorIcon?: boolean
  showRetryButton?: boolean
  retryButtonText?: string
  errorClass?: string
  errorStyle?: Record<string, unknown>
  // Enhanced customization
  theme?: 'light' | 'dark' | 'auto' | 'custom'
  borderRadius?: string
  border?: string
  boxShadow?: string
  backgroundColor?: string
  // Custom colors for theming
  customColors?: {
    background?: string
    border?: string
    text?: string
    accent?: string
    loading?: string
    error?: string
  }
  // Animation settings
  customAnimations?: {
    duration?: string
    easing?: string
  }
  // Responsive settings
  responsive?: boolean
  breakpoints?: {
    mobile?: { width?: string; height?: string }
    tablet?: { width?: string; height?: string }
    desktop?: { width?: string; height?: string }
  }
  disableDefaultStyles?: boolean
}

export {}
