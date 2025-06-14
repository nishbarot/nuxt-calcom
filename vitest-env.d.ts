/// <reference types="vitest/globals" />
/// <reference types="@vue/test-utils" />

// Ensure Vitest globals are available in the global scope
declare global {
  const describe: typeof import('vitest').describe
  const it: typeof import('vitest').it
  const test: typeof import('vitest').test
  const expect: typeof import('vitest').expect
  const vi: typeof import('vitest').vi
  const beforeEach: typeof import('vitest').beforeEach
  const afterEach: typeof import('vitest').afterEach
  const beforeAll: typeof import('vitest').beforeAll
  const afterAll: typeof import('vitest').afterAll

  // Cal.com API types
  interface Window {
    Cal?: {
      (action: string, ...args: any[]): any
      loaded?: boolean
      ns?: Record<string, any>
    }
  }
}

export {}
