import { beforeEach, describe, expect, it, vi } from 'vitest';

const { listEvents } = vi.hoisted(() => ({
  listEvents: vi.fn(),
}));

vi.mock('@/server/services/event-service', () => ({
  eventService: {
    listEvents,
  },
}));

import { buildPlanetPageViewModel } from './planet-presenter';

describe('buildPlanetPageViewModel', () => {
  beforeEach(() => {
    listEvents.mockReset();
  });

  it('orders event cards newest first, alternates layout sides, and shapes modal detail data from stored events', async () => {
    listEvents.mockResolvedValue({
      result: [
        {
          id: 'event-3',
          title: 'Third Orbit',
          body: 'Third event body',
          memoryDate: new Date('2026-03-03T00:00:00.000Z'),
          locationText: null,
          eventType: 'festival',
          updatedAt: new Date('2026-03-26T12:00:00.000Z'),
          updatedBy: 'user-1',
          createdBy: 'user-2',
          eventPhotos: [],
        },
        {
          id: 'event-2',
          title: 'Second Orbit',
          body: 'Second event body',
          memoryDate: new Date('2026-03-02T00:00:00.000Z'),
          locationText: 'Moonlit Pier',
          eventType: 'travel',
          updatedAt: new Date('2026-03-25T12:00:00.000Z'),
          updatedBy: 'user-1',
          createdBy: 'user-1',
          eventPhotos: [],
        },
        {
          id: 'event-1',
          title: 'First Orbit',
          body: 'First event body',
          memoryDate: new Date('2026-03-01T00:00:00.000Z'),
          locationText: 'Placeholder City',
          eventType: 'daily',
          updatedAt: new Date('2026-03-24T20:00:00.000Z'),
          updatedBy: 'user-2',
          createdBy: 'user-1',
          eventPhotos: [],
        },
      ],
    });

    const model = await buildPlanetPageViewModel({ relationshipId: 'relationship-1' });

    expect(model.header.title).toBe('Memory Planet');
    expect(model.events.map((event) => event.id)).toEqual(['event-3', 'event-2', 'event-1']);
    expect(model.events.map((event) => event.layoutSide)).toEqual(['left', 'right', 'left']);
    expect(model.events.map((event) => event.planetVariant)).toEqual(['violet', 'blue', 'rose']);
    expect(model.events[0]).not.toHaveProperty('locationText');

    expect(model.eventDetails['event-1']).toEqual({
      id: 'event-1',
      title: 'First Orbit',
      memoryDateLabel: '2026-03-01',
      eventTypeLabel: 'Daily',
      body: 'First event body',
      locationText: 'Placeholder City',
      lastEditedBy: 'Shared editor',
      lastEditedAtLabel: '2026-03-24T20:00:00.000Z',
      memoryStrip: [],
      planetVariant: 'rose',
    });
    expect(model.emptyState.actionLabel).toBe('New Event');
  });

  it('returns the empty orbital state when no relationship is present', async () => {
    const model = await buildPlanetPageViewModel();

    expect(model.events).toEqual([]);
    expect(model.emptyState.title).toBe('Record the first planet in this archive');
    expect(model.emptyState.body).toContain('Shared events will appear here');
    expect(listEvents).not.toHaveBeenCalled();
  });

  it('uses fallback labels for missing event types and keeps nullable locations honest', async () => {
    listEvents.mockResolvedValue({
      result: [
        {
          id: 'event-edge-1',
          title: 'Edge Memory',
          body: 'Full detail body for the edge case modal.',
          memoryDate: new Date('2026-03-20T00:00:00.000Z'),
          locationText: null,
          eventType: null,
          updatedAt: new Date('2026-03-20T08:00:00.000Z'),
          updatedBy: 'user-1',
          createdBy: 'user-1',
          eventPhotos: [],
        },
      ],
    });

    const model = await buildPlanetPageViewModel({ relationshipId: 'relationship-1' });

    expect(model.events[0]?.eventTypeLabel).toBe('Memory');
    expect(model.eventDetails['event-edge-1']).toEqual({
      id: 'event-edge-1',
      title: 'Edge Memory',
      memoryDateLabel: '2026-03-20',
      eventTypeLabel: 'Memory',
      body: 'Full detail body for the edge case modal.',
      locationText: null,
      lastEditedBy: 'You',
      lastEditedAtLabel: '2026-03-20T08:00:00.000Z',
      memoryStrip: [],
      planetVariant: 'violet',
    });
    expect(model.eventDetails['missing-event']).toBeUndefined();
  });
});
