import { defineNuxtPlugin } from 'nuxt/app'

interface CalFunction {
  (action: string, ...args: unknown[]): void
  loaded?: boolean
  ns?: Record<string, CalFunction>
  q?: unknown[]
  l?: (args: unknown[]) => void
}

declare global {
  interface Window {
    Cal?: CalFunction
  }
}

// Store for pending namespace registrations
const pendingNamespaces = new Map<string, Record<string, unknown>>()
const initializedNamespaces = new Set<string>()

export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (import.meta.server) return

  // Official Cal.com embed loader (exactly from their docs)
  const script = document.createElement('script')
  script.innerHTML = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (C.Cal.ns = C.Cal.ns || {}, C.Cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; C.Cal.l = C.Cal.l || function (ar) { ar.forEach(function (a) { p(C.Cal, a); }); }; })(window, "https://cal.com/embed.js", "init");`
  document.head.appendChild(script)

  // Perform global Cal.com initialization once the script is ready
  const performGlobalInit = () => {
    if (window.Cal && typeof window.Cal === 'function' && !window.Cal.loaded) {
      // The Cal.loaded flag is set by the embed script itself after its own setup.
      // We should make the global init call. The loader has already queued it if we use Cal("init", ...)
      // before embed.js is fully processed. Let's ensure it's explicitly done.
      console.log('[nuxt-calcom] Performing global Cal("init")')
      window.Cal('init', { origin: 'https://cal.com' })
      // Note: The loader itself might have already executed a queued "init" if one was pushed early.
      // This explicit call ensures it happens if no other Cal() calls were made to queue an init.
    } else if (window.Cal && window.Cal.loaded) {
      console.log('[nuxt-calcom] Cal.com already loaded and global init likely processed.')
    } else {
      setTimeout(performGlobalInit, 10) // Wait for Cal to be defined
    }
  }
  performGlobalInit()

  // Wait for Cal to be available and then initialize any pending namespaces
  const initializePendingNamespaces = () => {
    if (typeof window.Cal === 'function') {
      console.log('[nuxt-calcom] Cal.com script loaded, initializing pending namespaces...')

      // Initialize all pending namespaces IMMEDIATELY
      pendingNamespaces.forEach((config, namespace) => {
        if (!initializedNamespaces.has(namespace)) {
          console.log('[nuxt-calcom] Initializing namespace:', namespace)
          if (window.Cal) {
            window.Cal('init', namespace, { origin: 'https://cal.com' })
            initializedNamespaces.add(namespace)

            // Apply config immediately
            if (config && Object.keys(config).length > 0 && window.Cal.ns?.[namespace]) {
              console.log('[nuxt-calcom] Applying config to namespace:', namespace, config)
              window.Cal.ns[namespace]('ui', config)
            }
          }
        }
      })

      pendingNamespaces.clear()
      console.log('[nuxt-calcom] All pending namespaces initialized')
    } else {
      // Cal not ready yet, try again quickly
      setTimeout(initializePendingNamespaces, 10)
    }
  }

  // Start checking for Cal availability immediately
  setTimeout(initializePendingNamespaces, 10)

  // Provide global methods for namespace management
  const calcomPlugin = {
    waitForCal: (): Promise<CalFunction> => {
      return new Promise((resolve, reject) => {
        const checkCal = () => {
          if (typeof window.Cal === 'function') {
            resolve(window.Cal)
          } else {
            setTimeout(checkCal, 10)
          }
        }
        checkCal()

        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Cal.com script failed to load')), 10000)
      })
    },

    registerNamespace: (namespace: string, config?: Record<string, unknown>): Promise<void> => {
      return new Promise(resolve => {
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
            if (config && Object.keys(config).length > 0 && window.Cal.ns?.[namespace]) {
              console.log('[nuxt-calcom] Applying config to namespace:', namespace, config)
              window.Cal.ns[namespace]('ui', config)
            }

            console.log('[nuxt-calcom] Namespace ready:', namespace)
          } else {
            // Cal not ready yet, it will be initialized when Cal loads
            console.log('[nuxt-calcom] Namespace queued for initialization:', namespace)
          }

          resolve()
        } catch (error) {
          console.error('[nuxt-calcom] Failed to register namespace:', namespace, error)
          resolve() // Don't reject to avoid breaking the app
        }
      })
    },

    isNamespaceReady: (namespace: string): boolean => {
      return !!(
        initializedNamespaces.has(namespace) &&
        window.Cal?.ns &&
        typeof window.Cal.ns[namespace] === 'function'
      )
    },

    destroyNamespace: async (namespace: string): Promise<void> => {
      if (window.Cal && typeof window.Cal === 'function') {
        console.log(`[nuxt-calcom] Destroying Cal.com namespace: ${namespace}`)
        if (
          window.Cal.ns &&
          window.Cal.ns[namespace] &&
          typeof window.Cal.ns[namespace] === 'function'
        ) {
          window.Cal.ns[namespace]('destroy')
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete window.Cal.ns[namespace]
          console.log(`[nuxt-calcom] Namespace ${namespace} destroyed.`)
        }

        // Re-initialize the namespace to clear any state
        await new Promise(resolve => setTimeout(resolve, 50))
        window.Cal('init', namespace, { origin: 'https://cal.com' })
        console.log(`[nuxt-calcom] Namespace ${namespace} re-initialized after destruction.`)
      }
    },
  }

  return {
    provide: {
      calcom: calcomPlugin,
    },
  }
})
