import { ApiError } from '../../shared/api/client';
import { StatusPanel } from '../../shared/ui/StatusPanel';

import type { BusStop, NearbyBusStop } from './types';

type StopResultsProps = {
  status: 'idle' | 'pending' | 'error' | 'success';
  stops?: NearbyBusStop[];
  error: Error | null;
  selectedStopId?: number;
  onSelect: (stop: BusStop) => void;
};

function getErrorDescription(error: Error | null) {
  if (error instanceof ApiError && error.status === 0) {
    return '네트워크 상태를 확인한 뒤 다시 시도해 주세요.';
  }
  return '주변 정류장 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
}

function formatDistance(distanceMeters: number) {
  return distanceMeters < 1_000
    ? `${Math.round(distanceMeters)}m`
    : `${(distanceMeters / 1_000).toFixed(1)}km`;
}

function StopCard({
  nearbyStop,
  selected,
  onSelect,
}: {
  nearbyStop: NearbyBusStop;
  selected: boolean;
  onSelect: (stop: BusStop) => void;
}) {
  const { stop } = nearbyStop;

  return (
    <li>
      <button
        className={`stop-card${selected ? ' stop-card--selected' : ''}`}
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(stop)}
      >
        <span className="stop-card__name">{stop.name}</span>
        <span className="stop-card__meta">
          {stop.arsId ? `ARS ${stop.arsId}` : 'ARS 번호 미확인'}
          <span aria-hidden="true"> · </span>
          {formatDistance(nearbyStop.distanceMeters)}
        </span>
        <span className="stop-card__action" aria-hidden="true">
          보기
        </span>
      </button>
    </li>
  );
}

export function NearbyStopsView({
  status,
  stops = [],
  error,
  selectedStopId,
  onSelect,
}: StopResultsProps) {
  if (status === 'pending') {
    return (
      <StatusPanel
        kind="loading"
        title="주변 정류장을 찾고 있어요"
        description="현재 위치에서 가까운 정류장을 확인하고 있습니다."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusPanel
        kind="error"
        title="주변 정류장을 불러오지 못했어요"
        description={getErrorDescription(error)}
      />
    );
  }

  if (status !== 'success' || stops.length === 0) {
    return (
      <StatusPanel
        kind="empty"
        title="주변 정류장이 없어요"
        description="검색 반경 안에 확인된 정류장이 없습니다. 다른 위치에서 다시 시도해 주세요."
      />
    );
  }

  const sortedStops = [...stops].sort(
    (left, right) => left.distanceMeters - right.distanceMeters,
  );

  return (
    <section className="stops-section" aria-labelledby="nearby-stops-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">현재 위치 기준</p>
          <h2 id="nearby-stops-title">주변 정류장</h2>
        </div>
        <span className="result-count">{sortedStops.length}곳</span>
      </div>
      <ul className="stop-list">
        {sortedStops.map((nearbyStop) => (
          <StopCard
            key={nearbyStop.stop.stopId}
            nearbyStop={nearbyStop}
            selected={nearbyStop.stop.stopId === selectedStopId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </section>
  );
}
