# Income Tax Calculator

The income tax calculator built with React 19, TypeScript, and Tailwind CSS v4.  
Designed as a production-grade application showcasing clean architecture, comprehensive testing, and robust error handling.

## Get up and running

In order to run the API locally, please follow these instructions:

```bash
docker pull ptsdocker16/interview-test-server
docker run --init -p 5001:5001 -it ptsdocker16/interview-test-server
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev

# Run tests
pnpm test

# Run full validation (type-check + lint/format + test)
pnpm validate
```

## Architecture

### Directory Structure

```
src/
├── components/ui/          # Shared UI components (ErrorBoundary)
├── config/                 # Environment configuration and constraints
├── features/
│   └── tax-calculator/     # Feature module (self-contained)
│       ├── components/     # Presentational components
│       ├── hooks/          # State management (useTaxCalculation)
│       ├── services/       # API communication layer
│       ├── types/          # TypeScript types + Zod schemas
│       └── utils/          # Pure business logic (tax calculation)
├── lib/                    # Shared infrastructure (HTTP client, logger)
└── test/                   # Test utilities and fixtures
```

### Design Decisions

Architectural decisions are documented in [`docs/adr/`](./docs/adr/). Key highlights:

- **Feature-based modules** — code is organized by domain feature, not by file type. Each feature is self-contained with its own components, hooks, services, and tests.

- **Layered architecture** — clear separation between:
  - **UI layer** (components) — purely presentational, no business logic
  - **State layer** (hooks) — orchestrates data flow and state transitions
  - **Service layer** (services) — handles API communication
  - **Domain layer** (utils) — pure business logic, framework-agnostic

- **Pure functions for business logic** — the tax calculation is a pure function with no side effects, making it trivially testable and potentially reusable on a server.

### Error Handling Strategy

The application handles errors at multiple levels:

1. **Input validation** — Zod schemas validate both form input and API responses at the boundary.

2. **Network resilience** — The react-query retries failed requests with exponential backoff and jitter, handling the API's known random error behavior.

3. **Error classification** — `HttpError` (server errors), `TimeoutError`, `SchemaValidationError`, and `NetworkError` (connectivity issues) are each mapped to user-friendly messages.

4. **React Error Boundary** — Catches unhandled rendering errors with a recovery UI.

See [ADR-002](./docs/adr/002-error-handling-strategy.md) for the full rationale.

### Testing Strategy

Tests are organized in two tiers:

| Tier          | What                      | Tools            | Coverage                                       |
| ------------- | ------------------------- | ---------------- | ---------------------------------------------- |
| **Unit**      | Pure functions, utilities | Vitest           | Tax calculation, currency formatting           |
| **Component** | React components          | RTL + user-event | Form validation, results display, error states |

```bash
pnpm test              # Run all tests once
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage report
```

### Logging

Structured logger with configurable levels, scoped by module. Designed to be swapped for a production service (Datadog, Sentry) by overriding the output method.

## Scripts Reference

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start Vite dev server                    |
| `pnpm build`         | Type-check and build for production      |
| `pnpm test`          | Run test suite                           |
| `pnpm test:coverage` | Run tests with coverage report           |
| `pnpm check`         | Biome lint + format check                |
| `pnpm check:fix`     | Auto-fix lint + format issues            |
| `pnpm validate`      | Full CI validation (types + lint + test) |

## Tech Stack

| Category             | Tool                           | Version                    |
| -------------------- | ------------------------------ | -------------------------- |
| Framework            | React                          | 19                         |
| Language             | TypeScript                     | 6 (strict mode)            |
| Build                | Vite                           | 8 (Rolldown)               |
| State Management     | React Query                    | 5.99                       |
| HTTP Client          | Ky                             | 2.0                        |
| Styling              | Tailwind CSS                   | 4 (CSS-first, Vite plugin) |
| Validation           | Zod                            | 4.3                        |
| Forms                | React Hook Form                | 7.72                       |
| Testing              | Vitest + React Testing Library | 4.1                        |
| Linting & Formatting | Biome                          | 2.3                        |
| Package Manager      | pnpm                           | 9.15                       |
| Pre-commit           | Husky + lint-staged            | 9 / 15                     |
| CI                   | GitHub Actions                 | —                          |
