<div align="center">
  <img src="https://raw.githubusercontent.com/nishbarot/nuxt-calcom/main/.github/assets/logo.png" alt="Nuxt Cal.com Module Logo" width="150">
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

A powerful Nuxt 3 module for integrating [Cal.com](https://cal.com) scheduling widgets into your application with enterprise-level customization and ease of use.

---

## ✨ Features

- 🎯 **Three Component Types**: `<CalInlineWidget>`, `<CalPopupButton>`, and `<CalFloatingWidget>`.
- 🎨 **100% Customizable**: From simple props to CSS custom properties, tailor every aspect of the widgets to match your brand. Use slots to inject your own custom content.
- 🚀 **Zero-Config Defaults**: Works out of the box with sensible, stylish presets.
- 📱 **Responsive & Accessible**: Mobile-first components with accessibility best practices built-in.
- ⚡ **Auto-Imported**: Seamless integration into your Nuxt project with no manual imports.
- 🛠️ **Programmatic API**: `useCalcom()` composable to control popups dynamically.
- 👂 **Event Listeners**: `useCalcomEventListener()` to react to booking events.
- 💡 **TypeScript Support**: Full type safety and autocompletion.

---

## 🚀 Quick Start

### 1. Installation

```bash
# Using pnpm
pnpm add nuxt-calcom

# Using npm
npm install nuxt-calcom

# Using yarn
yarn add nuxt-calcom
```

### 2. Module Configuration

Add `nuxt-calcom` to your `nuxt.config.ts` and set your default Cal.com link:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-calcom'],

  calcom: {
    // Your default Cal.com link (e.g., your-username/event-type)
    defaultLink: 'demo', // Replace 'demo' with your actual Cal.com link
  },
})
```

### 3. Usage Examples

Embed widgets anywhere. They are fully customizable, but work great out of the box.

**Inline Widget:**
Embeds a calendar directly in the page.

```vue
<template>
  <CalInlineWidget cal-link="your-username/30min" theme="dark" />
</template>
```

**Popup Button:**
A versatile button that opens the calendar in a modal.

```vue
<template>
  <CalPopupButton
    cal-link="your-username/consultation"
    variant="success"
    size="large"
    :has-icon="true"
  >
    📅 Schedule Consultation
  </CalPopupButton>
</template>
```

**Floating Widget:**
A floating action button (FAB) that stays visible on the page.

```vue
<template>
  <CalFloatingWidget
    cal-link="your-username/quick-call"
    position="bottom-right"
    variant="primary"
    :pulse="true"
  />
</template>
```

---

## 🎨 Styling & Customization

This module provides a powerful, layered customization system.

### Level 1: Presets (Easiest)

Use simple props for common styles. This is the fastest way to get a great-looking widget.

**Available on `<CalPopupButton>` and `<CalFloatingWidget>`:**

- `variant`: `primary`, `secondary`, `success`, `warning`, `danger`, `outline`, `ghost`
- `size`: `xs`, `small`, `medium`, `large`, `xl`
- `shape`: `square`, `rounded`, `pill` (for `CalPopupButton`)

```vue
<!-- A small, pill-shaped, secondary button -->
<CalPopupButton variant="secondary" size="small" shape="pill" />
```

### Level 2: Fine-Tuning Props

Override specific CSS properties directly.

**Available on all components:**

- `borderRadius`, `borderWidth`, `boxShadow`, `fontFamily`, etc.

```vue
<CalPopupButton border-radius="0" box-shadow="none" />
```

### Level 3: The `custom*` Props

For more complex overrides, use the `customColors`, `customSizes`, and `customAnimations` objects. These props give you access to the internal CSS variables.

```vue
<CalFloatingWidget
  :custom-colors="{
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
    hover: 'linear-gradient(45deg, #ee5a24, #d63031)',
    text: '#ffffff',
    shadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
  }"
  :custom-sizes="{
    width: '80px',
    height: '80px',
    iconSize: '28px',
  }"
/>
```

### Level 4: Slots for Custom Content

Replace the default text or icon with your own components or HTML.

```vue
<CalPopupButton>
  <template #icon>
    <img src="/my-cool-icon.svg" />
  </template>
  <span>Book a Super Custom Meeting</span>
