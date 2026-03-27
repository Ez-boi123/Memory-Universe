import { MilkyWayOverview } from '@/components/milky-way/MilkyWayOverview';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';

export default function MilkyWayPage() {
  return <MilkyWayOverview model={buildMilkyWayViewModel()} />;
}
