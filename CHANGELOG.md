# Changelog

## v1.1.2

[compare changes](https://github.com/nishbarot/nuxt-calcom/compare/v1.1.1...v1.1.2)

## v1.1.1

[compare changes](https://github.com/nishbarot/nuxt-calcom/compare/v1.1.0...v1.1.1)

## v1.1.0

### 🚀 Enhancements

- Set up complete development tooling infrastructure ([c8cd1b3](https://github.com/nishbarot/nuxt-calcom/commit/c8cd1b3))

### 🩹 Fixes

- Update husky pre-commit hook and finalize linting setup ([872c5df](https://github.com/nishbarot/nuxt-calcom/commit/872c5df))
- Update GitHub Actions workflow configuration - Updated PNPM version from 8 to 10 to match lockfile - Updated Node.js version to 20 for better compatibility - Removed Node 16 support (EOL) - Updated action versions to latest (v4) - Added format:check step to lint job - Temporarily disabled accessibility tests (no test files) - Fixed repository URL in package.json ([00f1f10](https://github.com/nishbarot/nuxt-calcom/commit/00f1f10))
- Resolve pnpm action-setup configuration issues - Fixed pnpm version parameter to use string format ('10' instead of 10) - Added alternative corepack-based workflow as backup solution - Maintained proper Node.js and cache configuration - All workflows now properly configured for PNPM v10 ([347dc63](https://github.com/nishbarot/nuxt-calcom/commit/347dc63))
- Reorder workflow steps for proper pnpm setup - Moved pnpm/action-setup BEFORE actions/setup-node as recommended - Added simple validation workflow for testing pnpm setup - This should resolve 'Unable to locate executable file: pnpm' errors - Follows official pnpm/action-setup@v4 documentation pattern ([e459737](https://github.com/nishbarot/nuxt-calcom/commit/e459737))
- Resolve pnpm workflow step ordering issues - Ensured pnpm/action-setup runs before actions/setup-node as per documentation - Updated all relevant workflows to maintain proper execution order - Created validation workflow for independent pnpm setup testing - This addresses "Unable to locate executable file: pnpm" errors across all jobs ([a2171e0](https://github.com/nishbarot/nuxt-calcom/commit/a2171e0))
- Update ESLint configuration and clean up code formatting ([c9b5c44](https://github.com/nishbarot/nuxt-calcom/commit/c9b5c44))
- Update GitHub Actions workflow to trigger on push to main branch and remove .eslintignore file ([97a19ba](https://github.com/nishbarot/nuxt-calcom/commit/97a19ba))
- Update GitHub Actions workflow to improve CI process ([6cbe95e](https://github.com/nishbarot/nuxt-calcom/commit/6cbe95e))
- Update package.json and pnpm-lock.yaml for TypeScript and add unbuild dependency ([7e40230](https://github.com/nishbarot/nuxt-calcom/commit/7e40230))
- Clean up ESLint configuration and improve code consistency ([c9e99af](https://github.com/nishbarot/nuxt-calcom/commit/c9e99af))
- Resolve all linting errors and improve CI compatibility ([97f2550](https://github.com/nishbarot/nuxt-calcom/commit/97f2550))
- Resolve Prettier/ESLint conflicts and finalize CI formatting ([89e2c71](https://github.com/nishbarot/nuxt-calcom/commit/89e2c71))
- Enhance Playwright configuration and improve integration test reliability ([708cb1f](https://github.com/nishbarot/nuxt-calcom/commit/708cb1f))
- Enhance Cal.com widget functionality and input validation ([3dd51a9](https://github.com/nishbarot/nuxt-calcom/commit/3dd51a9))
- Refactor CalInlineWidget for improved structure and performance ([340cad5](https://github.com/nishbarot/nuxt-calcom/commit/340cad5))
- Update TypeScript configuration and enhance Cal.com integration ([aa68939](https://github.com/nishbarot/nuxt-calcom/commit/aa68939))
- Enhance TypeScript support and improve Cal.com widget integration ([a0d6cfc](https://github.com/nishbarot/nuxt-calcom/commit/a0d6cfc))
- Improve Cal.com link handling and enhance input validation ([996a46b](https://github.com/nishbarot/nuxt-calcom/commit/996a46b))

### 🏡 Chore

- Trigger CI workflow for debugging ([5b07d1f](https://github.com/nishbarot/nuxt-calcom/commit/5b07d1f))

### ❤️ Contributors

- Nish Barot ([@nishbarot](http://github.com/nishbarot))
