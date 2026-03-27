import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MilkyWayOverview } from '@/components/milky-way/MilkyWayOverview';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';

describe('MilkyWayOverview', () => {
  it('renders the timeline region, upload tile, and first month section', () => {
    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    expect(screen.getByText('Memory Milky Way')).toBeInTheDocument();
    expect(screen.getByText('Add to your Milky Way')).toBeInTheDocument();
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(screen.getByText('2026 / 03')).toBeInTheDocument();
  });
});
