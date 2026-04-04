import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { photoService } from '@/server/services/photo-service';

export async function DELETE(request: Request) {
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

  const body = (await request.json()) as {
    photoIds?: string[];
  };
  const photoIds = Array.isArray(body.photoIds) ? body.photoIds.filter(Boolean) : [];

  if (photoIds.length === 0) {
    return Response.json(
      { message: 'Delete requests must include at least one photo id.', ok: false },
      { status: 400 },
    );
  }

  const result = await photoService.deleteTimelinePhotos({
    photoIds,
    relationshipId,
  });

  if (!result.ok) {
    return Response.json({ errors: result.errors, ok: false }, { status: 400 });
  }

  return Response.json({ ok: true });
}
