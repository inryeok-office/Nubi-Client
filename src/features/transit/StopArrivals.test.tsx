import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StopArrivalsView } from './StopArrivals';

const data = {
  stopId: 2607,
  dataSource: 'observed-web-api',
  fetchedAt: '2026-09-21T00:00:00Z',
  arrivals: [
    {
      routeId: 1,
      routeName: '송정19',
      vehicleId: 'BUS-001',
      remainingMinutes: 4,
      remainingStops: 2,
      lowFloorStatus: 'low-floor' as const,
      currentStopId: 2606,
      observedAt: '2026-09-21T00:00:00Z',
    },
    {
      routeId: 2,
      routeName: '지원25',
      vehicleId: null,
      remainingMinutes: null,
      remainingStops: null,
      lowFloorStatus: 'unknown' as const,
      currentStopId: null,
      observedAt: '2026-09-21T00:00:00Z',
    },
  ],
};

describe('StopArrivalsView', () => {
  it('renders loading and error states', () => {
    const { rerender } = render(
      <StopArrivalsView status="pending" error={null} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      '도착정보를 확인하고 있어요',
    );

    rerender(<StopArrivalsView status="error" error={new Error('failed')} />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      '도착정보를 불러오지 못했어요',
    );
  });

  it('renders empty state', () => {
    render(
      <StopArrivalsView
        status="success"
        data={{ ...data, arrivals: [] }}
        error={null}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      '도착 예정 차량이 없어요',
    );
  });

  it('renders arrival details and text labels for low-floor status', () => {
    render(<StopArrivalsView status="success" data={data} error={null} />);

    expect(screen.getByRole('heading', { name: '송정19' })).toBeInTheDocument();
    expect(screen.getByText('저상버스')).toBeInTheDocument();
    expect(screen.getByText('확인되지 않음')).toBeInTheDocument();
    expect(screen.getByText('4분 후')).toBeInTheDocument();
    expect(screen.getAllByText(/탑승 가능을 보장하지 않습니다/)).toHaveLength(
      2,
    );
  });
});
