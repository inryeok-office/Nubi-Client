import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  it('renders the initial accessible shell', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '누비' })).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: '지도 영역' }),
    ).toBeInTheDocument();
    expect(screen.getByText('출발지를 선택해 주세요')).toBeInTheDocument();
    expect(screen.getByText('목적지를 선택해 주세요')).toBeInTheDocument();
  });
});
