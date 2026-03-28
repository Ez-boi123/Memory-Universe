import { describe, expect, it } from 'vitest';

import { normalizePlanetEventIdParam } from './page';

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
