/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_API_MAX_RETRIES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
