import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { eventService } from '@/server/services/event-service';
import type { EventType } from '@/types/domain';

interface EventRouteContext {
  params: Promise<{
    eventId: string;
  }>;
}

export async function PATCH(request: Request, { params }: EventRouteContext) {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json({ message: 'You need to sign in first.', ok: false }, { status: 401 });
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      { message: 'A relationship space is required before editing events.', ok: false },
      { status: 400 },
    );
  }

  const { eventId } = await params;
  const payload = (await request.json()) as {
    body?: string;
    eventType?: EventType;
    locationText?: string;
    memoryDate?: string;
    retainedEventPhotoIds?: string[];
    syncToMilkyWay?: boolean;
    temporaryUploadIds?: string[];
    title?: string;
  };
  const result = await eventService.updateEvent({
    body: payload.body ?? '',
    eventId,
    eventType: payload.eventType,
    locationText: payload.locationText ?? '',
    memoryDate: payload.memoryDate ?? '',
    retainedEventPhotoIds: Array.isArray(payload.retainedEventPhotoIds)
      ? payload.retainedEventPhotoIds.filter(Boolean)
      : [],
    relationshipId,
    syncToMilkyWay: payload.syncToMilkyWay === true,
    temporaryUploadIds: Array.isArray(payload.temporaryUploadIds)
      ? payload.temporaryUploadIds.filter(Boolean)
      : [],
    title: payload.title ?? '',
    updatedBy: user.id,
  });

  if (!result.ok) {
    return Response.json({ errors: result.errors, ok: false }, { status: 400 });
  }

  return Response.json({
    event: result.event,
    ok: true,
    photos: result.photos,
  });
}

export async function DELETE(_request: Request, { params }: EventRouteContext) {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json({ message: 'You need to sign in first.', ok: false }, { status: 401 });
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      { message: 'A relationship space is required before deleting events.', ok: false },
      { status: 400 },
    );
  }

  const { eventId } = await params;
  const result = await eventService.deleteEvent({
    eventId,
    relationshipId,
  });

  if (!result.ok) {
    return Response.json({ errors: result.errors, ok: false }, { status: 400 });
  }

  return Response.json({ ok: true });
}
