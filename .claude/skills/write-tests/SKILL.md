---
name: write-tests
description: >
  Write tests for any new or modified component, hook, or utility in favalv1_ui.
  Trigger this skill automatically after writing or changing any React component, API helper,
  or utility function — even if the user didn't explicitly ask for tests. Also trigger when
  the user says "add tests", "write tests", or "test this". Never leave new frontend code
  without test coverage.
---

# Write Tests — favalv1_ui (React + Vite)

## Setup

No test framework is installed yet. When writing the first test, install Vitest + React
Testing Library and wire them into Vite:

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Add to `vite.config.js`:

```js
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test-setup.js',
}
```

Create `src/test-setup.js`:

```js
import '@testing-library/jest-dom'
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

## File placement

Put test files next to the file they test:
- `src/pages/DonateSuggestPage.jsx` → `src/pages/DonateSuggestPage.test.jsx`
- `src/utils.js` → `src/utils.test.js`
- `src/api.js` → `src/api.test.js`

## Mocking the API

Always mock `src/api.js` in component tests — never hit the real backend:

```js
import { vi } from 'vitest'
vi.mock('../api', () => ({
  fetchAuthorFeeds: vi.fn(),
  voteForAuthorFeed: vi.fn(),
  createDonationCheckout: vi.fn(),
  fetchDonationSession: vi.fn(),
}))
```

Mock `react-router-dom` when testing components that use `useSearchParams` or `Link`:

```js
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]) }
})
```

## What to test for every component

- **Renders without crashing** — smoke test with minimal props
- **Loading state** — shows skeleton/spinner while async data is pending
- **Happy path** — data loads and the key UI elements are visible
- **Empty state** — correct message when API returns `[]`
- **User interactions** — button clicks, form submits call the right API function
- **Error handling** — API rejection shows an error message, doesn't crash

## What to test for utilities and API helpers

- Pure functions (e.g. `toSlug`): input → output, edge cases
- API helpers: mock `fetch`, assert correct URL, method, and body

## Run command

```bash
npm test
```

Always run this after writing tests to confirm they pass before reporting done.
