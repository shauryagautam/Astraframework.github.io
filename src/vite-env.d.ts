/// <reference types="vite/client" />

interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob<T = unknown>(pattern: string | string[], options?: {
    eager?: boolean;
    query?: string;
    import?: string;
    as?: string;
  }): Record<string, T>;
}
