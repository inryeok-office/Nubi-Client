import { env } from '../config/env';

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;
  readonly code?: string;

  constructor(message: string, status = 0, details?: unknown, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | null;
};

const getUrl = (path: string) => {
  if (/^https?:\/\//.test(path)) return path;
  return `${env.apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export async function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), env.apiTimeoutMs);

  try {
    const response = await fetch(getUrl(path), {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const isErrorPayload = typeof payload === 'object' && payload !== null;
      const message =
        isErrorPayload && 'message' in payload
          ? String(payload.message)
          : `API 요청에 실패했습니다. (${response.status})`;
      const code =
        isErrorPayload && 'code' in payload ? String(payload.code) : undefined;
      throw new ApiError(message, response.status, payload, code);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('API 요청 시간이 초과되었습니다.');
    }
    throw new ApiError('네트워크 요청을 처리하지 못했습니다.', 0, error);
  } finally {
    window.clearTimeout(timeout);
  }
}
