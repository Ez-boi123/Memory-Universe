import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const { mockModel } = vi.hoisted(() => ({
  mockModel: { source: 'mock-model' },
}));

vi.mock('@/components/planet/PlanetPage', () => ({
  PlanetPage: () => null,
}));

vi.mock('@/server/presenters/planet-presenter', () => ({
  buildPlanetPageViewModel: () => mockModel,
}));

import PlanetPageRoute, { normalizePlanetEventIdParam } from './page';

describe('normalizePlanetEventIdParam', () => {
  it('returns a string param as-is', () => {
    expect(normalizePlanetEventIdParam('event-1')).toBe('event-1');
  });

  it('returns the first value for repeated params', () => {
    expect(normalizePlanetEventIdParam(['event-1', 'event-2'])).toBe('event-1');
  });

  it('returns null when the param is missing', () => {
    expect(normalizePlanetEventIdParam(undefined)).toBeNull();
  });
});

describe('PlanetPageRoute', () => {
  it('awaits search params and passes the normalized event id into PlanetPage', async () => {
    const element = await PlanetPageRoute({
      searchParams: Promise.resolve({
        eventId: ['event-1', 'event-2'],
      }),
    });

    expect(React.isValidElement(element)).toBe(true);
    expect(element.props).toEqual({
      initialEventId: 'event-1',
      model: mockModel,
    });
  });
});
