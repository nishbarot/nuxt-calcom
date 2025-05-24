import { defineNuxtPlugin } from '#app'

declare global {
  interface Window {
    Cal?: any
  }
}

// Store for pending namespace registrations
const pendingNamespaces = new Map<string, Record<string, any>>()
const initializedNamespaces = new Set<string>()

export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (import.meta.server) return

  // Official Cal.com embed loader (exactly from their docs)
  const script = document.createElement('script')
  script.innerHTML = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (C.Cal.ns = C.Cal.ns || {}, C.Cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; C.Cal.l = C.Cal.l || function (ar) { ar.forEach(function (a) { p(C.Cal, a); }); }; })(window, "https://cal.com/embed.js", "init");`
  document.head.appendChild(script)

  // Wait for Cal to be available and then initialize any pending namespaces
  const initializePendingNamespaces = () => {
    if (typeof window.Cal === 'function') {
      console.log('[nuxt-calcom] Cal.com script loaded, initializing pending namespaces...')

      // Initialize all pending namespaces IMMEDIATELY
      pendingNamespaces.forEach((config, namespace) => {
        if (!initializedNamespaces.has(namespace)) {
          console.log('[nuxt-calcom] Initializing namespace:', namespace)
          window.Cal('init', namespace, { origin: 'https://cal.com' })
          initializedNamespaces.add(namespace)

          // Apply config immediately
          if (config && Object.keys(config).length > 0) {
            console.log('[nuxt-calcom] Applying config to namespace:', namespace, config)
            window.Cal.ns[namespace]('ui', config)
          }
        }
      })

      pendingNamespaces.clear()
      console.log('[nuxt-calcom] All pending namespaces initialized')
    }
    else {
      // Cal not ready yet, try again quickly
      setTimeout(initializePendingNamespaces, 10)
    }
  }

  // Start checking for Cal availability immediately
  setTimeout(initializePendingNamespaces, 10)

  // Provide global methods for namespace management
  const calcomPlugin = {
    waitForCal: (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const checkCal = () => {
          if (typeof window.Cal === 'function') {
            resolve(window.Cal)
          }
          else {
            setTimeout(checkCal, 10)
          }
        }
        checkCal()

        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Cal.com script failed to load')), 10000)
      })
    },

    registerNamespace: (namespace: string, config?: Record<string, any>): Promise<void> => {
      return new Promise(async (resolve) => {
        console.log('[nuxt-calcom] Registering namespace:', namespace)

        if (initializedNamespaces.has(namespace)) {
          console.log('[nuxt-calcom] Namespace already initialized:', namespace)
          resolve()
          return
        }

        // Store the namespace and config for immediate initialization when Cal loads
        pendingNamespaces.set(namespace, config || {})

        try {
          if (typeof window.Cal === 'function') {
            // Cal is already loaded, initialize immediately
            window.Cal('init', namespace, { origin: 'https://cal.com' })
            initializedNamespaces.add(namespace)
            pendingNamespaces.delete(namespace)

            // Apply config if provided
            if (config && Object.keys(config).length > 0) {
              console.log('[nuxt-calcom] Applying config to namespace:', namespace, config)
              window.Cal.ns[namespace]('ui', config)
            }

            console.log('[nuxt-calcom] Namespace ready:', namespace)
          }
          else {
            // Cal not ready yet, it will be initialized when Cal loads
            console.log('[nuxt-calcom] Namespace queued for initialization:', namespace)
          }

          resolve()
        }
        catch (error) {
          console.error('[nuxt-calcom] Failed to register namespace:', namespace, error)
          resolve() // Don't reject to avoid breaking the app
        }
      })
    },

    isNamespaceReady: (namespace: string): boolean => {
      return (
        initializedNamespaces.has(namespace)
        && window.Cal?.ns
        && typeof window.Cal.ns[namespace] === 'function'
      )
    },
  }

  return {
    provide: {
      calcom: calcomPlugin,
    },
  }
})
