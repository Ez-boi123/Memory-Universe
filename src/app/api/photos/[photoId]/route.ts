import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { photoService } from '@/server/services/photo-service';

interface PhotoRouteContext {
  params: Promise<{
    photoId: string;
  }>;
}

export async function DELETE(_request: Request, { params }: PhotoRouteContext) {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json({ message: 'You need to sign in first.', ok: false }, { status: 401 });
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      { message: 'A relationship space is required before deleting photos.', ok: false },
      { status: 400 },
    );
  }

  const { photoId } = await params;
  const result = await photoService.deleteTimelinePhoto({
    photoId,
    relationshipId,
  });

  if (!result.ok) {
    return Response.json({ errors: result.errors, ok: false }, { status: 400 });
  }

  return Response.json({ ok: true });
}
