import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { PlanetPageViewModel } from '@/types/planet';

import { PlanetPage } from './PlanetPage';

const { replace } = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/planet',
  useRouter: () => ({
    replace,
  }),
}));

function buildPlanetPageTestModel(): PlanetPageViewModel {
  return {
    header: {
      eyebrow: 'Planet',
      title: 'Memory Planet',
      description: 'Test description',
      actionLabel: 'New Event',
    },
    events: [
      {
        id: 'event-1',
        title: 'First Test Event',
        memoryDateLabel: '2026-03-01',
        eventTypeLabel: 'Daily',
        bodyPreview: 'A short preview',
        lastEditedBy: 'Member One',
        lastEditedAtLabel: '2026-03-24T20:00:00Z',
        layoutSide: 'left',
        planetVariant: 'violet',
      },
      {
        id: 'event-2',
        title: 'Second Test Event',
        memoryDateLabel: '2026-03-02',
        eventTypeLabel: 'Travel',
        bodyPreview: 'Another preview',
        lastEditedBy: 'Member Two',
        lastEditedAtLabel: '2026-03-25T12:00:00Z',
        layoutSide: 'right',
        planetVariant: 'blue',
      },
    ],
    eventDetails: {
      'event-1': {
        id: 'event-1',
        title: 'First Test Event',
        memoryDateLabel: '2026-03-01',
        eventTypeLabel: 'Daily',
        body: 'The full body for the first test event.',
        locationText: 'Test City',
        lastEditedBy: 'Member One',
        lastEditedAtLabel: '2026-03-24T20:00:00Z',
        planetVariant: 'violet',
      },
      'event-2': {
        id: 'event-2',
        title: 'Second Test Event',
        memoryDateLabel: '2026-03-02',
        eventTypeLabel: 'Travel',
        body: 'The full body for the second test event.',
        locationText: null,
        lastEditedBy: 'Member Two',
        lastEditedAtLabel: '2026-03-25T12:00:00Z',
        planetVariant: 'blue',
      },
    },
    createDefaults: {
      title: '',
      memoryDate: '',
      eventType: 'daily',
      locationText: '',
      body: '',
    },
    emptyState: {
      title: 'Empty',
      body: 'Empty body',
      actionLabel: 'New Event',
    },
  };
}

describe('PlanetPage', () => {
  it('renders orbital event units in alternating layout order', () => {
    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    expect(screen.getByText('Memory Planet')).toBeInTheDocument();
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Event' })).toBeInTheDocument();
    expect(screen.getByTestId('planet-event-event-1')).toHaveAttribute(
      'data-layout-side',
      'left',
    );
    expect(screen.getByTestId('planet-event-event-2')).toHaveAttribute(
      'data-layout-side',
      'right',
    );
  });

  it('opens and closes the detail modal from an event card', async () => {
    const user = userEvent.setup();
    replace.mockReset();

    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    await user.click(screen.getByRole('button', { name: /first test event/i }));

    expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/planet?eventId=event-1', {
      scroll: false,
    });

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/planet', { scroll: false });
  });

  it('opens the matching modal when an initial event id is provided', () => {
    render(<PlanetPage initialEventId="event-2" model={buildPlanetPageTestModel()} />);

    expect(screen.getByRole('dialog', { name: /second test event/i })).toBeInTheDocument();
  });

  it('syncs the open modal when the event id prop changes', () => {
    const { rerender } = render(
      <PlanetPage initialEventId="event-1" model={buildPlanetPageTestModel()} />,
    );

    expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();

    rerender(<PlanetPage initialEventId="event-2" model={buildPlanetPageTestModel()} />);

    expect(screen.getByRole('dialog', { name: /second test event/i })).toBeInTheDocument();
  });

  it('does not navigate or open a modal when detail data is missing', async () => {
    const user = userEvent.setup();
    replace.mockReset();

    render(
      <PlanetPage
        model={{
          ...buildPlanetPageTestModel(),
          eventDetails: {
            'event-1': buildPlanetPageTestModel().eventDetails['event-1'],
          },
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /second test event/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
