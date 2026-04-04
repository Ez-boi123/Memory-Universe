import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MilkyWayEntry } from '@/components/milky-way/MilkyWayEntry';

describe('MilkyWayEntry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the date and hides the meta card when no linked event is present', () => {
    render(
      <MilkyWayEntry
        entry={{
          id: 'entry-1',
          dateLabel: 'February 9, 2026',
          photos: [
            {
              id: 'photo-1',
              alt: 'Platform',
              accent: 'blue',
              imageUrl: 'https://cdn.example.com/platform.jpg',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('February 9, 2026')).toBeInTheDocument();
    expect(screen.queryByTestId('milky-way-entry-meta')).not.toBeInTheDocument();
  });

  it('renders the event and note blocks when data is present', () => {
    render(
      <MilkyWayEntry
        entry={{
          id: 'entry-2',
          dateLabel: 'February 10, 2026',
          eventTitle: 'Lantern Walk',
          note: 'A quiet evening on the platform.',
          photos: [
            {
              id: 'photo-2',
              alt: 'Platform lights',
              accent: 'rose',
              imageUrl: 'https://cdn.example.com/platform-lights.jpg',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(screen.getByTestId('milky-way-entry-event')).toHaveTextContent('Lantern Walk');
    expect(screen.getByTestId('milky-way-entry-note')).toHaveTextContent(
      'A quiet evening on the platform.',
    );
  });

  it('opens a lightbox when a timeline photo is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MilkyWayEntry
        entry={{
          id: 'entry-3',
          dateLabel: 'February 11, 2026',
          photos: [
            {
              id: 'photo-3',
              alt: 'Platform lights',
              accent: 'rose',
              imageUrl: 'https://cdn.example.com/platform-lights.jpg',
            },
          ],
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open platform lights/i }));

    const dialog = screen.getByRole('dialog', { name: /photo preview/i });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('img', { name: 'Platform lights' })).toHaveAttribute(
      'src',
      'https://cdn.example.com/platform-lights.jpg',
    );
  });

  it('keeps the lightbox focused on preview only outside edit mode', async () => {
    const user = userEvent.setup();

    render(
      <MilkyWayEntry
        entry={{
          id: 'entry-4',
          dateLabel: 'February 12, 2026',
          photos: [
            {
              id: 'photo-4',
              alt: 'Platform lights',
              accent: 'rose',
              imageUrl: 'https://cdn.example.com/platform-lights.jpg',
            },
          ],
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open platform lights/i }));

    expect(screen.getByRole('dialog', { name: /photo preview/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete Photo' })).not.toBeInTheDocument();
  });
});
