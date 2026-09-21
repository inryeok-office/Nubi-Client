import type { ReactNode } from 'react';

import { ApiError } from '../../shared/api/client';
import { StatusPanel } from '../../shared/ui/StatusPanel';

import type { ArrivalsResponse, BusArrival, BusStop } from './types';

type ArrivalsViewProps = {
  status: 'pending' | 'error' | 'success';
  data?: ArrivalsResponse;
  error: Error | null;
};

const lowFloorLabels = {
  'low-floor': '저상버스',
  standard: '일반버스',
  unknown: '확인되지 않음',
} as const;

function getErrorDescription(error: Error | null) {
  if (error instanceof ApiError && error.status === 502) {
    return '실시간 원천 정보를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.';
  }
  return '도착정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
}

function formatTime(isoString: string) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '시간 확인 불가';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function ArrivalCard({ arrival }: { arrival: BusArrival }) {
  const lowFloorLabel = lowFloorLabels[arrival.lowFloorStatus];

  return (
    <li className="arrival-card">
      <div className="arrival-card__topline">
        <h3>{arrival.routeName ?? '노선 정보 없음'}</h3>
        <span
          className={`low-floor-badge low-floor-badge--${arrival.lowFloorStatus}`}
          aria-label={`차량 상태: ${lowFloorLabel}`}
        >
          <span className="low-floor-badge__dot" aria-hidden="true" />
          {lowFloorLabel}
        </span>
      </div>
      <div className="arrival-card__details">
        <span>
          {arrival.remainingMinutes === null
            ? '도착 시간 확인 불가'
            : arrival.remainingMinutes === 0
              ? '곧 도착'
              : `${arrival.remainingMinutes}분 후`}
        </span>
        {arrival.remainingStops !== null && (
          <span>{arrival.remainingStops}개 정류장 전</span>
        )}
        {arrival.vehicleId && <span>차량 {arrival.vehicleId}</span>}
      </div>
      <p className="arrival-card__observed">
        차량 상태는 조회 시점의 관찰값이며 탑승 가능을 보장하지 않습니다.
      </p>
    </li>
  );
}

export function StopArrivalsView({ status, data, error }: ArrivalsViewProps) {
  if (status === 'pending') {
    return (
      <StatusPanel
        kind="loading"
        title="도착정보를 확인하고 있어요"
        description="실시간 원천에서 현재 도착 예정 차량을 조회하고 있습니다."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusPanel
        kind="error"
        title="도착정보를 불러오지 못했어요"
        description={getErrorDescription(error)}
      />
    );
  }

  if (!data || data.arrivals.length === 0) {
    return (
      <StatusPanel
        kind="empty"
        title="도착 예정 차량이 없어요"
        description="현재 확인된 도착 예정 차량이 없습니다. 정보는 조회 시점 기준입니다."
      />
    );
  }

  return (
    <section aria-labelledby="arrivals-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">조회 시점 정보</p>
          <h2 id="arrivals-title">도착 예정 차량</h2>
        </div>
        <span className="result-count">{data.arrivals.length}대</span>
      </div>
      <p className="arrival-meta">
        {data.dataSource === 'observed-web-api'
          ? '관찰된 버스정보'
          : data.dataSource}
        {' · '}
        조회 {formatTime(data.fetchedAt)}
      </p>
      <ul className="arrival-list">
        {data.arrivals.map((arrival, index) => (
          <ArrivalCard
            key={`${arrival.routeId}-${arrival.vehicleId ?? 'unknown'}-${index}`}
            arrival={arrival}
          />
        ))}
      </ul>
    </section>
  );
}

export function StopDetailSection({
  stop,
  detailLoading,
  children,
}: {
  stop: BusStop;
  detailLoading: boolean;
  children: ReactNode;
}) {
  return (
    <section className="selected-stop" aria-labelledby="selected-stop-title">
      <div className="selected-stop__header">
        <div>
          <p className="eyebrow">정류장 상세</p>
          <h2 id="selected-stop-title">{stop.name}</h2>
        </div>
        {detailLoading && <span className="inline-status">상세 확인 중</span>}
      </div>
      <p className="selected-stop__location">
        {stop.arsId ? `ARS ${stop.arsId}` : 'ARS 번호 미확인'} · 위도{' '}
        {stop.latitude.toFixed(5)} · 경도 {stop.longitude.toFixed(5)}
      </p>
      {children}
    </section>
  );
}
