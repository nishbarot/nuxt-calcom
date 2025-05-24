import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  useCalcomEventListener,
  useCalcomBookingSuccess,
} from '../../../runtime/composables/useCalcomEventListener'
import { useNuxtApp } from '#app'

// Mock the dependencies
vi.mock('#app', () => ({
  useNuxtApp: vi.fn(() => ({
    $calcom: {
      waitForCal: vi.fn().mockResolvedValue(window.Cal),
    },
  })),
}))

describe('useCalcomEventListener', () => {
  let mockCal: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup window.Cal mock - create a proper mock function with properties
    mockCal = vi.fn()
    Object.assign(mockCal, {
      loaded: true,
    })

    // Update the existing Cal property instead of redefining it
    global.window.Cal = mockCal
  })

  describe('useCalcomEventListener', () => {
    it('should register event listener with Cal.com', async () => {
      const callback = vi.fn()

      const { startListening } = useCalcomEventListener('bookingSuccessfulV2', callback)

      await startListening()

      expect(mockCal).toHaveBeenCalledWith('on', {
        action: 'bookingSuccessfulV2',
        callback: expect.any(Function),
      })
    })

    it('should call callback when event is triggered', async () => {
      const callback = vi.fn()
      let registeredCallback: any

      mockCal.mockImplementation((action: string, options: any) => {
        if (action === 'on') {
          registeredCallback = options.callback
        }
      })

      const { startListening } = useCalcomEventListener('bookingSuccessfulV2', callback)
      await startListening()

      // Simulate event
      const eventData = { action: 'bookingSuccessfulV2', data: { bookingId: '123' } }
      registeredCallback(eventData)

      expect(callback).toHaveBeenCalledWith(eventData)
    })

    it('should filter events by namespace when provided', async () => {
      const callback = vi.fn()
      let registeredCallback: any

      mockCal.mockImplementation((action: string, options: any) => {
        if (action === 'on') {
          registeredCallback = options.callback
        }
      })

      const { startListening } = useCalcomEventListener(
        'bookingSuccessfulV2',
        callback,
        'test-namespace',
      )
      await startListening()

      // Simulate event with different namespace
      registeredCallback({ action: 'bookingSuccessfulV2', namespace: 'other-namespace', data: {} })
      expect(callback).not.toHaveBeenCalled()

      // Simulate event with correct namespace
      registeredCallback({ action: 'bookingSuccessfulV2', namespace: 'test-namespace', data: {} })
      expect(callback).toHaveBeenCalled()
    })

    it('should handle multiple event types', async () => {
      const bookingCallback = vi.fn()
      const selectionCallback = vi.fn()

      const { startListening: startBooking } = useCalcomEventListener(
        'bookingSuccessfulV2',
        bookingCallback,
      )
      const { startListening: startSelection } = useCalcomEventListener(
        'eventTypeSelected',
        selectionCallback,
      )

      await startBooking()
      await startSelection()

      expect(mockCal).toHaveBeenCalledWith('on', {
        action: 'bookingSuccessfulV2',
        callback: expect.any(Function),
      })

      expect(mockCal).toHaveBeenCalledWith('on', {
        action: 'eventTypeSelected',
        callback: expect.any(Function),
      })
    })

    it('should provide isListening status', async () => {
      const callback = vi.fn()

      const { startListening, isListening } = useCalcomEventListener(
        'bookingSuccessfulV2',
        callback,
      )

      expect(isListening()).toBe(false)

      await startListening()

      expect(isListening()).toBe(true)
    })

    it('should handle stopListening', async () => {
      const callback = vi.fn()

      const { startListening, stopListening, isListening } = useCalcomEventListener(
        'bookingSuccessfulV2',
        callback,
      )

      await startListening()
      expect(isListening()).toBe(true)

      stopListening()
      expect(isListening()).toBe(false)
    })
  })

  describe('convenience hooks', () => {
    it('should provide useCalcomBookingSuccess hook', async () => {
      const callback = vi.fn()

      const { startListening } = useCalcomBookingSuccess(callback)
      await startListening()

      expect(mockCal).toHaveBeenCalledWith('on', {
        action: 'bookingSuccessfulV2',
        callback: expect.any(Function),
      })
    })

    it('should handle namespace in convenience hooks', async () => {
      const callback = vi.fn()

      const { startListening } = useCalcomBookingSuccess(callback, 'test-namespace')
      await startListening()

      expect(mockCal).toHaveBeenCalledWith('on', {
        action: 'bookingSuccessfulV2',
        callback: expect.any(Function),
      })
    })
  })

  describe('error handling', () => {
    it('should handle Cal.com script loading errors gracefully', async () => {
      const callback = vi.fn()

      // Mock waitForCal to reject
      const mockNuxtApp = vi.mocked(useNuxtApp)
      mockNuxtApp.mockReturnValue({
        $calcom: {
          waitForCal: vi.fn().mockRejectedValue(new Error('Script failed to load')),
        },
      } as any)

      const { startListening } = useCalcomEventListener('bookingSuccessfulV2', callback)

      // Should not throw
      await expect(startListening()).resolves.toBeUndefined()
    })

    it('should handle missing Cal object gracefully', async () => {
      const callback = vi.fn()

      delete (window as any).Cal

      const { startListening } = useCalcomEventListener('bookingSuccessfulV2', callback)

      // Should not throw
      await expect(startListening()).resolves.toBeUndefined()
    })
  })
})
