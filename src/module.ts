import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir,
  addComponent,
} from '@nuxt/kit'
import { defu } from 'defu'

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
    const { resolve } = createResolver(import.meta.url)

    // Register composables for auto-import
    addImportsDir(resolve('../runtime/composables'))

    // Add the plugin to inject Cal.com embed script
    addPlugin(resolve('../runtime/plugin'))

    // Auto-importing components
    addComponent({
      name: 'CalInlineWidget',
      export: 'default',
      filePath: resolve('../runtime/components/CalInlineWidget.vue'),
    })
    addComponent({
      name: 'CalPopupButton',
      export: 'default',
      filePath: resolve('../runtime/components/CalPopupButton.vue'),
    })
    addComponent({
      name: 'CalFloatingWidget',
      export: 'default',
      filePath: resolve('../runtime/components/CalFloatingWidget.vue'),
    })

    // Make module options available at runtime
    nuxt.options.runtimeConfig.public.calcom = defu(
      nuxt.options.runtimeConfig.public.calcom || {},
      options,
    )
  },
})
