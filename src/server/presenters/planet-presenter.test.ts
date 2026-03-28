import { describe, expect, it } from 'vitest';

import { buildPlanetPageViewModel } from './planet-presenter';

describe('buildPlanetPageViewModel', () => {
  it('orders event cards newest first, alternates layout sides, and shapes modal detail data', () => {
    const model = buildPlanetPageViewModel();

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
      body: 'TODO: event list and detail data will come from the real service layer later.',
      locationText: 'Placeholder City',
      lastEditedBy: 'Member One',
      lastEditedAtLabel: '2026-03-24T20:00:00Z',
      planetVariant: 'rose',
    });
    expect(model.eventDetails['event-placeholder-1']).not.toHaveProperty('createdAt');
    expect(model.emptyState.actionLabel).toBe('New Event');
  });

  it('returns the empty orbital state when no events are present', () => {
    const model = buildPlanetPageViewModel({ events: [] });

    expect(model.events).toEqual([]);
    expect(model.emptyState.title).toBe('Record the first planet in this archive');
    expect(model.emptyState.body).toContain('Shared events will appear here');
  });
});
