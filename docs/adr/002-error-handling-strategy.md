# ADR-002: Error Handling Strategy

## Context

The tax calculator API has two known error scenarios:

1. Only tax years 2019–2022 are supported (deterministic 404/error)
2. The `/tax-calculator/tax-year/{year}` endpoint throws errors randomly (transient failures)

The application must handle both gracefully without degrading the user experience.

## Decision

### Multi-Layer Error Handling

Errors are handled at four distinct layers, each with a specific responsibility:

#### Layer 1: Input Validation (Zod Schemas)

Invalid input is rejected **before** any network request is made. The `taxFormSchema` validates:

- Income is a non-negative number within a reasonable range
- Tax year is one of the supported values (2019–2022)

This prevents wasted API calls and provides immediate user feedback.

#### Layer 2: React Query (Retry with Backoff)

The `react-query` implements automatic retry for transient failures:

- **Retry condition:** Network errors and HTTP 5xx responses
- **No retry:** HTTP 4xx responses (client errors are not transient)
- **Backoff:** Exponential with jitter (`baseDelay * 2^attempt + random`)
- **Max retries:** Configurable via environment variable (default: 3)

The jitter prevents the "thundering herd" problem where multiple clients retry at exactly the same intervals, compounding server load.

#### Layer 3: Service Layer (Response Validation)

After a successful HTTP response, the service layer validates the response shape against a Zod schema. This guards against:

- API contract changes
- Corrupted responses
- Unexpected data formats

Invalid responses are treated as application errors, not silently consumed.

#### Layer 4: React Error Boundary

A top-level `ErrorBoundary` component catches unhandled rendering errors (e.g., a null pointer in a component). This prevents the entire application from white-screening and provides a recovery UI.
