import { onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'

export type CalcomEventType = 
  | 'bookingSuccessfulV2'
  | 'eventTypeSelected'
  | 'eventTypeViewed'
  | 'linkReady'
  | '__routeChanged'
  | '__windowLoadComplete'
  | 'profileChanged'
  | 'embedReady'

export interface CalcomEventDetail {
  action: string
  data?: any
  namespace?: string
  [key: string]: any
}

export interface CalcomEventCallback {
  (event: CalcomEventDetail): void
}

/**
 * Hook to listen to Cal.com embed events
 * @param eventType - The type of event to listen for
 * @param callback - Function to call when the event occurs
 * @param namespace - Optional namespace to filter events
 */
export const useCalcomEventListener = (
  eventType: CalcomEventType,
  callback: CalcomEventCallback,
  namespace?: string
) => {
  const { $calcom } = useNuxtApp()
  let isListening = false
  let removeListener: (() => void) | null = null

  const startListening = async () => {
    if (isListening) return

    try {
      await $calcom.waitForCal()
      
      // Create the event handler
      const eventHandler = (event: CalcomEventDetail) => {
        // Filter by namespace if provided
        if (namespace && event.namespace !== namespace) {
          return
        }
        
        // Call the user's callback
        callback(event)
      }

      // Register the event listener with Cal.com using official API
      window.Cal('on', {
        action: eventType,
        callback: eventHandler
      })

      isListening = true

      // Create a cleanup function
      removeListener = () => {
        try {
          if (window.Cal && window.Cal.loaded) {
            // Cal.com doesn't have a standard off method, so we try common approaches
            // Most Cal.com events are handled by the embed itself
            console.log(`[nuxt-calcom] Removing listener for: ${eventType}`)
          }
        } catch (error) {
          console.error('[nuxt-calcom] Failed to remove event listener:', error)
        }
        isListening = false
      }

      console.log(`[nuxt-calcom] Listening for event: ${eventType}${namespace ? ` (namespace: ${namespace})` : ''}`)
    } catch (error) {
      console.error('[nuxt-calcom] Failed to register event listener:', error)
    }
  }

  const stopListening = () => {
    if (removeListener) {
      removeListener()
      removeListener = null
    }
  }

  // Auto-start listening when component mounts
  onMounted(() => {
    startListening()
  })

  // Auto-cleanup when component unmounts
  onUnmounted(() => {
    stopListening()
  })

  return {
    startListening,
    stopListening,
    isListening: () => isListening
  }
}

/**
 * Convenience hooks for common Cal.com events
 */

export const useCalcomBookingSuccess = (
  callback: CalcomEventCallback,
  namespace?: string
) => {
  return useCalcomEventListener('bookingSuccessfulV2', callback, namespace)
}

export const useCalcomEventTypeSelected = (
  callback: CalcomEventCallback,
  namespace?: string
) => {
  return useCalcomEventListener('eventTypeSelected', callback, namespace)
}

export const useCalcomEventTypeViewed = (
  callback: CalcomEventCallback,
  namespace?: string
) => {
  return useCalcomEventListener('eventTypeViewed', callback, namespace)
}

export const useCalcomEmbedReady = (
  callback: CalcomEventCallback,
  namespace?: string
) => {
  return useCalcomEventListener('embedReady', callback, namespace)
} 