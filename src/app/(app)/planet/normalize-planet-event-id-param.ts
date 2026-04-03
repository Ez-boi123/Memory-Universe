type PlanetEventIdParam = string | string[] | undefined;

export function normalizePlanetEventIdParam(eventId: PlanetEventIdParam): string | null {
  if (typeof eventId === 'string') {
    return eventId;
  }

  if (Array.isArray(eventId)) {
    return eventId[0] ?? null;
  }

  return null;
}
