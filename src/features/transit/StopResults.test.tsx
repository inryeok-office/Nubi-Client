import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NearbyStopsView } from './StopResults';

const stops = [
  {
    stop: {
      stopId: 2,
      arsId: '2222',
      name: '먼 정류장',
      latitude: 35.16,
      longitude: 126.85,
    },
    distanceMeters: 300,
  },
  {
    stop: {
      stopId: 1,
      arsId: null,
      name: '가까운 정류장',
      latitude: 35.1595,
      longitude: 126.8526,
    },
    distanceMeters: 80,
  },
];

describe('NearbyStopsView', () => {
  it('renders loading state', () => {
    render(
      <NearbyStopsView status="pending" error={null} onSelect={vi.fn()} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      '주변 정류장을 찾고 있어요',
    );
  });

  it('renders error state', () => {
    render(
      <NearbyStopsView
        status="error"
        error={new Error('failed')}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      '주변 정류장을 불러오지 못했어요',
    );
  });

  it('renders empty state', () => {
    render(
      <NearbyStopsView
        status="success"
        stops={[]}
        error={null}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      '주변 정류장이 없어요',
    );
  });

  it('sorts stops by distance and exposes large selectable buttons', () => {
    const onSelect = vi.fn();
    render(
      <NearbyStopsView
        status="success"
        stops={stops}
        error={null}
        onSelect={onSelect}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('가까운 정류장');
    expect(buttons[0]).toHaveTextContent('80m');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
  });
});
