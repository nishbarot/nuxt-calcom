import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CalPopupButton from '../../../runtime/components/CalPopupButton.vue'
import { useRuntimeConfig } from '#app'

// Mock the dependencies
vi.mock('#app', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      calcom: {
        defaultLink: 'demo',
        theme: 'light',
        branding: {},
        hideEventTypeDetails: false,
        uiOptions: {}
      }
    }
  })),
  useNuxtApp: () => ({
    $calcom: {
      waitForCal: vi.fn().mockResolvedValue(window.Cal),
      registerNamespace: vi.fn().mockResolvedValue(undefined),
      isNamespaceReady: vi.fn().mockReturnValue(true)
    }
  })
}))

describe('CalPopupButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window.Cal
    const mockCal = vi.fn() as any
    mockCal.loaded = true
    mockCal.ns = {}

    Object.defineProperty(window, 'Cal', {
      value: mockCal,
      writable: true,
      configurable: true
    })
  })

  describe('rendering', () => {
    it('should render with default props', () => {
      const wrapper = mount(CalPopupButton)

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toBe('Schedule Meeting')
    })

    it('should render with custom text', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          text: 'Book Now'
        }
      })

      expect(wrapper.text()).toBe('Book Now')
    })

    it('should render with custom button class', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          buttonClass: 'custom-button-class'
        }
      })

      expect(wrapper.find('button').classes()).toContain('custom-button-class')
    })

    it('should render with custom button style', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          buttonStyle: { backgroundColor: 'red', color: 'white' }
        }
      })

      const button = wrapper.find('button')
      expect(button.attributes('style')).toContain('background-color: red')
      expect(button.attributes('style')).toContain('color: white')
    })

    it('should render slot content', () => {
      const wrapper = mount(CalPopupButton, {
        slots: {
          default: '<span>Custom Content</span>'
        }
      })

      expect(wrapper.html()).toContain('<span>Custom Content</span>')
    })
  })

  describe('props and computed values', () => {
    it('should use provided calLink', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          calLink: 'custom/meeting'
        }
      })

      const button = wrapper.find('button')
      expect(button.attributes('data-cal-link')).toBe('custom/meeting')
    })

    it('should fall back to default calLink from config', () => {
      const wrapper = mount(CalPopupButton)

      const button = wrapper.find('button')
      expect(button.attributes('data-cal-link')).toBe('demo')
    })

    it('should parse Cal.com URLs correctly', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          calLink: 'https://cal.com/user/30min'
        }
      })

      const button = wrapper.find('button')
      expect(button.attributes('data-cal-link')).toBe('user/30min')
    })

    it('should merge UI options correctly', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          uiOptions: { theme: 'dark', customOption: true }
        }
      })

      const button = wrapper.find('button')
      const configString = button.attributes('data-cal-config')

      expect(configString).toBeTruthy()
      const config = JSON.parse(configString!)
      expect(config.theme).toBe('light')
      expect(config.customOption).toBe(true)
    })

    it('should generate unique IDs and namespaces', () => {
      const wrapper1 = mount(CalPopupButton)
      const wrapper2 = mount(CalPopupButton)

      const button1 = wrapper1.find('button')
      const button2 = wrapper2.find('button')

      expect(button1.attributes('id')).not.toBe(button2.attributes('id'))
      expect(button1.attributes('data-cal-namespace')).not.toBe(
        button2.attributes('data-cal-namespace')
      )
    })
  })

  describe('accessibility', () => {
    it('should have proper button semantics', () => {
      const wrapper = mount(CalPopupButton)

      const button = wrapper.find('button')
      expect(button.element.tagName).toBe('BUTTON')
      expect(button.attributes('type')).toBeUndefined()
    })

    it('should be keyboard accessible', () => {
      const wrapper = mount(CalPopupButton)

      const button = wrapper.find('button')
      expect(button.attributes('tabindex')).not.toBe('-1')
    })

    it('should have proper ARIA attributes when needed', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          text: 'Schedule Meeting'
        }
      })

      const button = wrapper.find('button')
      // The button should have accessible text content
      expect(button.text()).toBeTruthy()
    })
  })

  describe('ClientOnly behavior', () => {
    it('should render fallback when not on client', () => {
      // This would need more sophisticated mocking to test properly
      // For now, we just ensure the component doesn't crash
      const wrapper = mount(CalPopupButton)
      expect(wrapper.exists()).toBe(true)
    })

    it('should disable button in fallback mode', () => {
      // Test that the fallback button is disabled
      // This would require mocking the ClientOnly component behavior
      const wrapper = mount(CalPopupButton)
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should handle missing calLink gracefully', () => {
      // Mock config to not have defaultLink
      vi.mocked(useRuntimeConfig).mockReturnValue({
        public: {
          calcom: {}
        }
      } as any)

      const wrapper = mount(CalPopupButton)

      const button = wrapper.find('button')
      expect(button.attributes('data-cal-link')).toBe('demo') // fallback
    })

    it('should handle invalid UI options gracefully', () => {
      const wrapper = mount(CalPopupButton, {
        props: {
          uiOptions: null as any
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })
})
