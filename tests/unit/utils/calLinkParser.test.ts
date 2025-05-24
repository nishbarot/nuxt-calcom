import { describe, it, expect } from 'vitest'
import {
  parseCalLink,
  validateCalLink,
  parseAndValidateCalLink
} from '../../../runtime/utils/calLinkParser'

describe('calLinkParser', () => {
  describe('parseCalLink', () => {
    it('should return username as-is when no protocol or domain', () => {
      expect(parseCalLink('demo')).toBe('demo')
      expect(parseCalLink('user/30min')).toBe('user/30min')
      expect(parseCalLink('team-name/consultation')).toBe('team-name/consultation')
    })

    it('should parse full Cal.com URLs correctly', () => {
      expect(parseCalLink('https://cal.com/demo')).toBe('demo')
      expect(parseCalLink('https://cal.com/user/30min')).toBe('user/30min')
      expect(parseCalLink('https://cal.com/team/consultation')).toBe('team/consultation')
    })

    it('should handle URLs without protocol', () => {
      expect(parseCalLink('cal.com/demo')).toBe('demo')
      expect(parseCalLink('cal.com/user/meeting')).toBe('user/meeting')
    })

    it('should handle URLs with trailing slashes', () => {
      expect(parseCalLink('https://cal.com/demo/')).toBe('demo')
      expect(parseCalLink('https://cal.com/user/30min/')).toBe('user/30min')
    })

    it('should handle URLs with query parameters', () => {
      expect(parseCalLink('https://cal.com/demo?theme=dark')).toBe('demo')
      expect(parseCalLink('https://cal.com/user/30min?prefill=true')).toBe('user/30min')
    })

    it('should return fallback for invalid inputs', () => {
      expect(parseCalLink('')).toBe('demo')
      expect(parseCalLink('   ')).toBe('') // trimmed empty string
      expect(parseCalLink('https://example.com/demo')).toBe('https://example.com/demo') // returns trimmed input for non-cal.com URLs
    })

    it('should handle edge cases', () => {
      expect(parseCalLink('https://cal.com/')).toBe('demo')
      expect(parseCalLink('https://cal.com')).toBe('demo')
      expect(parseCalLink('cal.com')).toBe('demo')
    })
  })

  describe('validateCalLink', () => {
    it('should validate correct Cal.com links', () => {
      expect(validateCalLink('demo')).toBe(true)
      expect(validateCalLink('user')).toBe(true)
      expect(validateCalLink('user/30min')).toBe(true)
      expect(validateCalLink('team-name/consultation')).toBe(true)
      expect(validateCalLink('user_name/meeting-type')).toBe(true)
    })

    it('should reject invalid links', () => {
      expect(validateCalLink('')).toBe(false)
      expect(validateCalLink('   ')).toBe(false)
      expect(validateCalLink('https://cal.com/demo')).toBe(false)
      expect(validateCalLink('cal.com/demo')).toBe(false)
      expect(validateCalLink('user with spaces')).toBe(false)
      expect(validateCalLink('user@domain.com')).toBe(false)
    })

    it('should handle special characters correctly', () => {
      expect(validateCalLink('user-name')).toBe(true)
      expect(validateCalLink('user_name')).toBe(true)
      expect(validateCalLink('user/event-type')).toBe(true)
      expect(validateCalLink('user/event_type')).toBe(true)
      expect(validateCalLink('user@name')).toBe(false)
      expect(validateCalLink('user.name')).toBe(false)
    })
  })

  describe('parseAndValidateCalLink', () => {
    it('should parse and validate correct links', () => {
      expect(parseAndValidateCalLink('demo')).toBe('demo')
      expect(parseAndValidateCalLink('https://cal.com/user/30min')).toBe('user/30min')
      expect(parseAndValidateCalLink('cal.com/team/consultation')).toBe('team/consultation')
    })

    it('should return fallback for invalid links', () => {
      expect(parseAndValidateCalLink('', 'fallback')).toBe('demo')
      expect(parseAndValidateCalLink('invalid url', 'fallback')).toBe('fallback')
      expect(parseAndValidateCalLink('https://example.com/demo', 'fallback')).toBe('fallback')
    })

    it('should use default fallback when not provided', () => {
      expect(parseAndValidateCalLink('')).toBe('demo')
      expect(parseAndValidateCalLink('invalid url')).toBe('demo')
    })

    it('should handle complex scenarios', () => {
      expect(parseAndValidateCalLink('https://cal.com/user/30min?theme=dark')).toBe('user/30min')
      expect(parseAndValidateCalLink('https://cal.com/user/30min/', 'fallback')).toBe('user/30min')
      expect(parseAndValidateCalLink('https://notcal.com/user/30min', 'fallback')).toBe(
        'user/30min'
      )
      expect(parseAndValidateCalLink('https://example.org/meeting', 'fallback')).toBe('fallback')
    })
  })
})
