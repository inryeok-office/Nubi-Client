import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCurrentLocation } from './useCurrentLocation';

const originalGeolocation = navigator.geolocation;

afterEach(() => {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: originalGeolocation,
  });
});

describe('useCurrentLocation', () => {
  it('returns the browser position after a successful request', () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({
        coords: {
          latitude: 35.1595,
          longitude: 126.8526,
          accuracy: 12,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: () => ({}),
        },
        timestamp: Date.now(),
        toJSON: () => ({}),
      });
    });
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    });

    const { result } = renderHook(() => useCurrentLocation());

    act(() => result.current.requestLocation());

    expect(result.current.state).toEqual({
      status: 'success',
      position: { latitude: 35.1595, longitude: 126.8526 },
      accuracyMeters: 12,
    });
  });

  it('returns a recoverable permission error', () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, failure: PositionErrorCallback) => {
        failure({
          code: 1,
          message: 'permission denied',
        } as GeolocationPositionError);
      },
    );
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition },
    });

    const { result } = renderHook(() => useCurrentLocation());

    act(() => result.current.requestLocation());

    expect(result.current.state.status).toBe('error');
    if (result.current.state.status === 'error') {
      expect(result.current.state.kind).toBe('permission-denied');
      expect(result.current.state.message).toContain('위치 권한');
    }
  });

  it('reports unsupported browsers without throwing', () => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useCurrentLocation());

    act(() => result.current.requestLocation());

    expect(result.current.state).toMatchObject({
      status: 'error',
      kind: 'unsupported',
    });
  });
});
