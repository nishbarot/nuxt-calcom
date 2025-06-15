<template>
  <div class="dev-playground">
    <header class="playground-header">
      <h1>🧪 Nuxt Cal.com Module - Dev Playground</h1>
      <p>A simple environment to test module components and features.</p>
    </header>

    <section class="controls-section">
      <div class="input-group">
        <label for="calLinkInput">Enter Cal.com Link:</label>
        <input
          id="calLinkInput"
          v-model.trim="userInputLink"
          type="text"
          placeholder="demo-user or https://cal.com/demo-user/30min"
        />
        <div
          v-if="inputValidation"
          class="input-validation"
          :class="{ valid: inputValidation.isValid, invalid: !inputValidation.isValid }"
        >
          <span class="validation-icon">{{ inputValidation.isValid ? '✅' : '❌' }}</span>
          <span class="validation-message">{{ inputValidation.message }}</span>
        </div>
        <div class="input-help">
          <p><strong>Supported formats:</strong></p>
          <ul>
            <li><code>demo-user</code></li>
            <li><strong>Username with event:</strong></li>
            <li><code>demo-user/30min</code></li>
          </ul>
          <p class="description">
            <em>The module automatically normalizes all formats to work with Cal.com widgets.</em>
          </p>
        </div>
      </div>
      <div class="status-info">
        <p>
          <strong>Status:</strong>
          <span :class="{ ok: isCalLoaded, 'not-ok': !isCalLoaded }">
            Cal.com Script {{ isCalLoaded ? 'Loaded' : 'Not Loaded' }}
          </span>
        </p>
        <p>
          <strong>Current Link for Widgets:</strong> <code>{{ effectiveCalLink }}</code>
        </p>
        <p v-if="userInputLink && userInputLink !== effectiveCalLink" class="normalization-info">
          <strong>Normalized from:</strong> <code>{{ userInputLink }}</code> →
          <code>{{ effectiveCalLink }}</code>
        </p>
      </div>
    </section>

    <main class="widgets-area">
      <!-- Inline Widget -->
      <section class="widget-test-card">
        <h2>📋 Inline Widget</h2>
        <p class="widget-description">
          Embeds the calendar directly in the page. Try pasting a full Cal.com URL above!
        </p>
        <ClientOnly fallback-tag="div" fallback="Loading inline widget...">
          <CalInlineWidget
            :key="effectiveCalLink"
            :cal-link="effectiveCalLink"
            :height="500"
            style="border: 1px solid #ccc; border-radius: 8px; min-height: 500px"
          />
        </ClientOnly>
      </section>

      <!-- Popup Button -->
      <section class="widget-test-card">
        <h2>🎯 Popup Button</h2>
        <p class="widget-description">Opens the calendar in a modal popup when clicked.</p>
        <ClientOnly fallback-tag="div" fallback="Loading popup button...">
          <CalPopupButton
            :key="effectiveCalLink"
            :cal-link="effectiveCalLink"
            :text="`Book: ${effectiveCalLink}`"
            button-class="test-popup-button"
          />
        </ClientOnly>
      </section>

      <!-- Floating Widget is always present -->
    </main>

    <ClientOnly>
      <CalFloatingWidget
        :key="effectiveCalLink"
        :cal-link="effectiveCalLink"
        :text="`Float: ${effectiveCalLink}`"
        position="bottom-right"
        :offset="{ x: 20, y: 20 }"
      />
    </ClientOnly>

    <footer class="playground-footer">
      <p>Nuxt Cal.com Module - Development Playground</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

const userInputLink = ref('')
const isCalLoaded = ref(false)
const inputValidation = ref<{ isValid: boolean; message: string } | null>(null)

// Get the default link from Nuxt config
const config = useRuntimeConfig()
const configDefault = computed(() => {
  const calcomConfig = config.public.calcom as Record<string, unknown>
  return calcomConfig?.defaultLink || 'demo'
})

