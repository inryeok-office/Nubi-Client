import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '../../shared/api/client';

import { getNearbyStops, getStopArrivals } from './api';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('transit API client', () => {
  it('uses the documented nearby stops endpoint and query parameters', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ stops: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await getNearbyStops({
      latitude: 35.1595,
      longitude: 126.8526,
      radiusMeters: 500,
      limit: 20,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/stops/nearby?latitude=35.1595&longitude=126.8526&radiusMeters=500&limit=20',
      expect.any(Object),
    );
  });

  it('uses the documented arrivals endpoint and preserves server error codes', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          code: 'UPSTREAM_ERROR',
          message: 'upstream unavailable',
        },
        502,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getStopArrivals(2607)).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
      code: 'UPSTREAM_ERROR',
    } satisfies Partial<ApiError>);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/stops/2607/arrivals',
      expect.any(Object),
    );
  });
});
