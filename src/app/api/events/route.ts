import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { eventService } from '@/server/services/event-service';
import type { EventType } from '@/types/domain';

export async function GET() {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json({ message: 'You need to sign in first.', ok: false }, { status: 401 });
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      { message: 'A relationship space is required before viewing events.', ok: false },
      { status: 400 },
    );
  }

  const result = await eventService.listEvents(relationshipId);

  return Response.json({ events: result.result, ok: true });
}

export async function POST(request: Request) {
  const { user } = await getSessionUser();

  if (!user?.id) {
    return Response.json({ message: 'You need to sign in first.', ok: false }, { status: 401 });
  }

  const relationshipId = await resolveSessionRelationship(user.id, user.relationshipId);

  if (!relationshipId) {
    return Response.json(
      { message: 'A relationship space is required before creating events.', ok: false },
      { status: 400 },
    );
  }

  const payload = (await request.json()) as {
    body?: string;
    eventType?: EventType;
    locationText?: string;
    memoryDate?: string;
    syncToMilkyWay?: boolean;
    temporaryUploadIds?: string[];
    title?: string;
  };
  const result = await eventService.saveEvent({
    body: payload.body ?? '',
    createdBy: user.id,
    eventType: payload.eventType,
    locationText: payload.locationText ?? '',
    memoryDate: payload.memoryDate ?? '',
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
