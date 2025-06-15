import { parseAndValidateCalLink } from '../utils/calLinkParser'
import { useNuxtApp, useRuntimeConfig } from '#app'
import type { CalcomPlugin } from '../types'

export interface CalcomOptions {
  calLink?: string
  uiOptions?: Record<string, any>
  namespace?: string
}

export interface CalcomAPI {
  openPopup: (options?: CalcomOptions) => Promise<void>
  closePopup: (namespace?: string) => void
  isLoaded: () => boolean
  waitForCal: () => Promise<void>
}

export const useCalcom = (): CalcomAPI => {
  const { $calcom } = useNuxtApp() as { $calcom: CalcomPlugin }
  const config = useRuntimeConfig()

  const getDefaultOptions = (): Record<string, any> => {
    const calcomConfig = config.public.calcom as any
    return {
      theme: calcomConfig?.theme,
      branding: calcomConfig?.branding,
      hideEventTypeDetails: calcomConfig?.hideEventTypeDetails,
      ...calcomConfig?.uiOptions,
    }
  }

  const openPopup = async (options: CalcomOptions = {}) => {
    try {
      await $calcom.waitForCal()

      const calcomConfig = config.public.calcom as any
      const rawCalLink = options.calLink || calcomConfig?.defaultLink
      if (!rawCalLink) {
        console.warn('[nuxt-calcom] No calLink provided for popup')
        return
      }

      // Parse and validate the Cal.com link to handle both formats
      const calLink = parseAndValidateCalLink(rawCalLink, 'demo')

      // Log the transformation for debugging
      if (rawCalLink !== calLink) {
        console.log('[nuxt-calcom] Normalized Cal.com link for popup:', {
          original: rawCalLink,
          parsed: calLink,
        })
      }

      const mergedOptions = {
        ...getDefaultOptions(),
        ...options.uiOptions,
      }

      if (options.namespace) {
        // Use namespace if provided
        if (window.Cal && typeof window.Cal === 'function') {
          window.Cal('init', options.namespace, {
            origin: 'https://cal.com',
          })
        }

        if (window.Cal && window.Cal.ns && window.Cal.ns[options.namespace]) {
          if (Object.keys(mergedOptions).length > 0) {
            if (typeof window.Cal.ns[options.namespace] === 'function') {
              window.Cal.ns[options.namespace]('ui', mergedOptions)
            }
          }
          if (typeof window.Cal.ns[options.namespace] === 'function') {
            window.Cal.ns[options.namespace]('popup', {
              calLink,
            })
          }
        }
      } else {
        // Direct popup without namespace
        // First apply UI configuration if any
        if (window.Cal && typeof window.Cal === 'function') {
          if (Object.keys(mergedOptions).length > 0) {
            window.Cal('ui', mergedOptions)
          }

          // Preload the calendar for instant opening
          window.Cal('preload', { calLink })

          // Open popup
          window.Cal('popup', { calLink })
        }
      }

      console.log('[nuxt-calcom] Popup opened for:', calLink)
    } catch (error) {
      console.error('[nuxt-calcom] Failed to open popup:', error)
    }
  }

  const closePopup = async (namespace?: string) => {
    try {
      await $calcom.waitForCal()

      if (namespace && window.Cal && window.Cal.ns && window.Cal.ns[namespace]) {
        // Close specific namespace popup if available
        if (typeof window.Cal.ns[namespace] === 'function') {
          // Cal.com doesn't have a standard close method, so we try common approaches
          window.Cal.ns[namespace]('close')
        }
      }

      // For non-namespaced or fallback, try to close any modal
      // Cal.com embeds are typically closed by user interaction
      console.log('[nuxt-calcom] Popup close requested')
    } catch (error) {
      console.error('[nuxt-calcom] Failed to close popup:', error)
    }
  }

  const isLoaded = (): boolean => {
    return (
      typeof window !== 'undefined' &&
      !!window.Cal &&
      typeof window.Cal.loaded === 'boolean' &&
      !!window.Cal.loaded
    )
  }

  const waitForCal = async (): Promise<void> => {
    await $calcom.waitForCal()
  }

  return {
    openPopup,
    closePopup,
    isLoaded,
    waitForCal,
  }
}
