# ADR-003: Testing Strategy

## Context

The assessment criteria explicitly call out automated testing. We need a testing approach that demonstrates coverage of business logic, UI behavior, and integration points while remaining maintainable.

## Decision

### Three-Tier Testing Pyramid

#### Tier 1: Unit Tests (Pure Logic)

**Target:** `utils/tax-calculator.ts`

The tax calculation is the core business logic. It is implemented as a pure function — no side effects, no dependencies, deterministic output. This makes it trivially testable with simple input/output assertions.

Test cases directly match the assessment's expected values:

- $0 → $0
- $50,000 → $7,500.00
- $100,000 → $17,739.17
- $1,234,567 → $385,587.65

These serve as both regression tests and documentation of the expected behavior.

#### Tier 2: Component Tests (User Behavior)

**Target:** `components/TaxForm.tsx`, `components/TaxResults.tsx`

Component tests use React Testing Library with `userEvent` to simulate real user interactions:

- Typing into inputs, selecting options, clicking buttons
- Verifying validation messages appear for invalid input
- Verifying results are displayed correctly
- Verifying loading/disabled states

Tests query by accessible roles and labels (not CSS classes or test IDs where possible), validating accessibility as a side effect.

### What We Don't Test

- **Styling** — Tailwind utility classes are tested by the Tailwind framework itself
- **Third-party libraries** — Zod, React internals
- **Trivial components** — Pure wrappers with no logic (e.g., barrel exports)
- **Network layer** — Services, HTTP client (Ky), and React Query hooks are thin wrappers over well-tested libraries. Retry, caching, and error handling are configured declaratively and validated through integration during development.

## Consequences

- **Positive:** High confidence in business logic correctness. Tests document expected behavior. CI prevents regressions.
- **Negative:** Mocking at module boundaries means refactoring internal structure can break tests. Acceptable trade-off for the isolation benefit.
