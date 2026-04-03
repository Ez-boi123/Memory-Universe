import React from 'react';
import { act } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PlanetPageViewModel } from '@/types/planet';

import { PlanetPage } from './PlanetPage';

const { replace } = vi.hoisted(() => ({
  replace: vi.fn(),
}));

let mockedSearchParams = 'view=stars';
const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);
vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'blob:planet-preview'),
  revokeObjectURL: vi.fn(),
});

vi.mock('next/navigation', () => ({
  usePathname: () => '/planet',
  useRouter: () => ({
    replace,
  }),
  useSearchParams: () => new URLSearchParams(mockedSearchParams),
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
        memoryStrip: [],
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
        memoryStrip: [],
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
        memoryStrip: [],
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
        memoryStrip: [],
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
  beforeEach(() => {
    replace.mockReset();
    mockFetch.mockReset();
    mockedSearchParams = 'view=stars';
    window.location.hash = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders orbital event units in alternating layout order', () => {
    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    expect(screen.getByLabelText('Memory Planet hero')).toBeInTheDocument();
    expect(screen.getByText('Memory Planet')).toBeInTheDocument();
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
    expect(screen.getByText(/2 events already in orbit/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New Event' })).toBeEnabled();
    const firstEventCard = screen.getByTestId('planet-event-event-1');

    expect(firstEventCard).toHaveAttribute(
      'data-layout-side',
      'left',
    );
    expect(within(firstEventCard).getByText('First Test Event')).toBeInTheDocument();
    expect(within(firstEventCard).getByText('2026-03-01')).toBeInTheDocument();
    expect(within(firstEventCard).getByText('Daily')).toBeInTheDocument();
    expect(within(firstEventCard).getByText('Test City')).toBeInTheDocument();
    expect(within(firstEventCard).queryByText('A short preview')).not.toBeInTheDocument();
    expect(within(firstEventCard).queryByText(/Last edited by/i)).not.toBeInTheDocument();
    expect(within(firstEventCard).queryByLabelText(/memory strip/i)).not.toBeInTheDocument();

    expect(screen.getByTestId('planet-event-event-2')).toHaveAttribute(
      'data-layout-side',
      'right',
    );
  });

  it('renders each event as an explicit planet sphere structure', () => {
    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    expect(screen.getByRole('button', { name: /first test event/i })).toHaveClass(
      'planet-event-sphere-button',
    );
    expect(screen.getByTestId('planet-sphere-core-event-1')).toBeInTheDocument();
    expect(screen.getByTestId('planet-sphere-ring-event-1')).toBeInTheDocument();
    expect(screen.getByTestId('planet-sphere-meta-event-1')).toBeInTheDocument();
  });

  it('renders memory photos as orbital fragments on the ring', () => {
    const model = buildPlanetPageTestModel();
    const memoryStrip = [
      {
        alt: 'fragment one',
        id: 'photo-1',
        thumbnailUrl: 'https://cdn.example.com/1.jpg',
      },
      {
        alt: 'fragment two',
        id: 'photo-2',
        thumbnailUrl: 'https://cdn.example.com/2.jpg',
      },
      {
        alt: 'fragment three',
        id: 'photo-3',
        thumbnailUrl: 'https://cdn.example.com/3.jpg',
      },
      {
        alt: 'fragment four',
        id: 'photo-4',
        thumbnailUrl: 'https://cdn.example.com/4.jpg',
      },
      {
        alt: 'fragment five',
        id: 'photo-5',
        thumbnailUrl: 'https://cdn.example.com/5.jpg',
      },
      {
        alt: 'fragment six',
        id: 'photo-6',
        thumbnailUrl: 'https://cdn.example.com/6.jpg',
      },
    ];

    model.events[0].memoryStrip = memoryStrip;
    model.eventDetails['event-1']!.memoryStrip = memoryStrip;

    render(<PlanetPage model={model} />);

    expect(screen.getByTestId('planet-sphere-fragment-event-1-photo-1')).toBeInTheDocument();
    expect(screen.getByTestId('planet-sphere-fragment-event-1-photo-2')).toBeInTheDocument();
    expect(screen.getByTestId('planet-sphere-fragment-event-1-photo-3')).toBeInTheDocument();
    expect(screen.getByTestId('planet-sphere-fragment-event-1-photo-4')).toBeInTheDocument();
    expect(screen.getByTestId('planet-sphere-fragment-event-1-photo-5')).toBeInTheDocument();
    expect(
      screen.queryByTestId('planet-sphere-fragment-event-1-photo-6'),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/memory strip/i)).not.toBeInTheDocument();
  });

  it('opens and closes the detail modal from an event card', async () => {
    vi.useFakeTimers();
    window.location.hash = '#current';

    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /first test event/i }));
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/planet?view=stars&eventId=event-1#current', {
      scroll: false,
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/planet?view=stars#current', { scroll: false });
  });

  it('shows a soft expand transition before opening the detail modal', async () => {
    vi.useFakeTimers();

    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    const firstEventSphere = screen.getByRole('button', { name: /first test event/i });

    act(() => {
      fireEvent.click(firstEventSphere);
    });

    expect(firstEventSphere).toHaveClass('planet-event-sphere-button--opening');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(220);
    });

    expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();
    expect(firstEventSphere).not.toHaveClass('planet-event-sphere-button--opening');
  });

  it('renders the detail modal as a two-column memory chamber', async () => {
    vi.useFakeTimers();

    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /first test event/i }));
      vi.advanceTimersByTime(220);
    });

    expect(screen.getByTestId('planet-detail-modal')).toBeInTheDocument();
    expect(screen.getByTestId('planet-detail-media-stage')).toBeInTheDocument();
    expect(screen.getByTestId('planet-detail-content')).toBeInTheDocument();
  });

  it('renders layered photo frames inside the detail media stage', async () => {
    vi.useFakeTimers();
    const model = buildPlanetPageTestModel();
    const memoryStrip = [
      {
        alt: 'frame one',
        id: 'photo-1',
        thumbnailUrl: 'https://cdn.example.com/1.jpg',
      },
      {
        alt: 'frame two',
        id: 'photo-2',
        thumbnailUrl: 'https://cdn.example.com/2.jpg',
      },
      {
        alt: 'frame three',
        id: 'photo-3',
        thumbnailUrl: 'https://cdn.example.com/3.jpg',
      },
    ];

    model.events[0].memoryStrip = memoryStrip;
    model.eventDetails['event-1']!.memoryStrip = memoryStrip;

    render(<PlanetPage model={model} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /first test event/i }));
      vi.advanceTimersByTime(220);
    });

    expect(screen.getByTestId('planet-detail-photo-frame-photo-1')).toBeInTheDocument();
    expect(screen.getByTestId('planet-detail-photo-frame-photo-2')).toBeInTheDocument();
    expect(screen.getByTestId('planet-detail-photo-frame-photo-3')).toBeInTheDocument();
  });

  it('renders an empty-image chamber for events without photos', async () => {
    vi.useFakeTimers();

    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /second test event/i }));
      vi.advanceTimersByTime(220);
    });

    expect(screen.getByTestId('planet-detail-media-empty')).toBeInTheDocument();
  });

  it('opens an image lightbox above the detail modal when a photo frame is clicked', async () => {
    vi.useFakeTimers();
    const model = buildPlanetPageTestModel();
    const memoryStrip = [
      {
        alt: 'frame one',
        id: 'photo-1',
        thumbnailUrl: 'https://cdn.example.com/1.jpg',
      },
    ];

    model.events[0].memoryStrip = memoryStrip;
    model.eventDetails['event-1']!.memoryStrip = memoryStrip;

    render(<PlanetPage model={model} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /first test event/i }));
      vi.advanceTimersByTime(220);
    });

    fireEvent.click(screen.getByRole('button', { name: /open frame one/i }));

    expect(screen.getByRole('dialog', { name: /frame one/i })).toBeInTheDocument();
  });

  it('closes the image lightbox without closing the event detail modal', async () => {
    vi.useFakeTimers();
    const model = buildPlanetPageTestModel();
    const memoryStrip = [
      {
        alt: 'frame one',
        id: 'photo-1',
        thumbnailUrl: 'https://cdn.example.com/1.jpg',
      },
    ];

    model.events[0].memoryStrip = memoryStrip;
    model.eventDetails['event-1']!.memoryStrip = memoryStrip;

    render(<PlanetPage model={model} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /first test event/i }));
      vi.advanceTimersByTime(220);
    });

    fireEvent.click(screen.getByRole('button', { name: /open frame one/i }));
    fireEvent.click(screen.getByRole('button', { name: /close image/i }));

    expect(screen.queryByRole('dialog', { name: /frame one/i })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();
  });

  it('opens the create modal, accepts event details, and adds a new event without changing the route', async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({
          upload: {
            id: 'upload-1',
            displayUrl: 'https://cdn.example.com/photo-1.jpg',
            originalUrl: 'https://cdn.example.com/photo-1.jpg',
            storageKey: 'planet-photos/tmp/relationship-1/photo-1.jpg',
            thumbnailUrl: 'https://cdn.example.com/photo-1.jpg',
            uploadedAt: '2026-03-29T12:00:00Z',
          },
        }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({
          event: {
            body: 'We watched the lights fold over the water and promised to remember the quiet.',
            id: 'event-3',
            locationText: 'Moonlit Pier',
            memoryDate: '2026-03-29',
            title: 'A newly captured orbit',
            updatedAt: '2026-03-29T12:00:00Z',
          },
          photos: [
            {
              id: 'photo-1',
              thumbnailUrl: 'https://cdn.example.com/photo-1.jpg',
            },
          ],
        }),
        ok: true,
      });
    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    await user.click(screen.getByRole('button', { name: 'New Event' }));

    expect(screen.getByRole('dialog', { name: /create new event/i })).toBeInTheDocument();
    expect(
      screen.getByText(/capture the next event before it drifts out of reach/i),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText(/event title/i), 'A newly captured orbit');
    await user.type(screen.getByLabelText(/memory date/i), '2026-03-29');
    await user.click(screen.getByRole('button', { name: /event type/i }));
    expect(screen.getByRole('listbox', { name: /event type/i })).toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: /travel/i }));
    await user.type(screen.getByLabelText(/location/i), 'Moonlit Pier');
    await user.upload(
      screen.getByLabelText(/drop images here or browse from your device/i),
      new File(['photo-bytes'], 'orbit.jpg', { type: 'image/jpeg' }),
    );
    await user.type(
      screen.getByLabelText(/memory notes/i),
      'We watched the lights fold over the water and promised to remember the quiet.',
    );

    await user.click(screen.getByRole('button', { name: /save event/i }));

    expect(screen.queryByRole('dialog', { name: /create new event/i })).not.toBeInTheDocument();
    expect(screen.getByText('A newly captured orbit')).toBeInTheDocument();
    expect(screen.getByText(/3 events already in orbit/i)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      '/api/photos/upload',
      expect.objectContaining({
        method: 'POST',
      }),
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      '/api/events',
      expect.objectContaining({
        method: 'POST',
      }),
    );
    expect(replace).not.toHaveBeenCalled();
  });

  it('removes uploaded temporary images when create is cancelled', async () => {
    const user = userEvent.setup();

    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({
          upload: {
            id: 'upload-1',
            displayUrl: 'https://cdn.example.com/photo-1.jpg',
            originalUrl: 'https://cdn.example.com/photo-1.jpg',
            storageKey: 'planet-photos/tmp/relationship-1/photo-1.jpg',
            thumbnailUrl: 'https://cdn.example.com/photo-1.jpg',
            uploadedAt: '2026-03-29T12:00:00Z',
          },
        }),
        ok: true,
      })
      .mockResolvedValueOnce({
        json: async () => ({
          ok: true,
        }),
        ok: true,
      });

    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    await user.click(screen.getByRole('button', { name: 'New Event' }));
    await user.upload(
      screen.getByLabelText(/drop images here or browse from your device/i),
      new File(['photo-bytes'], 'orbit.jpg', { type: 'image/jpeg' }),
    );

    await screen.findByText('Uploaded');
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByRole('dialog', { name: /create new event/i })).not.toBeInTheDocument();
    await waitFor(() =>
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        '/api/photos/upload',
        expect.objectContaining({
          method: 'DELETE',
        }),
      ),
    );
  });

  it('closes the event type menu when clicking outside the select', async () => {
    const user = userEvent.setup();

    render(<PlanetPage model={buildPlanetPageTestModel()} />);

    await user.click(screen.getByRole('button', { name: 'New Event' }));
    await user.click(screen.getByRole('button', { name: /event type/i }));

    expect(screen.getByRole('listbox', { name: /event type/i })).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole('listbox', { name: /event type/i })).not.toBeInTheDocument();
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

  it('keeps a locally opened modal visible across equivalent model rerenders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PlanetPage model={buildPlanetPageTestModel()} />);

    await user.click(screen.getByRole('button', { name: /first test event/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();
    });

    rerender(<PlanetPage model={buildPlanetPageTestModel()} />);

    expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();
  });

  it('opens the requested modal when detail data for the same initial event id appears later', () => {
    const initialModel = buildPlanetPageTestModel();
    const delayedDetailModel = {
      ...buildPlanetPageTestModel(),
      eventDetails: {
        'event-2': buildPlanetPageTestModel().eventDetails['event-2'],
      },
    };
    const { rerender } = render(
      <PlanetPage initialEventId="event-1" model={delayedDetailModel} />,
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    rerender(<PlanetPage initialEventId="event-1" model={initialModel} />);

    expect(screen.getByRole('dialog', { name: /first test event/i })).toBeInTheDocument();
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

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('renders the supplied empty state when there are no events', async () => {
    const user = userEvent.setup();

    render(
      <PlanetPage
        model={{
          ...buildPlanetPageTestModel(),
          events: [],
        }}
      />,
    );

    const emptyState = screen.getByText('Empty').closest('section');

    expect(emptyState).not.toBeNull();
    expect(within(emptyState as HTMLElement).getByText('Empty body')).toBeInTheDocument();
    await user.click(within(emptyState as HTMLElement).getByRole('button', { name: 'New Event' }));

    expect(screen.getByRole('dialog', { name: /create new event/i })).toBeInTheDocument();
  });
});
