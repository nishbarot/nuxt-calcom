<div align="center">
  <img src="https://raw.githubusercontent.com/your-username/nuxt-calcom/main/.github/assets/logo.png" alt="Nuxt Cal.com Module Logo" width="150">
  <h1>🗓️ Nuxt Cal.com Module</h1>
  <p>
    <strong>The most powerful and flexible Cal.com integration for Nuxt 3.</strong>
  </p>
  <p>
    <a href="https://npmjs.com/package/nuxt-calcom"><img src="https://img.shields.io/npm/v/nuxt-calcom/latest.svg?style=flat-square&colorA=18181B&colorB=28CF8D" alt="npm version"></a>
    <a href="https://npmjs.com/package/nuxt-calcom"><img src="https://img.shields.io/npm/dm/nuxt-calcom.svg?style=flat-square&colorA=18181B&colorB=28CF8D" alt="npm downloads"></a>
    <a href="https://npmjs.com/package/nuxt-calcom"><img src="https://img.shields.io/npm/l/nuxt-calcom.svg?style=flat-square&colorA=18181B&colorB=28CF8D" alt="License"></a>
    <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js&style=flat-square" alt="Nuxt"></a>
  </p>
  <br>
</div>

A powerful Nuxt 3 module for integrating [Cal.com](https://cal.com) scheduling widgets into your application with ease.

---

## ✨ Features

- 🎯 **Multiple Embed Types**: Inline widgets, popup buttons, and floating widgets
- 🔧 **Zero Configuration**: Works out of the box with sensible defaults
- 🎨 **Highly Customizable**: Full control over styling and behavior via props, slots, and global config
- 📱 **Responsive Design**: Mobile-friendly components adapt to any screen size
- 🚀 **Auto-Imported Components**: Seamless integration, no manual imports needed
- 🎪 **Reactive Event Listeners**: Easily react to booking events with Vue composables
- 🔀 **SPA Ready**: Handles navigation and cleanup automatically in Single Page Applications
- 💡 **TypeScript Support**: Full type safety and autocompletion for a better developer experience
- 🛠️ **Programmatic API**: Control Cal.com widgets dynamically using composables

---

## 🚀 Quick Start

Get up and running with the Nuxt Cal.com module in minutes.

### 1. Installation

```bash
# Using npm
npm install nuxt-calcom

# Using yarn
yarn add nuxt-calcom

# Using pnpm
pnpm add nuxt-calcom
```

### 2. Module Configuration

Add `nuxt-calcom` to your `nuxt.config.ts` and provide your default Cal.com link:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-calcom'],

  calcom: {
    // Your default Cal.com link (e.g., your-username/event-type)
    defaultLink: 'demo' // Replace 'demo' with your actual Cal.com link

    // Optional: Default theme for all widgets
    // theme: 'light', // 'light' | 'dark' | 'auto'
  }
})
```

### 3. Usage Examples

Embed Cal.com widgets anywhere in your Nuxt application:

**Inline Widget:**

```vue
<template>
  <div>
    <h2>Book a Meeting</h2>
    <CalInlineWidget cal-link="your-username/30min" />
  </div>
</template>
```

**Popup Button:**

```vue
<template>
  <CalPopupButton
    cal-link="your-username/consultation"
    text="📅 Schedule Consultation"
    button-class="my-custom-button-class"
  />
</template>
```

**Floating Widget:**

```vue
<template>
  <!-- This will float over your page content -->
  <CalFloatingWidget
    cal-link="your-username/quick-call"
    position="bottom-right"
    text="💬 Quick Chat"
  />
</template>
```

---

## ⚙️ Global Configuration

Customize the default behavior of the module in your `nuxt.config.ts`:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-calcom'],

  calcom: {
    // REQUIRED: Default Cal.com link (e.g., your-username/meeting-type)
    defaultLink: 'your-username/event-type',

    // Default embed type if using a generic <CalWidget> (not yet implemented)
    // defaultEmbed: 'inline', // 'inline' | 'popup' | 'floating'

    // Global theme for all widgets
    theme: 'light', // 'light' | 'dark' | 'auto'

    // Global branding options
    branding: {
      brandColor: '#007BFF', // Your primary brand color
      darkBrandColor: '#1A8CFF' // Brand color for dark mode
    },

    // Hide event type details globally
    hideEventTypeDetails: false,

    // Default UI options applied to all widgets
    uiOptions: {
      layout: 'month_view' // 'month_view' | 'week_view' | 'column_view'
      // styles: { /* Custom CSS properties for advanced styling */ }
    }
  }
})
```

> **Note:** Providing `defaultLink` in the configuration is highly recommended. Components will fall back to this link if no `cal-link` prop is provided.

---

## 🧩 Components

The module provides auto-imported components for easy integration.

