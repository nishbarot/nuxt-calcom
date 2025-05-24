import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCalcom } from '../../../runtime/composables/useCalcom'

// Mock the dependencies
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $calcom: {
      waitForCal: vi.fn().mockResolvedValue(window.Cal),
      registerNamespace: vi.fn().mockResolvedValue(undefined),
      isNamespaceReady: vi.fn().mockReturnValue(true),
    },
  }),
  useRuntimeConfig: () => ({
    public: {
      calcom: {
        defaultLink: 'demo',
        theme: 'light',
        branding: { brandColor: '#007BFF' },
        hideEventTypeDetails: false,
        uiOptions: { layout: 'month_view' },
      },
    },
  }),
}))

describe('useCalcom', () => {
  let mockCal: any

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Setup window.Cal mock - create a proper mock function with properties
    mockCal = vi.fn()
    Object.assign(mockCal, {
      loaded: true,
      ns: {},
    })

    // Update the existing Cal property instead of redefining it
    global.window.Cal = mockCal
  })

  describe('openPopup', () => {
    it('should open popup with default configuration', async () => {
      const { openPopup } = useCalcom()

      await openPopup()

      expect(mockCal).toHaveBeenCalledWith(
        'ui',
        expect.objectContaining({
          theme: 'light',
          branding: { brandColor: '#007BFF' },
          hideEventTypeDetails: false,
          layout: 'month_view',
        })
      )

      expect(mockCal).toHaveBeenCalledWith('preload', { calLink: 'demo' })
      expect(mockCal).toHaveBeenCalledWith('popup', { calLink: 'demo' })
    })

    it('should open popup with custom options', async () => {
      const { openPopup } = useCalcom()

      await openPopup({
        calLink: 'custom/meeting',
        uiOptions: { theme: 'dark' },
      })

      expect(mockCal).toHaveBeenCalledWith(
        'ui',
        expect.objectContaining({
          theme: 'dark',
          branding: { brandColor: '#007BFF' },
          hideEventTypeDetails: false,
          layout: 'month_view',
        })
      )

      expect(mockCal).toHaveBeenCalledWith('preload', { calLink: 'custom/meeting' })
      expect(mockCal).toHaveBeenCalledWith('popup', { calLink: 'custom/meeting' })
    })

    it('should handle namespace-based popup', async () => {
      const { openPopup } = useCalcom()

      // Setup namespace mock
      const namespaceMock = vi.fn()
      mockCal.ns = { 'test-namespace': namespaceMock }

      await openPopup({
        calLink: 'test/meeting',
        namespace: 'test-namespace',
        uiOptions: { theme: 'dark' },
      })

      expect(mockCal).toHaveBeenCalledWith('init', 'test-namespace', { origin: 'https://cal.com' })
      expect(namespaceMock).toHaveBeenCalledWith(
        'ui',
        expect.objectContaining({
          theme: 'dark',
        })
      )
      expect(namespaceMock).toHaveBeenCalledWith('popup', { calLink: 'test/meeting' })
    })

    it('should handle URL parsing for popup', async () => {
      const { openPopup } = useCalcom()

      await openPopup({
        calLink: 'https://cal.com/user/30min',
      })

      expect(mockCal).toHaveBeenCalledWith('preload', { calLink: 'user/30min' })
      expect(mockCal).toHaveBeenCalledWith('popup', { calLink: 'user/30min' })
    })
  })

  describe('closePopup', () => {
    it('should attempt to close popup', async () => {
      const { closePopup } = useCalcom()

      await closePopup()

      // closePopup doesn't have a standard Cal.com API, so we just ensure it doesn't throw
      expect(true).toBe(true)
    })

    it('should handle namespace-specific close', async () => {
      const { closePopup } = useCalcom()

      const namespaceMock = vi.fn()
      mockCal.ns = { 'test-namespace': namespaceMock }

      await closePopup('test-namespace')

      expect(namespaceMock).toHaveBeenCalledWith('close')
    })
  })

  describe('isLoaded', () => {
    it('should return true when Cal is loaded', () => {
      const { isLoaded } = useCalcom()

      expect(isLoaded()).toBe(true)
    })

    it('should return false when Cal is not loaded', () => {
      mockCal.loaded = false
      const { isLoaded } = useCalcom()

      expect(isLoaded()).toBe(false)
    })

    it('should return false when Cal is not available', () => {
      delete (window as any).Cal
      const { isLoaded } = useCalcom()

      expect(isLoaded()).toBe(false)
    })
  })

  describe('waitForCal', () => {
    it('should resolve when Cal is available', async () => {
      const { waitForCal } = useCalcom()

      const result = await waitForCal()

      expect(result).toBe(window.Cal)
    })
  })
})
