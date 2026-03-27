import { ConstellationPage as ConstellationPageView } from '@/components/constellation/ConstellationPage';
import { buildConstellationViewModel } from '@/server/presenters/constellation-presenter';

export default function Page() {
  const model = buildConstellationViewModel();

  return <ConstellationPageView model={model} />;
}
