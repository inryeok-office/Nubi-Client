import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  it('renders the initial accessible shell', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '누비' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '현재 위치로 정류장 찾기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: '지도 영역' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: '위치를 확인하면 정류장이 표시돼요',
      }),
    ).toBeInTheDocument();
  });
});
