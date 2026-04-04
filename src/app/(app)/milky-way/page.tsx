import { MilkyWayOverview } from '@/components/milky-way/MilkyWayOverview';
import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';
import { photoService } from '@/server/services/photo-service';

export default async function MilkyWayPage() {
  const { user } = await getSessionUser();
  const relationshipId = user?.id
    ? await resolveSessionRelationship(user.id, user.relationshipId)
    : null;
  const photos = relationshipId ? (await photoService.listTimelinePhotos(relationshipId)).result : [];
  const model = buildMilkyWayViewModel({
    photos: photos.map((photo) => ({
      archiveStatus: photo.archiveStatus,
      displayUrl: photo.displayUrl,
      eventTitle: photo.eventTitle ?? null,
      id: photo.id,
      memoryDate: photo.memoryDate?.toISOString().slice(0, 10) ?? null,
      note: photo.note ?? null,
      relatedEventBody: photo.relatedEvent?.body ?? null,
      relatedEventId: photo.relatedEventId ?? null,
      relatedEventLocationText: photo.relatedEvent?.locationText ?? null,
      relatedEventTitle: photo.relatedEvent?.title ?? null,
      thumbnailUrl: photo.thumbnailUrl,
      uploadedAt: photo.uploadedAt.toISOString(),
    })),
  });

  return <MilkyWayOverview model={model} />;
}
