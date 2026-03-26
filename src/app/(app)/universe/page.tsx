import { UniverseOverview } from '@/components/universe/UniverseOverview';
import { getSessionUser } from '@/lib/auth/session';
import { presentRelationshipSummary } from '@/server/presenters/relationship-presenter';
import { buildUniverseViewModel } from '@/server/presenters/universe-presenter';

export default async function UniversePage() {
  const { user: sessionUser } = await getSessionUser();
  const relationship = presentRelationshipSummary();
  const model = buildUniverseViewModel({
    relationship,
    sessionUser,
  });

  return <UniverseOverview model={model} />;
}
