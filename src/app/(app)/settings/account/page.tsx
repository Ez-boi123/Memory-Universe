import { AccountPage } from '@/components/universe/AccountPage';
import { getSessionUser } from '@/lib/auth/session';
import { buildAccountPageViewModel } from '@/server/presenters/account-presenter';
import { relationshipService } from '@/server/services/relationship-service';

interface AccountSettingsPageProps {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
}

export default async function AccountSettingsPage({ searchParams }: AccountSettingsPageProps) {
  const { error, success } = await searchParams;
  const { user: sessionUser } = await getSessionUser();
  const relationship = sessionUser?.id
    ? (await relationshipService.getCurrentRelationship(sessionUser.id)).result
    : null;
  const model = buildAccountPageViewModel({
    bindError: error,
    bindSuccess: success,
    relationship,
    sessionUser,
  });

  return <AccountPage model={model} />;
}
