import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { TaxCalculatorPage } from "./features/tax-calculator";
import { env } from "./config/env";

import "@/index.css";

const rootElement = document.getElementById("root");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: env.apiMaxRetries,
      retryDelay: (attempt) => {
        const delay = Math.min(1000 * 2 ** attempt, 5000);
        const jitter = Math.random() * 500;
        return delay + jitter;
      },
      staleTime: 1000 * 60 * 5, // 5 min
    },
  },
});

if (!rootElement) {
  throw new Error(
    'Root element not found. Ensure index.html contains <div id="root">.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <main className="min-h-screen bg-gray-50">
          <TaxCalculatorPage />
        </main>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);
