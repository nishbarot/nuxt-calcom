# 🗓️ Nuxt Cal.com Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A powerful Nuxt 3 module for integrating [Cal.com](https://cal.com) scheduling widgets into your application with ease.

## ✨ Features

- 🎯 **Multiple Embed Types**: Inline widgets, popup buttons, and floating widgets
- 🔧 **Zero Configuration**: Works out of the box with sensible defaults
- 🎨 **Customizable**: Full control over styling and behavior
- 📱 **Responsive**: Mobile-friendly components
- 🚀 **Auto-imported Components**: No manual imports needed
- 🎪 **Event Listeners**: React to booking events with Vue composables
- 🔀 **SPA Ready**: Handles navigation and cleanup automatically
- 💡 **TypeScript**: Full type safety and intellisense
- 🎯 **Programmatic API**: Control Cal.com widgets via composables

## 📦 Installation

```bash
# Using npm
npm install nuxt-calcom

# Using yarn
yarn add nuxt-calcom

# Using pnpm
pnpm add nuxt-calcom
```

Add `nuxt-calcom` to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-calcom'],
  calcom: {
    defaultLink: 'your-username/meeting-type',
    theme: 'light'
  }
})
```

## 🚀 Quick Start

### Basic Inline Widget

```vue
<template>
  <CalInlineWidget cal-link="john/30min" />
</template>
```

### Popup Button

```vue
<template>
  <CalPopupButton 
    cal-link="john/consultation" 
    text="Book a Meeting"
  />
</template>
```

### Floating Widget

```vue
<template>
  <CalFloatingWidget 
    cal-link="john/quick-call"
    position="bottom-right"
    text="💬 Schedule"
  />
</template>
```

## ⚙️ Configuration

Configure default options in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-calcom'],
  calcom: {
    // Default Cal.com link (required)
    defaultLink: 'your-username/meeting-type',
    
    // Default embed type
    defaultEmbed: 'inline', // 'inline' | 'popup' | 'floating'
    
    // Theme
    theme: 'light', // 'light' | 'dark' | 'auto'
    
    // Branding
    branding: {
      brandColor: '#000000',
      darkBrandColor: '#ffffff'
    },
    
    // Hide event type details
    hideEventTypeDetails: false,
    
    // UI options
    uiOptions: {
      layout: 'month_view', // 'month_view' | 'week_view' | 'column_view'
      styles: {
        // Custom CSS properties
      }
    }
  }
})
```

## 🧩 Components

### `<CalInlineWidget>`

Embeds a calendar directly in your page.

```vue
<CalInlineWidget 
  cal-link="john/meeting"
  :height="600"
  :width="'100%'"
  :ui-options="{ theme: 'dark' }"
  :style="{ borderRadius: '12px' }"
/>
```

**Props:**
- `calLink?: string` - Cal.com link (falls back to defaultLink)
- `height?: string | number` - Widget height (default: '630px')
- `width?: string | number` - Widget width (default: '100%')
- `uiOptions?: object` - Cal.com UI customization options
- `style?: object` - Custom CSS styles

### `<CalPopupButton>`

A button that opens Cal.com in a modal popup.

```vue
<CalPopupButton 
  cal-link="jane/consultation"
  text="Schedule Consultation"
  button-class="custom-btn"
  :ui-options="{ hideEventTypeDetails: true }"
/>
```

**Props:**
- `calLink?: string` - Cal.com link
- `text?: string` - Button text (default: 'Schedule Meeting')
- `buttonClass?: string` - CSS class for styling
- `buttonStyle?: object` - Inline styles for button
- `uiOptions?: object` - Cal.com UI options

### `<CalFloatingWidget>`

A floating button positioned on the page.

```vue
<CalFloatingWidget 
  cal-link="team/demo"
  text="📅 Book Demo"
  position="bottom-left"
  :offset="{ x: 20, y: 20 }"
  :is-visible="showWidget"
/>
```

**Props:**
- `calLink?: string` - Cal.com link
- `text?: string` - Button text (default: '📅 Schedule')
- `position?: string` - Position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
- `offset?: object` - Positioning offset `{ x: number, y: number }`
- `isVisible?: boolean` - Show/hide widget
- `buttonClass?: string` - CSS class for styling
- `buttonStyle?: object` - Inline styles

