import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MilkyWayEntry } from '@/components/milky-way/MilkyWayEntry';

describe('MilkyWayEntry', () => {
  it('renders the date and hides the note block when note is absent', () => {
    render(
      <MilkyWayEntry
        entry={{
          id: 'entry-1',
          dateLabel: 'February 9, 2026',
          photos: [{ id: 'photo-1', alt: 'Platform', accent: 'blue' }],
        }}
      />,
    );

    expect(screen.getByText('February 9, 2026')).toBeInTheDocument();
    expect(screen.queryByTestId('milky-way-entry-note')).not.toBeInTheDocument();
  });

  it('renders the note block when note is present', () => {
    render(
      <MilkyWayEntry
        entry={{
          id: 'entry-2',
          dateLabel: 'February 10, 2026',
          note: 'A quiet evening on the platform.',
          photos: [{ id: 'photo-2', alt: 'Platform lights', accent: 'rose' }],
        }}
      />,
    );

    expect(screen.getByTestId('milky-way-entry-note')).toHaveTextContent(
      'A quiet evening on the platform.',
    );
  });
});
