import { RelationshipSettingsPage } from '@/components/universe/RelationshipSettingsPage';
import { getSessionUser } from '@/lib/auth/session';
import { relationshipService } from '@/server/services/relationship-service';

interface RelationshipSettingsRouteProps {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
}

export default async function RelationshipSettingsRoute({
  searchParams,
}: RelationshipSettingsRouteProps) {
  const { error, success } = await searchParams;
  const { user } = await getSessionUser();
  const currentRelationship = user?.id
    ? (await relationshipService.getCurrentRelationship(user.id)).result
    : null;

  return (
    <RelationshipSettingsPage
      currentRelationship={currentRelationship}
      error={error}
      sessionUser={user}
      success={success}
    />
  );
}
