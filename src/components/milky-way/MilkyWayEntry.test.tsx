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
});
