/**
 * Parses and normalizes Cal.com links to extract the username/slug part
 *
 * @param input - The Cal.com link input from user
 * @returns The normalized username/slug for Cal.com widgets
 */
export function parseCalLink(input: string): string {
  if (!input || typeof input !== 'string') {
    console.warn('[nuxt-calcom] Invalid calLink input:', input)
    return 'demo' // fallback
  }

  // Trim whitespace
  const trimmed = input.trim()

  // If it's already just a username/slug (no protocol/domain), return as-is
  if (!trimmed.includes('://') && !trimmed.includes('cal.com')) {
    return trimmed
  }

  try {
    // Handle different URL formats
    let url: URL

    // If it starts with a protocol, parse directly
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      url = new URL(trimmed)
    }
    // If it starts with cal.com but no protocol, add https://
    else if (trimmed.startsWith('cal.com')) {
      url = new URL(`https://${trimmed}`)
    }
    // If it contains cal.com somewhere, try to extract it
    else if (trimmed.includes('cal.com')) {
      const calComIndex = trimmed.indexOf('cal.com')
      const urlPart = trimmed.substring(calComIndex)
      url = new URL(`https://${urlPart}`)
    }
    else {
      // Fallback: assume it's already a username
      return trimmed
    }

    // Validate that it's actually a Cal.com domain
    if (!url.hostname.includes('cal.com')) {
      console.warn('[nuxt-calcom] URL is not from cal.com domain:', url.hostname)
      return trimmed // return original input as fallback
    }

    // Extract the pathname and clean it up
    let pathname = url.pathname

    // Remove leading slash
    if (pathname.startsWith('/')) {
      pathname = pathname.substring(1)
    }

    // Remove trailing slash
    if (pathname.endsWith('/')) {
      pathname = pathname.substring(0, pathname.length - 1)
    }

    // If pathname is empty, this might be just the domain
    if (!pathname) {
      console.warn('[nuxt-calcom] No username found in URL:', input)
      return 'demo' // fallback
    }

    // Return the clean pathname (username/event-type)
    return pathname
  }
  catch (error) {
    console.warn('[nuxt-calcom] Failed to parse Cal.com URL:', input, error)
    // Fallback: assume it's already a username
    return trimmed
  }
}

/**
 * Validates that a parsed Cal.com link looks reasonable
 * @param link - The parsed link
 * @returns true if the link appears valid
 */
export function validateCalLink(link: string): boolean {
  if (!link || typeof link !== 'string') {
    return false
  }

  const trimmed = link.trim()

  // Should not be empty
  if (!trimmed) {
    return false
  }

  // Should not contain protocols or domains (should be clean username/slug)
  if (trimmed.includes('://') || trimmed.includes('cal.com')) {
    return false
  }

  // Should not contain invalid characters for usernames
  // Cal.com usernames typically allow letters, numbers, hyphens, underscores, and forward slashes
  const validPattern = /^[a-zA-Z0-9\-_\/]+$/
  if (!validPattern.test(trimmed)) {
    return false
  }

  return true
}

/**
 * Parses and validates a Cal.com link, with fallback handling
 * @param input - The Cal.com link input
 * @param fallback - Fallback value if parsing fails (default: 'demo')
 * @returns A clean, validated Cal.com link
 */
export function parseAndValidateCalLink(input: string, fallback: string = 'demo'): string {
  const parsed = parseCalLink(input)

  if (validateCalLink(parsed)) {
    return parsed
  }

  console.warn('[nuxt-calcom] Parsed link failed validation, using fallback:', {
    input,
    parsed,
    fallback,
  })
  return fallback
}
