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

  it('renders month links and the upload form defaults', () => {
    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    expect(screen.getByRole('navigation', { name: 'Milky Way months' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload to Milky Way' })).toBeInTheDocument();
    expect(screen.getByLabelText('Memory time')).toHaveValue('2026-03-27T10:30');
    expect(screen.getByLabelText('Optional event')).toHaveValue('');
  });

  it('renders the empty state copy when the feed has no sections', () => {
    render(<MilkyWayOverview model={buildMilkyWayViewModel({ isEmpty: true })} />);

    expect(screen.getByText('Your Milky Way starts with one photo')).toBeInTheDocument();
    expect(
      screen.getByText('The first upload becomes the opening memory in your timeline.'),
    ).toBeInTheDocument();
  });
});
