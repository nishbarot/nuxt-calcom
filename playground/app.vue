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
      <!-- CalPopupButton Examples -->
      <section class="widget-test-card">
        <h2>🎯 Popup Button</h2>
        <p class="widget-description">
          Opens the calendar in a modal popup when clicked. Fully customizable.
        </p>
        <div class="button-showcase">
          <!-- Default Button -->
          <div class="button-demo">
            <h3>Default Button</h3>
            <ClientOnly fallback-tag="div" fallback="Loading popup button...">
              <CalPopupButton
                :key="effectiveCalLink"
                :cal-link="effectiveCalLink"
                text="Schedule Meeting"
                variant="primary"
                size="medium"
                :has-icon="true"
                :show-ripple="true"
              >
                <template #icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </template>
              </CalPopupButton>
            </ClientOnly>
          </div>

          <!-- Variant Examples -->
          <div class="button-demo">
            <h3>Different Variants</h3>
            <div class="button-grid">
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Primary"
                variant="primary"
                size="small"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Secondary"
                variant="secondary"
                size="small"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Success"
                variant="success"
                size="small"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Warning"
                variant="warning"
                size="small"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Danger"
                variant="danger"
                size="small"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Outline"
                variant="outline"
                size="small"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Ghost"
                variant="ghost"
                size="small"
              />
            </div>
          </div>

          <!-- Size Examples -->
          <div class="button-demo">
            <h3>Different Sizes</h3>
            <div class="button-grid">
              <CalPopupButton :cal-link="effectiveCalLink" text="XS" size="xs" />
              <CalPopupButton :cal-link="effectiveCalLink" text="Small" size="small" />
              <CalPopupButton :cal-link="effectiveCalLink" text="Medium" size="medium" />
              <CalPopupButton :cal-link="effectiveCalLink" text="Large" size="large" />
              <CalPopupButton :cal-link="effectiveCalLink" text="XL" size="xl" />
            </div>
          </div>

          <!-- Shape Examples -->
          <div class="button-demo">
            <h3>Different Shapes</h3>
            <div class="button-grid">
              <CalPopupButton :cal-link="effectiveCalLink" text="Square" shape="square" />
              <CalPopupButton :cal-link="effectiveCalLink" text="Rounded" shape="rounded" />
              <CalPopupButton :cal-link="effectiveCalLink" text="Pill" shape="pill" />
            </div>
          </div>

          <!-- Fully Custom Button -->
          <div class="button-demo">
            <h3>Fully Customized</h3>
            <CalPopupButton
              :key="`custom-btn-${effectiveCalLink}`"
              :cal-link="effectiveCalLink"
              text="Custom Design"
              variant="custom"
              size="custom"
              shape="custom"
              :has-icon="true"
              icon-position="right"
              :show-ripple="true"
              :custom-colors="{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                hover: 'linear-gradient(45deg, #764ba2 0%, #667eea 100%)',
                active: 'linear-gradient(45deg, #5a67d8 0%, #553c9a 100%)',
                text: '#ffffff',
                shadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
              }"
              :custom-sizes="{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                iconSize: '1.5rem',
                height: '3.5rem',
              }"
              :custom-animations="{
                duration: '0.3s',
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                hoverScale: '1.05',
                activeScale: '0.95',
                rippleColor: 'rgba(255, 255, 255, 0.4)',
              }"
              border-radius="1rem"
              font-family="'Georgia', serif"
              font-weight="600"
              letter-spacing="0.05em"
            >
              <template #icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </template>
            </CalPopupButton>
          </div>

          <!-- Icon Only & Loading States -->
          <div class="button-demo">
            <h3>Special States</h3>
            <div class="button-grid">
              <CalPopupButton
                :cal-link="effectiveCalLink"
                :has-icon="true"
                :show-text="false"
                variant="primary"
                title="Icon Only"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Loading..."
                :loading="true"
                :has-icon="true"
                variant="secondary"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Disabled"
                :disabled="true"
                variant="outline"
              />
              <CalPopupButton
                :cal-link="effectiveCalLink"
                text="Full Width"
                :full-width="true"
                variant="success"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- CalInlineWidget Examples -->
      <section class="widget-test-card">
        <div class="inline-widget-header">
          <h2>📋 Inline Widget</h2>
          <div class="tabs">
            <button
              v-for="tab in inlineWidgetTabs"
              :key="tab.id"
              :class="{ 'active-tab': activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
        <p class="widget-description">
          Embeds the calendar directly in the page. Only one inline widget can be shown at a time.
        </p>
        <div class="inline-widget-content">
          <keep-alive>
            <CalInlineWidget v-bind="activeWidgetProps" />
          </keep-alive>
        </div>
      </section>
    </main>

    <!-- Default FAB -->
    <ClientOnly>
      <CalFloatingWidget
        :key="effectiveCalLink"
        :cal-link="effectiveCalLink"
        text="Book a Demo"
        position="bottom-right"
        size="large"
        variant="primary"
        :pulse="true"
        :show-ripple="true"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
        </template>
      </CalFloatingWidget>
    </ClientOnly>

    <!-- Fully Customized FAB Example -->
    <ClientOnly>
      <CalFloatingWidget
        :key="`custom-${effectiveCalLink}`"
        :cal-link="effectiveCalLink"
        text="Custom Design"
        position="bottom-left"
        size="custom"
        variant="custom"
        :pulse="true"
        :show-ripple="true"
        :custom-colors="{
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
          hover: 'linear-gradient(45deg, #ee5a24, #d63031)',
          text: '#ffffff',
          shadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
        }"
        :custom-sizes="{
          width: '80px',
          height: '80px',
          fontSize: '14px',
          padding: '0 20px',
          iconSize: '28px',
        }"
        :custom-animations="{
          duration: '0.4s',
          easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          pulseScale: '1.15',
          rippleColor: 'rgba(255, 255, 255, 0.5)',
        }"
        border-radius="20px"
        font-family="'Comic Sans MS', cursive"
        font-weight="bold"
        :z-index="10000"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </template>
      </CalFloatingWidget>
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
const activeTab = ref('default')

