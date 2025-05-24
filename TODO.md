# TODO - Nuxt Cal.com Module

## High Priority 🟥

*No critical issues at the moment.*

## Medium Priority 🟨

- Add unit tests for components and composables
- Add integration tests with actual Cal.com embeds
- Create TypeScript declaration files for module exports
- Set up ESLint and Prettier configuration
- Add Continuous Integration (GitHub Actions)
- Test module with different Cal.com plans (free vs paid)
- Add error boundary handling for failed script loads
- Optimize bundle size and lazy loading
- Add support for Cal.com prefill data
- Create documentation website with examples
- Test accessibility (a11y) compliance
- Add support for custom namespaces in components
- Implement SSR safety checks
- Add support for multiple Cal.com accounts
- Create migration guide from raw embed code
- Add performance monitoring and analytics
- Test with different Nuxt deployment targets
- Add support for Cal.com webhooks integration
- Create video tutorials and demos
- Prepare for npm publishing and Nuxt Modules registry

## Completed Tasks ✅

### 01/25/2024

- ✅ Fixed inline widget element detection using ClientOnly wrapper and proper DOM timing
- ✅ Added comprehensive debugging logs to track initialization process
- ✅ Implemented retry logic with proper error handling for element detection
- ✅ Fixed hydration issues by ensuring client-side only rendering
- ✅ Added loading placeholder with spinner for better UX
- ✅ Inline widget now works properly with Cal.com demo account
- ✅ Fixed namespace initialization for popup buttons to prevent "Namespace isn't defined" errors
- ✅ Fixed official Cal.com embed implementation using proper loader script
- ✅ Updated plugin to use exact Cal.com embed script pattern from documentation
- ✅ Fixed auto-import issues for composables in playground
- ✅ Updated all components to use window.Cal API directly as per Cal.com docs
- ✅ Changed default cal-link to 'demo' (Cal.com's own booking page) for testing
- ✅ Fixed TypeScript errors in runtime config access
- ✅ Added proper namespace handling for popup buttons
- ✅ Updated composables to use official Cal.com API methods
- ✅ Added compatibility date to nuxt.config to resolve warnings
- ✅ Implemented proper Cal.com preload and popup methods
- ✅ Created basic Nuxt module structure with defineNuxtModule
- ✅ Implemented CalInlineWidget component with Vue 3 Composition API
- ✅ Implemented CalPopupButton component with custom styling
- ✅ Implemented CalFloatingWidget component with positioning
- ✅ Created plugin for Cal.com script injection
- ✅ Built useCalcom composable for programmatic control
- ✅ Built useCalcomEventListener composable for event handling
- ✅ Added TypeScript support with proper interfaces
- ✅ Created playground application for testing
- ✅ Set up package.json with proper module configuration
- ✅ Implemented global configuration via nuxt.config.ts
- ✅ Added auto-import support for components (Cal prefix)
- ✅ Created comprehensive README.md with examples
- ✅ Added SPA navigation handling and cleanup
- ✅ Implemented unique ID generation for embed containers
- ✅ Added reactive configuration merging from props and global config
- ✅ Created event listener cleanup on component unmount
- ✅ Added comprehensive error handling and logging
- ✅ Implemented responsive design for all components
- ✅ Added custom styling props for components 