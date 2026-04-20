export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  logLevel: import.meta.env.VITE_LOG_LEVEL ?? "error",
  apiMaxRetries: Number(import.meta.env.VITE_API_MAX_RETRIES ?? 3),
};
