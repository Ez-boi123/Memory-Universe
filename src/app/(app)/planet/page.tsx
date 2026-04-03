import React from 'react';

import { PlanetPage } from '@/components/planet/PlanetPage';
import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { buildPlanetPageViewModel } from '@/server/presenters/planet-presenter';
import { normalizePlanetEventIdParam } from './normalize-planet-event-id-param';

interface PlanetPageRouteProps {
  searchParams?: Promise<{
    eventId?: string | string[] | undefined;
  }>;
}

export default async function PlanetPageRoute({ searchParams }: PlanetPageRouteProps) {
  const resolvedSearchParams = await searchParams;
  const { user } = await getSessionUser();
  const relationshipId = user?.id
    ? await resolveSessionRelationship(user.id, user.relationshipId)
    : null;
  const model = await buildPlanetPageViewModel({
    relationshipId,
  });

  return (
    <PlanetPage
      initialEventId={normalizePlanetEventIdParam(resolvedSearchParams?.eventId)}
      model={model}
    />
  );
}
