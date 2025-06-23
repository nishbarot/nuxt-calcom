export interface CalFunction {
  (action: string, ...args: unknown[]): unknown
  loaded?: boolean
  ns?: Record<string, unknown>
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
  buttonStyle?: Record<string, string | number>
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
  uiOptions?: Record<string, unknown>
}

export interface CalPopupButtonProps {
  calLink?: string
  text?: string
  loadingText?: string
  buttonClass?: string
  buttonStyle?: Record<string, string | number>
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'custom'
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline'
    | 'ghost'
    | 'custom'
  shape?: 'square' | 'rounded' | 'pill' | 'custom'
  showText?: boolean
  hasIcon?: boolean
  iconPosition?: 'left' | 'right' | 'top' | 'bottom'
  loading?: boolean
  disabled?: boolean
  showRipple?: boolean
  fullWidth?: boolean
  // Enhanced customization options
  customColors?: Record<string, string>
  customSizes?: Record<string, string>
  customAnimations?: Record<string, string>
  borderWidth?: string
  borderRadius?: string
  boxShadow?: string
  fontFamily?: string
  fontWeight?: string
  letterSpacing?: string
  textTransform?: string
  disableDefaultStyles?: boolean
  uiOptions?: Record<string, unknown>
}

export interface CalInlineWidgetProps {
  calLink?: string
  uiOptions?: Record<string, unknown>
  containerClass?: string
  containerStyle?: Record<string, string | number>
  height?: string | number
  width?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  // Loading customization
  loadingText?: string
  showLoadingSpinner?: boolean
  showLoadingText?: boolean
  loadingClass?: string
  loadingStyle?: Record<string, string | number>
  // Error customization
  errorTitle?: string
  showErrorIcon?: boolean
  showRetryButton?: boolean
  retryButtonText?: string
  errorClass?: string
  errorStyle?: Record<string, string | number>
  // Enhanced customization
  theme?: 'light' | 'dark' | 'auto' | 'custom'
  borderRadius?: string
  border?: string
  boxShadow?: string
  backgroundColor?: string
  // Custom colors for theming
  customColors?: Record<string, string>
  // Animation settings
  customAnimations?: Record<string, string>
  // Responsive settings
  responsive?: boolean
  breakpoints?: Record<string, Record<string, string>>
  disableDefaultStyles?: boolean
}

export interface ModuleOptions {
  calLink: string
  defaultLink: string
  theme?: 'light' | 'dark' | 'auto'
  hideEventTypeDetails?: boolean
  branding?: Record<string, unknown>
  uiOptions?: Record<string, unknown>
}

export {}
