import { defineNuxtModule, createResolver, addPlugin, addComponent, addImports } from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from '../runtime/types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-calcom',
    configKey: 'calcom',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    calLink: 'demo',
    defaultLink: 'demo',
    theme: 'light',
    hideEventTypeDetails: false,
    uiOptions: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const moduleOptions = defu(nuxt.options.runtimeConfig.public.calcom as ModuleOptions, options)

    nuxt.options.runtimeConfig.public.calcom = moduleOptions

    addPlugin(resolver.resolve('../runtime/plugin'))

    addComponent({
      name: 'CalFloatingWidget',
      export: 'default',
      filePath: resolver.resolve('../runtime/components/CalFloatingWidget.vue'),
    })

    addComponent({
      name: 'CalInlineWidget',
      export: 'default',
      filePath: resolver.resolve('../runtime/components/CalInlineWidget.vue'),
    })

    addComponent({
      name: 'CalPopupButton',
      export: 'default',
      filePath: resolver.resolve('../runtime/components/CalPopupButton.vue'),
    })

    addImports({
      name: 'useCalcom',
      from: resolver.resolve('../runtime/composables/useCalcom'),
    })

    addImports({
      name: 'useCalcomEventListener',
      from: resolver.resolve('../runtime/composables/useCalcomEventListener'),
    })
  },
})
