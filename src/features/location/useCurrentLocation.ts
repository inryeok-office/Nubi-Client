import { useCallback, useState } from 'react';

import type { Coordinate } from '../../shared/map/types';

export type LocationErrorKind =
  | 'permission-denied'
  | 'position-unavailable'
  | 'timeout'
  | 'unsupported'
  | 'unknown';

export type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; position: Coordinate; accuracyMeters: number }
  | { status: 'error'; kind: LocationErrorKind; message: string };

const locationErrorMessages: Record<LocationErrorKind, string> = {
  'permission-denied':
    '위치 권한이 허용되지 않았어요. 브라우저 설정에서 위치 권한을 허용한 뒤 다시 시도해 주세요.',
  'position-unavailable': '현재 위치를 확인하지 못했어요.',
  timeout: '위치 확인 시간이 초과되었어요. 다시 시도해 주세요.',
  unsupported: '이 브라우저에서는 현재 위치를 사용할 수 없어요.',
  unknown: '현재 위치를 확인하지 못했어요. 다시 시도해 주세요.',
};

function getErrorKind(code: number): LocationErrorKind {
  if (code === 1) return 'permission-denied';
  if (code === 2) return 'position-unavailable';
  if (code === 3) return 'timeout';
  return 'unknown';
}

export function useCurrentLocation() {
  const [state, setState] = useState<LocationState>({ status: 'idle' });

  const requestLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({
        status: 'error',
        kind: 'unsupported',
        message: locationErrorMessages.unsupported,
      });
      return;
    }

    setState({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState({
          status: 'success',
          position: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          accuracyMeters: coords.accuracy,
        });
      },
      (error) => {
        const kind = getErrorKind(error.code);
        setState({
          status: 'error',
          kind,
          message: locationErrorMessages[kind],
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    );
  }, []);

  return { state, requestLocation };
}