### `<CalInlineWidget>`

Embeds a Cal.com calendar directly into your page content.

```vue
<template>
  <section>
    <h3>Our Calendar</h3>
    <CalInlineWidget
      cal-link="team/product-demo"
      :height="700"
      :ui-options="{ theme: 'dark', layout: 'week_view' }"
      :style="{ border: '1px solid #eee', borderRadius: '12px' }"
    />
  </section>
</template>
```

**Key Props:**

- `calLink?: string`: Your Cal.com link (e.g., `username/event`). Falls back to `defaultLink` from module config.
- `height?: string | number`: Height of the widget (default: `630px`).
- `width?: string | number`: Width of the widget (default: `100%`).
- `uiOptions?: object`: Cal.com UI customization options (theme, layout, etc.).
- `style?: object`: Custom CSS styles to apply to the widget's container.

### `<CalPopupButton>`

Renders a button that, when clicked, opens the Cal.com scheduling interface in a modal popup.

```vue
<template>
  <CalPopupButton
    cal-link="sales/discovery-call"
    text="🚀 Book a Discovery Call"
    button-class="action-button primary-button"
    :ui-options="{ hideEventTypeDetails: true, theme: 'auto' }"
  >
    <!-- Optional: Custom content via slot -->
    <!-- <img src="/icons/calendar.svg" alt="" /> Schedule Now -->
  </CalPopupButton>
</template>
```

**Key Props:**

- `calLink?: string`: Your Cal.com link.
- `text?: string`: Text displayed on the button (default: `Schedule Meeting`). Can be overridden by slot.
- `buttonClass?: string`: Custom CSS class(es) for the button.
- `buttonStyle?: object`: Inline CSS styles for the button.
- `uiOptions?: object`: Cal.com UI options for the popup.

### `<CalFloatingWidget>`

Displays a floating button that remains visible on the page, opening a popup when clicked.

```vue
<template>
  <CalFloatingWidget
    cal-link="support/tech-issue"
    text="🆘 Get Support"
    position="bottom-left"
    :offset="{ x: 30, y: 30 }"
    :is-visible="true"
    variant="outline"
    size="large"
    animation="bounce"
  />
</template>
```

**Key Props:**

- `calLink?: string`: Your Cal.com link.
- `text?: string`: Text for the button (default: `📅 Schedule`). Can be overridden by slot.
- `position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'`: Position on the screen.
- `offset?: { x?: number, y?: number }`: Offset from the screen edges.
- `isVisible?: boolean`: Controls the visibility of the widget.
- `buttonClass?: string`: Custom CSS class(es).
- `buttonStyle?: object`: Inline CSS styles.
- `uiOptions?: object`: Cal.com UI options.
- `size?: 'small' | 'medium' | 'large'`: Predefined button sizes.
- `variant?: 'solid' | 'outline' | 'ghost'`: Predefined button styles.
- `rounded?: boolean`: If true, applies fully rounded corners.
- `shadow?: 'none' | 'small' | 'medium' | 'large'`: Shadow intensity.
- `animation?: 'slide' | 'fade' | 'bounce' | 'none'`: Entrance animation.

---

## 🛠️ Composables

Interact with and listen to Cal.com events programmatically.

### `useCalcom()`

Provides methods to control Cal.com widgets.

```vue
<script setup lang="ts">
const { openPopup, closePopup, isLoaded, waitForCal } = useCalcom()

async function showSpecialOfferBooking() {
  await waitForCal() // Ensure Cal.com script is loaded
  openPopup({
    calLink: 'marketing/special-offer',
    uiOptions: {
      theme: 'dark',
      hideEventTypeDetails: true,
      prefill: {
        name: 'Valued Customer',
        email: 'customer@example.com'
      }
    }
  })
}
</script>

<template>
  <button @click="showSpecialOfferBooking">Book Special Offer</button>
</template>
```

**Key Methods:**

- `openPopup(options)`: Opens a Cal.com scheduling popup. `options` can include `calLink` and `uiOptions`.
- `closePopup(namespace?)`: Closes an active popup. Optionally specify a namespace.
- `isLoaded()`: Returns `true` if the Cal.com embed script is loaded.
- `waitForCal()`: Returns a Promise that resolves when the Cal.com script is loaded and `window.Cal` is available.

### Event Listeners with `useCalcomEventListener()`

React to events triggered by the Cal.com widgets.

```vue
<script setup lang="ts">
import { useCalcomEventListener } from 'nuxt-calcom' // Or auto-imported

// On successful booking
useCalcomEventListener('bookingSuccessful', event => {
  console.log('Booking Confirmed:', event.data)
  // Example: Redirect to a thank you page or show a notification
  // navigateTo('/booking-confirmed');
})

// When an event type is selected by the user
useCalcomEventListener('eventTypeSelected', event => {
  console.log('Event Type Selected:', event.data.eventType)
})

// When the Cal.com embed is fully ready
useCalcomEventListener('embedReady', event => {
  console.log('Cal.com Embed is Ready:', event.data)
})
</script>
```

