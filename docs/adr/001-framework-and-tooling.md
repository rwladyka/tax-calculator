# ADR-001: Framework and Tooling Choices

## Context

We need to build a tax calculator application structured as a production-grade app suitable for team collaboration. The tech stack should support scalability, testability, and developer experience.

## Decision

### Server State: React Query 5

Manages fetching, caching, retry, and state synchronization. Retry with backoff configured in QueryClient handles the API's random errors. Cache by queryKey avoids recalculations for the same year.

### HTTP Client: Ky

Addresses fetch API limitations: auto-rejects on 4xx/5xx, configurable timeout, .json() with Zod schema validation. Built-in retry disabled (retry: 0) to avoid conflict with React Query.

### Styling: Tailwind CSS v4

Tailwind v4 introduces a CSS-first configuration model — no `tailwind.config.js` required. The `@tailwindcss/vite` plugin provides tighter integration than the previous PostCSS approach, with automatic content detection and better performance.

### Validation: Zod

Runtime type validation with TypeScript type inference. Used for form input validation and API response validation.

### Linting & Formatting: Biome

Biome replaces the traditional ESLint + Prettier combination with a single Rust-based tool that handles both linting (480+ rules) and formatting (97% Prettier-compatible). Benefits:

- **Single dependency** instead of 6+ (eslint, prettier, parser, plugins, config-prettier)
- **Single config file** (`biome.json`) instead of `.eslintrc` + `.prettierrc`
- **10-100x faster** execution in CI
- **No conflicts** between linter and formatter (a common ESLint + Prettier pain point)
- **Built-in import sorting** — no need for `eslint-plugin-import`

**Alternatives considered:**

- **ESLint 9 + Prettier** — Mature ecosystem with more plugins, but the flat config migration adds complexity and the multi-tool coordination is error-prone. Would consider if we needed specialized plugins (e.g., `eslint-plugin-jsx-a11y`).

### Testing: Vitest 4 + React Testing Library

Vitest 4 is Vite-native, providing zero-config TypeScript/JSX support. Version 4 brings stable Browser Mode and visual regression testing, though we use jsdom for this project's scope.

### Package Manager: pnpm

pnpm provides faster installs, strict dependency resolution (no phantom dependencies), and efficient disk usage through content-addressable storage. The `--frozen-lockfile` flag in CI ensures reproducible builds.

### Code Quality: Husky + lint-staged

Pre-commit hooks run Biome on staged files only, providing fast feedback without blocking the developer workflow.

## Consequences

- **Positive:** Fast development cycle, unified linting/formatting, strong type safety, comprehensive testing, reproducible builds.
- **Negative:** Biome has fewer specialized rules than ESLint's plugin ecosystem. Acceptable for this project scope.
- **Risks:** Vite 8 with Rolldown is recent (March 2026); fallback to Vite 7 is straightforward if issues arise.
