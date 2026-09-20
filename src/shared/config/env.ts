const parseTimeout = (value: string | undefined) => {
  const parsed = Number(value ?? 10_000);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10_000;
};

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || '/api',
  mapProviderApiKey: import.meta.env.VITE_MAP_PROVIDER_API_KEY?.trim() || null,
  apiTimeoutMs: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
} as const;
