import React from 'react';

import { PlanetPage } from '@/components/planet/PlanetPage';
import { buildPlanetPageViewModel } from '@/server/presenters/planet-presenter';

type PlanetEventIdParam = string | string[] | undefined;

interface PlanetPageRouteProps {
  searchParams?: Promise<{
    eventId?: PlanetEventIdParam;
  }>;
}

export function normalizePlanetEventIdParam(eventId: PlanetEventIdParam): string | null {
  if (typeof eventId === 'string') {
    return eventId;
  }

  if (Array.isArray(eventId)) {
    return eventId[0] ?? null;
  }

  return null;
}

export default async function PlanetPageRoute({ searchParams }: PlanetPageRouteProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <PlanetPage
      initialEventId={normalizePlanetEventIdParam(resolvedSearchParams?.eventId)}
      model={buildPlanetPageViewModel()}
    />
  );
}