// Validate user input
const validateInput = (input: string) => {
  if (!input.trim()) {
    inputValidation.value = null
    return
  }

  const trimmed = input.trim()

  // Check if it's an email - more accurate regex that requires proper email format
  // Must start with alphanumeric, not @, and have proper email structure
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/
  if (emailRegex.test(trimmed)) {
    inputValidation.value = {
      isValid: false,
      message: 'Email addresses are not supported. Please enter a Cal.com username or URL instead.',
    }
    return
  }

  // Check if it starts with @ but is not an email (like @https://...)
  if (trimmed.startsWith('@') && !emailRegex.test(trimmed)) {
    inputValidation.value = {
      isValid: false,
      message: 'URLs starting with @ are not valid. Please remove the @ symbol.',
    }
    return
  }

  // Check if it's a valid Cal.com format
  const isUrl = trimmed.includes('://') || trimmed.includes('cal.com')
  const isUsername = /^[a-zA-Z0-9\-_/]+$/.test(trimmed)

  if (isUrl) {
    if (trimmed.includes('cal.com')) {
      inputValidation.value = {
        isValid: true,
        message: 'Valid Cal.com URL detected',
      }
    } else {
      inputValidation.value = {
        isValid: false,
        message: 'Please enter a Cal.com URL or username',
      }
    }
  } else if (isUsername) {
    inputValidation.value = {
      isValid: true,
      message: 'Valid Cal.com username format',
    }
  } else {
    inputValidation.value = {
      isValid: false,
      message: 'Invalid format. Use: username, username/event, or https://cal.com/username',
    }
  }
}

// Determine the effective calLink to use
const effectiveCalLink = computed(() => {
  return userInputLink.value || configDefault.value
})

const checkCalStatus = () => {
  if (typeof window !== 'undefined') {
    isCalLoaded.value = !!(window.Cal && typeof window.Cal === 'function')
  }
}

watch(userInputLink, newValue => {
  validateInput(newValue)
  // Don't force re-render - let widgets reactively update their calLink prop
  console.log(`[Playground] Input changed:`, {
    userInput: newValue,
    effectiveLink: effectiveCalLink.value,
    configDefault: configDefault.value,
  })
})

onMounted(() => {
  checkCalStatus()
  const interval = setInterval(checkCalStatus, 1000)
  setTimeout(() => clearInterval(interval), 30000) // Check for 30s

  const observer = new MutationObserver(() => {
    if (window.Cal) {
      checkCalStatus()
      if (!isCalLoaded.value) {
        // To avoid logging multiple times if already loaded
        console.log('[Playground] Cal.com script now loaded!')
      }
      isCalLoaded.value = true
    }
  })
  observer.observe(document.head, { childList: true, subtree: true })
})
</script>

<style scoped>
.dev-playground {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f7f9;
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.playground-header {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  margin-bottom: 1.5rem;
}

.playground-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.playground-header p {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
}

.controls-section {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.input-group input[type='text'] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-group input[type='text']:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.input-validation {
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-validation.valid {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.input-validation.invalid {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.validation-icon {
  font-size: 1rem;
}

.validation-message {
  flex: 1;
}

.input-help {
  margin-top: 0.75rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.input-help p {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.input-help ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.input-help li {
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
}

.input-help code {
  background-color: #e5e7eb;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.8rem;
}

.status-info {
  font-size: 0.9rem;
  color: #4b5563;
}

.status-info code {
  background-color: #e5e7eb;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.status-info .ok {
  color: #10b981;
  font-weight: bold;
}

.status-info .not-ok {
  color: #ef4444;
  font-weight: bold;
}

.normalization-info {
  color: #059669 !important;
  font-style: italic;
}

.widgets-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  flex-grow: 1;
}

.widget-test-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.widget-test-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.widget-description {
  margin: 0 0 1rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.test-popup-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.test-popup-button:hover {
  background-color: #2563eb;
}

.playground-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.85rem;
  color: #6b7280;
}

.playground-footer small {
  display: block;
  margin-top: 0.5rem;
  color: #9ca3af;
}
</style>
