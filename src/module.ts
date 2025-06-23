import { defineNuxtModule, addPlugin, addComponent, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-calcom',
    configKey: 'calcom',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add plugin
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Add components
    addComponent({
      name: 'CalPopupButton',
      filePath: resolver.resolve('./runtime/components/CalPopupButton.vue'),
      export: 'default',
    })
    addComponent({
      name: 'CalFloatingWidget',
      filePath: resolver.resolve('./runtime/components/CalFloatingWidget.vue'),
      export: 'default',
    })
    addComponent({
      name: 'CalInlineWidget',
      filePath: resolver.resolve('./runtime/components/CalInlineWidget.vue'),
      export: 'default',
    })
  },
})
