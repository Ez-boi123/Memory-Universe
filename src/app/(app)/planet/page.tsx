import { PlanetPage } from '@/components/planet/PlanetPage';
import { buildPlanetPageViewModel } from '@/server/presenters/planet-presenter';

export default function PlanetPageRoute() {
  return <PlanetPage model={buildPlanetPageViewModel()} />;
}
