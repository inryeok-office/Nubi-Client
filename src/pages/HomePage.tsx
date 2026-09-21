import { useEffect, useState } from 'react';

import { useCurrentLocation } from '../features/location/useCurrentLocation';
import { NearbyStopsView } from '../features/transit/StopResults';
import {
  StopArrivalsView,
  StopDetailSection,
} from '../features/transit/StopArrivals';
import {
  useNearbyStops,
  useStop,
  useStopArrivals,
} from '../features/transit/queries';
import type { BusStop } from '../features/transit/types';
import { MapContainer } from '../shared/map/MapContainer';
import type { MapMarker } from '../shared/map/types';
import { StatusPanel } from '../shared/ui/StatusPanel';

export function HomePage() {
  const { state: locationState, requestLocation } = useCurrentLocation();
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  useEffect(() => {
    if (locationState.status === 'success') {
      setPosition(locationState.position);
    }
  }, [locationState]);

  const nearbyStopsQuery = useNearbyStops(position);
  const selectedStopId = selectedStop?.stopId ?? null;
  const stopQuery = useStop(selectedStopId);
  const arrivalsQuery = useStopArrivals(selectedStopId);
  const displayedStop = stopQuery.data ?? selectedStop;

  const handleLocationRequest = () => {
    setPosition(null);
    setSelectedStop(null);
    requestLocation();
  };

  const markerData: MapMarker[] = (nearbyStopsQuery.data?.stops ?? []).map(
    ({ stop }) => ({
      id: String(stop.stopId),
      position: stop,
      label: stop.name,
    }),
  );

  return (
    <main className="page-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">광주광역시 이동지원 플랫폼</p>
          <h1>누비</h1>
        </div>
        <span className="status-badge">시민용 데모</span>
      </header>

      <section className="intro" aria-labelledby="intro-title">
        <p className="eyebrow">주변 정류장 찾기</p>
        <h2 id="intro-title">현재 위치에서 가까운 정류장을 찾아보세요</h2>
        <p>
          정류장을 선택하면 조회 시점의 도착 예정 차량과 저상버스 관찰 상태를
          확인할 수 있어요.
        </p>
      </section>

      <section className="location-card" aria-labelledby="location-title">
        <div className="location-card__content">
          <p className="eyebrow">위치 정보</p>
          <h2 id="location-title">현재 위치</h2>
          {locationState.status === 'idle' && (
            <p>주변 정류장을 찾으려면 현재 위치 사용을 시작해 주세요.</p>
          )}
          {locationState.status === 'loading' && (
            <p role="status">현재 위치를 확인하고 있어요.</p>
          )}
          {locationState.status === 'success' && (
            <p role="status">
              현재 위치를 확인했어요. 정확도 약{' '}
              {Math.round(locationState.accuracyMeters)}m입니다.
            </p>
          )}
          {locationState.status === 'error' && (
            <p className="inline-error" role="alert">
              {locationState.message}
            </p>
          )}
        </div>
        <button
          className="button button--primary location-button"
          type="button"
          onClick={handleLocationRequest}
          disabled={locationState.status === 'loading'}
        >
          {locationState.status === 'loading'
            ? '현재 위치 확인 중…'
            : locationState.status === 'error'
              ? '다시 시도하기'
              : '현재 위치로 정류장 찾기'}
        </button>
      </section>

      {locationState.status === 'success' && !selectedStop && (
        <section className="flow-section" aria-labelledby="nearby-stops-title">
          <NearbyStopsView
            status={
              nearbyStopsQuery.isPending
                ? 'pending'
                : nearbyStopsQuery.isError
                  ? 'error'
                  : 'success'
            }
            stops={nearbyStopsQuery.data?.stops}
            error={nearbyStopsQuery.error}
            onSelect={setSelectedStop}
          />
        </section>
      )}

      {locationState.status !== 'success' && (
        <StatusPanel
          kind="empty"
          title="위치를 확인하면 정류장이 표시돼요"
          description="위치 권한이 없어도 앱은 계속 사용할 수 있습니다. 위치를 허용하지 않은 경우에는 브라우저 설정을 확인해 주세요."
        />
      )}

      {selectedStop && displayedStop && (
        <section className="flow-section">
          <button
            className="back-button"
            type="button"
            onClick={() => setSelectedStop(null)}
          >
            ← 주변 정류장 목록으로 돌아가기
          </button>
          <StopDetailSection
            stop={displayedStop}
            detailLoading={stopQuery.isPending}
          >
            <StopArrivalsView
              status={
                arrivalsQuery.isPending
                  ? 'pending'
                  : arrivalsQuery.isError
                    ? 'error'
                    : 'success'
              }
              data={arrivalsQuery.data}
              error={arrivalsQuery.error}
            />
          </StopDetailSection>
        </section>
      )}

      <MapContainer
        currentLocation={
          locationState.status === 'success'
            ? locationState.position
            : undefined
        }
        markers={markerData}
      />
    </main>
  );
}
