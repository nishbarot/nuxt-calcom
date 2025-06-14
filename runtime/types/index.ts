export interface CalFunction {
  (action: string, ...args: any[]): any
  loaded?: boolean
  ns?: Record<string, any>
  q?: unknown[]
  l?: (args: unknown[]) => void
}

export interface CalcomPlugin {
  waitForCal: () => Promise<CalFunction>
  registerNamespace: (namespace: string, config?: Record<string, unknown>) => Promise<void>
  isNamespaceReady: (namespace: string) => boolean
  destroyNamespace: (namespace: string) => Promise<void>
}

declare module '#app' {
  interface NuxtApp {
    $calcom: CalcomPlugin
  }
}

export {}
