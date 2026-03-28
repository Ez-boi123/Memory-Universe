import { AccountPage } from '@/components/universe/AccountPage';
import { getSessionUser } from '@/lib/auth/session';
import { presentRelationshipSummary } from '@/server/presenters/relationship-presenter';
import { buildAccountPageViewModel } from '@/server/presenters/account-presenter';

export default async function AccountSettingsPage() {
  const { user: sessionUser } = await getSessionUser();
  const relationship = sessionUser?.relationshipId ? presentRelationshipSummary() : null;
  const model = buildAccountPageViewModel({
    relationship,
    sessionUser,
  });

  return <AccountPage model={model} />;
}