</CalPopupButton>
```

### Level 5: Total Control

For ultimate control, set `disableDefaultStyles: true` and build your own design from scratch using the `buttonClass` and `buttonStyle` props.

```vue
<CalPopupButton :disable-default-styles="true" button-class="my-own-button-class" />
```

---

## 🧩 Components Reference

### `<CalInlineWidget>`

Embeds a calendar directly into the page.

**Key Props:**

- `calLink?: string`: Your Cal.com link.
- `height?: string | number`: Height of the widget container (default: `630px`).
- `theme?: 'light' | 'dark' | 'auto'`: The base theme for the widget.
- `customColors?: object`: Override theme colors (`background`, `border`, `text`, `accent`, etc.).
- `disableDefaultStyles?: boolean`: Disable all built-in styles for a clean slate.
- `containerClass?: string`: Custom class for the main container.
- `containerStyle?: object`: Custom inline styles for the main container.
- **Loading & Error Props**: Full control over loading and error states (`loadingText`, `errorTitle`, custom classes/styles, etc.).

**Slots:**

- `#loading-spinner`, `#loading-text`, `#error-icon`, `#error-text`

### `<CalPopupButton>`

A highly customizable button that opens a popup.

**Key Props:**

- `calLink?: string`: Your Cal.com link.
- **Presets**: `variant`, `size`, `shape`.
- **States**: `loading`, `disabled`.
- **Content**: `text`, `hasIcon`, `iconPosition`, `showText`.
- **Customization**: `customColors`, `customSizes`, `customAnimations`, `disableDefaultStyles`.
- **Overrides**: `buttonClass`, `buttonStyle`.

**Slots:**

- `#default`: For the button's main text content.
- `#icon`: For the button's icon.

### `<CalFloatingWidget>`

A floating action button that opens a popup.

**Key Props:**

- `calLink?: string`: Your Cal.com link.
- **Presets**: `variant`, `size`.
- **Positioning**: `position` (`bottom-right`, etc.), `zIndex`.
- **Animation & Effects**: `pulse`, `showRipple`, `entranceAnimation`.
- **Customization**: `customColors`, `customSizes`, `customAnimations`, `disableDefaultStyles`.
- **Overrides**: `buttonClass`, `buttonStyle`.

**Slots:**

- `#text`: For the button's text label.
- `#icon`: For the button's icon.

---

## 🛠️ Composables

Interact with and listen to Cal.com events programmatically.

### `useCalcom()`

Provides methods to control Cal.com widgets.

- `openPopup(options)`
- `closePopup()`
- `isLoaded()`
- `waitForCal()`

### `useCalcomEventListener()`

React to events triggered by the Cal.com widgets.

- `bookingSuccessful`
- `eventTypeSelected`
- `dateSelected`
- ...and more.

---

## ⚙️ Global Configuration

Set global defaults in `nuxt.config.ts`. Props on components will always override these settings.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-calcom'],

  calcom: {
    // REQUIRED: Default Cal.com link
    defaultLink: 'your-username/event-type',

    // Global theme for all widgets
    theme: 'light', // 'light' | 'dark' | 'auto'

    // Global branding colors (used by Cal.com's internals)
    branding: {
      brandColor: '#007BFF',
    },

    // Global UI options applied to all widgets
    uiOptions: {
      layout: 'month_view',
    },
  },
})
```

---

## Known Issues

- **One Inline Widget Per Page**: Due to a limitation in the official Cal.com embed script, you can only have **one** `<CalInlineWidget>` visible on a page at a time. If you need to display multiple, use a tabbed interface or conditional rendering (`v-if`) to ensure only one is mounted.
- **Floating Widget DOM Leak**: When the `calLink` of the `<CalFloatingWidget>` is changed reactively, the underlying Cal.com script may not properly clean up the old widget's button from the DOM. This can result in a temporary "ghost" button during re-rendering. The module ensures the user-facing functionality is correct, but this is a known limitation of the third-party script.

---

## 🛠️ Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/nishbarot/nuxt-calcom.git
cd nuxt-calcom

# 2. Install dependencies
pnpm install

# 3. Run the playground environment
pnpm dev
```

---

## 📄 License

[MIT License](./LICENSE)
