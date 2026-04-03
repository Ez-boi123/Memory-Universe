import { describe, expect, it } from 'vitest';

import { buildPlanetPageViewModel } from './planet-presenter';

describe('buildPlanetPageViewModel', () => {
  it('orders event cards newest first, alternates layout sides, and shapes modal detail data from full-body sources', async () => {
    const model = await buildPlanetPageViewModel();

    expect(model.header.title).toBe('Memory Planet');
    expect(model.events.map((event) => event.id)).toEqual([
      'event-placeholder-3',
      'event-placeholder-2',
      'event-placeholder-1',
    ]);
    expect(model.events.map((event) => event.layoutSide)).toEqual(['left', 'right', 'left']);
    expect(model.events.map((event) => event.planetVariant)).toEqual(['violet', 'blue', 'rose']);
    expect(model.events[0]).not.toHaveProperty('locationText');

    expect(model.eventDetails['event-placeholder-1']).toEqual({
      id: 'event-placeholder-1',
      title: 'First Shared Memory Placeholder',
      memoryDateLabel: '2026-03-01',
      eventTypeLabel: 'Daily',
      body: 'A fuller placeholder memory body for the first shared event, suitable for the detail modal.',
      locationText: 'Placeholder City',
      lastEditedBy: 'Member One',
      lastEditedAtLabel: '2026-03-24T20:00:00Z',
      memoryStrip: [],
      planetVariant: 'rose',
    });
    expect(model.eventDetails['event-placeholder-1']).not.toHaveProperty('createdAt');
    expect(model.emptyState.actionLabel).toBe('New Event');
  });

  it('returns the empty orbital state when no events are present', async () => {
    const model = await buildPlanetPageViewModel({ events: [] });

    expect(model.events).toEqual([]);
    expect(model.emptyState.title).toBe('Record the first planet in this archive');
    expect(model.emptyState.body).toContain('Shared events will appear here');
  });

  it('uses fallback labels for missing event types and keeps nullable locations honest in sparse detail lookups', async () => {
    const model = await buildPlanetPageViewModel({
      events: [
        {
          id: 'event-edge-1',
          title: 'Edge Memory',
          bodyPreview: 'Short preview for the edge case card.',
          memoryDate: '2026-03-20',
          locationText: null,
          updatedAt: '2026-03-20T08:00:00Z',
          updatedBy: 'Member Three',
        },
      ],
      eventDetailSourceById: {
        'event-edge-1': {
          body: 'Full detail body for the edge case modal.',
          locationText: null,
        },
      },
    });

    expect(model.events[0].eventTypeLabel).toBe('Memory');
    expect(model.eventDetails['event-edge-1']).toEqual({
      id: 'event-edge-1',
      title: 'Edge Memory',
      memoryDateLabel: '2026-03-20',
      eventTypeLabel: 'Memory',
      body: 'Full detail body for the edge case modal.',
      locationText: null,
      lastEditedBy: 'Member Three',
      lastEditedAtLabel: '2026-03-20T08:00:00Z',
      memoryStrip: [],
      planetVariant: 'violet',
    });
    expect(model.eventDetails['missing-event']).toBeUndefined();
  });
});
