export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  
  // Configure the Cal.com module
  calcom: {
    defaultLink: 'demo',
    defaultEmbed: 'inline',
    theme: 'light',
    branding: {
      brandColor: '#667eea'
    },
    hideEventTypeDetails: false,
    uiOptions: {
      layout: 'month_view'
    }
  },

  // Add CSS framework for better styling
  css: ['~/assets/css/main.css'],

  // Add compatibility date
  compatibilityDate: '2024-04-03'
}) 