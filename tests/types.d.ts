// Type declarations for test dependencies
/// <reference types="vitest/globals" />

declare module 'vitest' {
  export * from 'vitest/dist/index'
}

declare module '@vue/test-utils' {
  export * from '@vue/test-utils/dist/vue-test-utils'
}

declare module 'axe-core' {
  export function configureAxe(config: any): any
  export function toHaveNoViolations(): any
}

declare module '#app' {
  export function useRuntimeConfig(): any
  export function useNuxtApp(): any
}

// Ensure Vitest globals are available
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
}