## 🎪 Composables

### `useCalcom()`

Programmatically control Cal.com widgets.

```vue
<script setup>
const { openPopup, closePopup, isLoaded, waitForCal } = useCalcom()

const handleCustomBooking = async () => {
  await openPopup({
    calLink: 'john/special-meeting',
    uiOptions: {
      theme: 'dark',
      hideEventTypeDetails: true
    }
  })
}
</script>
```

**Methods:**
- `openPopup(options)` - Open a popup programmatically
- `closePopup(namespace?)` - Close popup
- `isLoaded()` - Check if Cal.com script is loaded
- `waitForCal()` - Promise that resolves when Cal.com is ready

### Event Listeners

Listen to Cal.com events with reactive composables:

```vue
<script setup>
import { 
  useCalcomBookingSuccess,
  useCalcomEventTypeSelected,
  useCalcomEmbedReady
} from 'nuxt-calcom'

// Listen for successful bookings
useCalcomBookingSuccess((event) => {
  console.log('Booking confirmed!', event.data)
  // Redirect, show toast, etc.
})

// Listen for event type selection
useCalcomEventTypeSelected((event) => {
  console.log('User selected:', event.data.eventType)
})

// Listen for embed ready
useCalcomEmbedReady((event) => {
  console.log('Calendar is ready!')
})
</script>
```

**Available Events:**
- `useCalcomBookingSuccess` - Booking completed
- `useCalcomEventTypeSelected` - User selected an event type
- `useCalcomEventTypeViewed` - User viewed an event type
- `useCalcomEmbedReady` - Embed finished loading

## 🎨 Styling

### Component Styling

Style components using CSS classes:

```vue
<template>
  <CalPopupButton 
    cal-link="john/meeting"
    button-class="my-custom-button"
  />
</template>

<style>
.my-custom-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-weight: bold;
}
</style>
```

### Global Styling

Customize via Cal.com's UI options:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  calcom: {
    uiOptions: {
      styles: {
        branding: {
          brandColor: "#000000"
        }
      },
      hideEventTypeDetails: false
    }
  }
})
```

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Develop with the playground
pnpm dev

# Build the module
pnpm build

# Run ESLint
pnpm lint

# Run tests
pnpm test
```

## 📝 Examples

### Full Example with Events

```vue
<template>
  <div>
    <!-- Inline booking -->
    <CalInlineWidget 
      cal-link="support/help"
      :height="500"
    />
    
    <!-- Custom popup button -->
    <CalPopupButton 
      cal-link="sales/demo"
      text="📞 Book Sales Call"
      @click="trackBookingAttempt"
    />
    
    <!-- Floating widget -->
    <CalFloatingWidget 
      cal-link="support/urgent"
      text="🆘 Urgent Help"
      position="bottom-right"
    />
  </div>
</template>

<script setup>
const { openPopup } = useCalcom()

// Track booking attempts
const trackBookingAttempt = () => {
  console.log('User clicked booking button')
}

// Listen for successful bookings
useCalcomBookingSuccess((event) => {
  // Send analytics event
  gtag('event', 'booking_completed', {
    event_category: 'engagement',
    event_label: event.data?.eventType
  })
  
  // Redirect to confirmation page
  await navigateTo('/booking-confirmed')
})

// Custom popup with dynamic data
const openDynamicBooking = () => {
  openPopup({
    calLink: `team/${route.params.teamSlug}`,
    uiOptions: {
      theme: 'dark',
      prefill: {
        name: user.value?.name,
        email: user.value?.email
      }
    }
  })
}
</script>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT License](./LICENSE)

## 🔗 Links

- [Cal.com](https://cal.com) - The open-source Calendly alternative
- [Documentation](https://docs.cal.com/embed)
- [Nuxt Modules](https://modules.nuxt.com)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-calcom/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-calcom

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-calcom.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-calcom

[license-src]: https://img.shields.io/npm/l/nuxt-calcom.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-calcom

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
