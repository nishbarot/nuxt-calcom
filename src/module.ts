import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  addImportsDir,
} from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Default Cal.com link (e.g., 'username/meeting-type')
   */
  defaultLink?: string
  /**
   * Default embed type
   */
  defaultEmbed?: 'inline' | 'popup' | 'floating'
  /**
   * Theme configuration
   */
  theme?: 'light' | 'dark' | 'auto'
  /**
   * Branding options
   */
  branding?: {
    brandColor?: string
    darkBrandColor?: string
  }
  /**
   * Hide event type details
   */
  hideEventTypeDetails?: boolean
  /**
   * UI options for Cal.com embed
   */
  uiOptions?: {
    layout?: 'month_view' | 'week_view' | 'column_view'
    styles?: Record<string, any>
    hideEventTypeDetails?: boolean
    [key: string]: any
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-calcom',
    configKey: 'calcom',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    defaultEmbed: 'inline',
    theme: 'light',
    hideEventTypeDetails: false,
    uiOptions: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Register components directory with Cal prefix for auto-import
    addComponentsDir({
      path: resolver.resolve('../runtime/components'),
      pathPrefix: false,
      prefix: 'Cal',
      global: true,
    })

    // Register composables for auto-import
    addImportsDir(resolver.resolve('../runtime/composables'))

    // Add the plugin to inject Cal.com embed script
    addPlugin({
      src: resolver.resolve('../runtime/plugin'),
      mode: 'client',
    })

    // Make module options available at runtime
    nuxt.options.runtimeConfig.public.calcom = {
      defaultEmbed: 'inline',
      theme: 'light',
      hideEventTypeDetails: false,
      uiOptions: {},
      ...options,
    }
  },
})