const config = useRuntimeConfig()
const configDefault = computed(() => {
  const calcomConfig = config.public.calcom as Record<string, unknown>
  return calcomConfig?.defaultLink || 'demo'
})

const effectiveCalLink = computed(() => {
  return userInputLink.value || configDefault.value
})

const inlineWidgetTabs = [
  { id: 'default', name: 'Default' },
  { id: 'dark', name: 'Dark Theme' },
  { id: 'styled', name: 'Custom Styled' },
  { id: 'compact', name: 'Compact' },
  { id: 'error', name: 'Error State' },
  { id: 'slots', name: 'Custom Slots' },
]

const activeWidgetProps = computed(() => {
  const calLink = effectiveCalLink.value
  const key = `${activeTab.value}-${calLink}`

  switch (activeTab.value) {
    case 'dark':
      return {
        key,
        calLink,
        theme: 'dark',
        height: 500,
        customColors: {
          background: '#111827',
          border: '#374151',
          text: '#f9fafb',
          accent: '#3b82f6',
        },
      }
    case 'styled':
      return {
        key,
        calLink,
        height: 600,
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        customColors: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '#8b5cf6',
          accent: '#f59e0b',
        },
        customAnimations: { duration: '0.5s', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      }
    case 'compact':
      return {
        key,
        calLink,
        height: 400,
        responsive: true,
        borderRadius: '0.75rem',
        customColors: { accent: '#10b981' },
      }
    case 'error':
      return {
        key: 'error-demo',
        calLink: 'nonexistent-user/invalid-link',
        height: 500,
        loadingText: '🚀 Launching your scheduling experience...',
        errorTitle: 'Oops! Something went wrong',
        retryButtonText: '🔄 Try Again',
        customColors: { loading: '#6366f1', error: '#ef4444', accent: '#8b5cf6' },
        loadingClass: 'custom-loading',
        errorClass: 'custom-error',
      }
    case 'slots':
      return {
        key,
        calLink,
        height: 500,
        disableDefaultStyles: true,
        containerClass: 'custom-minimal-widget',
        containerStyle: {
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      }
    default: // 'default'
      return { key, calLink, height: 500 }
  }
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

/* Button showcase styles */
.button-showcase {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.button-demo {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
}

.button-demo h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

@media (max-width: 768px) {
  .button-grid {
    flex-direction: column;
    align-items: stretch;
  }
}

/* CalInlineWidget Custom Demo Styles */
.custom-loading {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #8b5cf6;
  border-radius: 1rem;
}

.custom-error {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid #ef4444;
  border-radius: 1rem;
}

.custom-minimal-widget {
  transition: all 0.3s ease;
}

.custom-minimal-widget:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

.custom-spinner {
  font-size: 3rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.inline-widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transform: translateY(2px);
  transition: all 0.2s ease-in-out;
}

.tabs button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.tabs button.active-tab {
  color: #3b82f6;
  font-weight: 600;
  border-bottom-color: #3b82f6;
}

.inline-widget-content {
  margin-top: 1rem;
  min-height: 500px;
}
</style>
