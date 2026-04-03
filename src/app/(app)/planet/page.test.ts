import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const { mockModel } = vi.hoisted(() => ({
  mockModel: { source: 'mock-model' },
}));

vi.mock('@/lib/auth/session', () => ({
  getSessionUser: async () => ({
    user: {
      id: 'user-1',
      relationshipId: 'relationship-1',
    },
  }),
  resolveSessionRelationship: async () => 'relationship-1',
}));

vi.mock('@/components/planet/PlanetPage', () => ({
  PlanetPage: ({
    initialEventId,
    model,
  }: {
    initialEventId: string | null;
    model: { source: string };
  }) =>
    React.createElement(
      'div',
      { 'data-testid': 'planet-page-route-probe' },
      `${initialEventId ?? 'none'}:${model.source}`,
    ),
}));

vi.mock('@/server/presenters/planet-presenter', () => ({
  buildPlanetPageViewModel: async () => mockModel,
}));

import PlanetPageRoute from './page';
import { normalizePlanetEventIdParam } from './normalize-planet-event-id-param';

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
    render(element);

    expect(screen.getByTestId('planet-page-route-probe')).toHaveTextContent(
      'event-1:mock-model',
    );
  });
});
