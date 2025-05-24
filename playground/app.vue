<template>
  <div class="playground">
    <header class="playground-header">
      <h1>🗓️ Nuxt Cal.com Module Playground</h1>
      <p>Testing all Cal.com embed components</p>
    </header>

    <main class="playground-content">
      <!-- Debug Info -->
      <section class="test-section">
        <h2>🔍 Debug Info</h2>
        <p><strong>Cal loaded:</strong> {{ isCalLoaded }}</p>
        <p><strong>Default link:</strong> demo</p>
        <p><strong>Window.Cal available:</strong> {{ isWindowCalAvailable }}</p>
      </section>

      <!-- Test Inline Widget -->
      <section class="test-section">
        <h2>📋 Inline Widget (Cal.com Demo)</h2>
        <p>Embedded calendar directly in the page using Cal.com's official demo</p>
        <CalInlineWidget 
          cal-link="demo" 
          :height="600"
          :ui-options="{ theme: 'light' }"
        />
      </section>

      <!-- Test Popup Button -->
      <section class="test-section">
        <h2>🎯 Popup Button (Cal.com Demo)</h2>
        <p>Click to open calendar in a modal using Cal.com's official demo</p>
        <CalPopupButton 
          cal-link="demo" 
          text="📅 Book with Cal.com Demo"
          button-class="custom-popup-btn"
        />
      </section>

      <!-- Alternative test with real user calendar -->
      <section class="test-section">
        <h2>👤 Real User Example</h2>
        <p>Testing with a real Cal.com user calendar</p>
        <CalPopupButton 
          cal-link="guchenhe/30min" 
          text="📅 Book 30min with Chenhe"
          button-class="custom-popup-btn-alt"
        />
      </section>
    </main>

    <!-- Test Floating Widget -->
    <CalFloatingWidget 
      cal-link="demo"
      text="Schedule time with me"
      position="bottom-right"
      :offset="{ x: 24, y: 24 }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Simple reactive state
const isCalLoaded = ref(false)
const isWindowCalAvailable = ref(false)

// Check if Cal is loaded periodically
const checkCalStatus = () => {
  if (typeof window !== 'undefined') {
    isWindowCalAvailable.value = !!window.Cal
    isCalLoaded.value = !!window.Cal && typeof window.Cal === 'function'
  }
}

onMounted(() => {
  // Check Cal status every second for first 30 seconds
  const interval = setInterval(checkCalStatus, 1000)
  
  // Also check immediately
  checkCalStatus()
  
  // Cleanup interval after 30 seconds
  setTimeout(() => clearInterval(interval), 30000)

  // Log when Cal.com script loads
  const observer = new MutationObserver(() => {
    if (window.Cal) {
      console.log('[playground] Cal.com script loaded!', window.Cal)
      checkCalStatus()
    }
  })
  
  observer.observe(document.head, { 
    childList: true, 
    subtree: true 
  })
})
</script>

<style scoped>
.playground {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333;
}

.playground-header {
  background: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.playground-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.playground-header p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.playground-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.test-section h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.test-section p {
  margin: 0 0 1.5rem 0;
  color: #666;
}

.custom-popup-btn {
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
}

.custom-popup-btn:hover {
  background: linear-gradient(135deg, #ee5a24 0%, #c23616 100%) !important;
}

.custom-popup-btn-alt {
  padding: 1rem 2rem !important;
  font-size: 1.1rem !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.custom-popup-btn-alt:hover {
  background: linear-gradient(135deg, #764ba2 0%, #5a67d8 100%) !important;
}
</style> 