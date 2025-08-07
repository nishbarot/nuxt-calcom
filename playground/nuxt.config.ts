import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },

  // Add CSS framework for better styling
  css: ['~/assets/css/main.css'],

  // Add compatibility date
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },

  // Configure the Cal.com module
  // @ts-expect-error calcom is a valid key that is added by the module
  calcom: {
    defaultLink: 'demo',
    defaultEmbed: 'inline',
    theme: 'light',
    branding: {
      brandColor: '#667eea',
    },
    hideEventTypeDetails: false,
    uiOptions: {
      layout: 'month_view',
    },
  },

  // Allow Cal.com scripts and frames for security
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy':
          "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';",
      },
    },
  },
})
