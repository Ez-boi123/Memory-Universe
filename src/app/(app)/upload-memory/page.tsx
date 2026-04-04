import { getSessionUser, resolveSessionRelationship } from '@/lib/auth/session';
import { PendingArchivePlaceholder } from '@/components/milky-way/PendingArchivePlaceholder';
import { archiveService } from '@/server/services/archive-service';

export default async function UploadMemoryPage() {
  const { user } = await getSessionUser();
  const relationshipId = user?.id
    ? await resolveSessionRelationship(user.id, user.relationshipId)
    : null;
  const pendingPhotos = relationshipId
    ? (await archiveService.listPendingArchive(relationshipId)).result
    : [];

  return (
    <PendingArchivePlaceholder
      photos={pendingPhotos.map((photo) => ({
        archiveStatus: photo.archiveStatus,
        id: photo.id,
        memoryDate: photo.memoryDate?.toISOString().slice(0, 10) ?? null,
        relatedEventId: null,
        uploadedAt: photo.uploadedAt.toISOString(),
      }))}
    />
  );
}
