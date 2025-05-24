import { vi } from 'vitest'

// Ensure window object exists in test environment
if (typeof window === 'undefined') {
  global.window = {} as any
}

// Mock window.Cal for testing
const mockCal = vi.fn() as any
mockCal.loaded = true
mockCal.ns = {}

// Mock global window object - ensure it's properly set up
Object.defineProperty(global.window, 'Cal', {
  value: mockCal,
  writable: true,
  configurable: true
})

// Also set it directly for good measure
global.window.Cal = mockCal

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

// Mock DOM methods that might be used
Object.defineProperty(global.window, 'MutationObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn()
  })),
  configurable: true
})

// Mock setTimeout and setInterval for testing
vi.stubGlobal(
  'setTimeout',
  vi.fn(fn => fn())
)
vi.stubGlobal('setInterval', vi.fn())
vi.stubGlobal('clearInterval', vi.fn())