**Available Events (via `useCalcomEventListener(eventName, callback)`):**

- `bookingSuccessful`: Triggered after a booking is successfully completed.
- `eventTypeSelected`: When a user selects an event type from a list.
- `dateSelected`: When a user selects a date.
- `timeSelected`: When a user selects a time slot.
- `embedReady`: When the Cal.com embed iframe has loaded its content.
  _(This is a selection, refer to Cal.com embed documentation for a full list of actions.)_

---

## 🎨 Styling & Customization

Tailor the appearance of your Cal.com widgets.

### 1. Component Props

Most visual aspects can be controlled via component props:

- `buttonClass`, `buttonStyle` for buttons.
- `size`, `variant`, `rounded`, `shadow` for `CalFloatingWidget`.
- `uiOptions` on all components to pass Cal.com native styling (theme, brandColor, etc.).

```vue
<CalPopupButton
  button-class="my-primary-button large-text"
  :button-style="{ backgroundColor: '#FF5733', padding: '15px 30px' }"
  :ui-options="{ theme: 'dark', styles: { branding: { brandColor: '#FF5733' } } }"
/>
```

### 2. Slots for Custom Content

Use slots to inject custom HTML content into buttons.

**`CalPopupButton` Slot:**

```vue
<CalPopupButton cal-link="demo/30min">
  <template #default>
    <svg class="icon-calendar" width="20" height="20" viewBox="0 0 24 24">...</svg>
    <span>Book My Custom Meeting</span>
  </template>
</CalPopupButton>
```

**`CalFloatingWidget` Slot:**

```vue
<CalFloatingWidget cal-link="demo/chat">
  <template #default>
    <svg class="icon-chat" width="24" height="24" viewBox="0 0 24 24">...</svg>
    <span>Chat Now</span>
  </template>
</CalFloatingWidget>
```

### 3. Global Styling in `nuxt.config.ts`

Define global UI defaults like `theme` and `branding.brandColor` in your `calcom` module configuration.

```typescript
// nuxt.config.ts
calcom: {
  defaultLink: 'demo',
  theme: 'dark',
  branding: {
    brandColor: '#7F00FF' // Purple brand color
  },
  uiOptions: {
    styles: { /* Advanced global CSS overrides for Cal.com internals */ }
  }
}
```

### 4. CSS Custom Properties (Advanced)

For fine-grained control, you might be able to override some Cal.com internal styles if they use CSS custom properties, or by targeting specific classes (use with caution as Cal.com internal classes may change).

```css
/* Example: In your global CSS file */
:root {
  /* If Cal.com widgets were to use these (hypothetical) */
  /* --cal-embed-primary-color: #your-brand-color; */
  /* --cal-embed-border-radius: 10px; */
}

/* Targeting specific generated elements (inspect element to find classes) */
/* This is less robust and not generally recommended for external widgets */
/* .cal-embed-container iframe { border: 2px solid hotpink !important; } */
```

> **Recommendation**: Prefer using `uiOptions` and component props for styling, as directly targeting internal Cal.com classes can be brittle.

---

## 🛠️ Development Setup

If you want to contribute or work on this module locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/nuxt-calcom.git
cd nuxt-calcom

# 2. Install dependencies
pnpm install

# 3. Run the playground environment
pnpm dev

# This starts the Nuxt playground app where you can test components.
```

**Available Scripts:**

- `pnpm dev`: Starts the development playground.
- `pnpm build`: Builds the module for production.
- `pnpm lint`: Lints the codebase.
- `pnpm test`: Runs tests (if configured).

---

## 📄 License

[MIT License](./LICENSE)

---

## 🔗 Useful Links

- **[Cal.com Official Website](https://cal.com)**
- **[Cal.com Embed Documentation](https://cal.com/docs/embeds/introduction)**
- **[Nuxt Modules](https://nuxt.com/modules)**
- **[Report an Issue](https://github.com/your-username/nuxt-calcom/issues)**
- **[Contribute](https://github.com/your-username/nuxt-calcom/pulls)**

<!-- Badges section - these should be at the top but repeated here for structure -->
<!--
[npm-version-src]: https://img.shields.io/npm/v/nuxt-calcom/latest.svg?style=flat-square&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-calcom

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-calcom.svg?style=flat-square&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-calcom

[license-src]: https://img.shields.io/npm/l/nuxt-calcom.svg?style=flat-square&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-calcom

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js&style=flat-square
[nuxt-href]: https://nuxt.com
-->
