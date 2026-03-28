import { PlanetPage } from '@/components/planet/PlanetPage';
import { buildPlanetPageViewModel } from '@/server/presenters/planet-presenter';

interface PlanetPageRouteProps {
  searchParams?: Promise<{
    eventId?: string;
  }>;
}

export default async function PlanetPageRoute({ searchParams }: PlanetPageRouteProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <PlanetPage
      initialEventId={resolvedSearchParams?.eventId ?? null}
      model={buildPlanetPageViewModel()}
    />
  );
}
