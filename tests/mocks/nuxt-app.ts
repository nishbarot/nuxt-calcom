import { ref, computed } from 'vue'

// Mock useRuntimeConfig
export const useRuntimeConfig = () => ({
  public: {
    calcom: {
      defaultLink: 'demo',
      theme: 'light',
      branding: {},
      hideEventTypeDetails: false,
      uiOptions: {}
    }
  }
})

// Mock useNuxtApp
export const useNuxtApp = () => ({
  $calcom: {
    waitForCal: () => Promise.resolve(window.Cal),
    registerNamespace: (namespace: string, config?: Record<string, any>) => Promise.resolve(),
    isNamespaceReady: (namespace: string) => true
  }
})

// Mock nextTick
export const nextTick = () => Promise.resolve()
