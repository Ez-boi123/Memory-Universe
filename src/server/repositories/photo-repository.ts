import { PhotoArchiveStatus } from '@prisma/client';

import { db } from '@/lib/db/client';

export const photoRepository = {
  listPending: async (relationshipId: string) =>
    db.photo.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
      where: {
        archiveStatus: PhotoArchiveStatus.pending_archive,
        relationshipId,
      },
    }),
  listTimeline: async (relationshipId: string) =>
    db.photo.findMany({
      orderBy: {
        memoryDate: 'desc',
      },
      where: {
        archiveStatus: PhotoArchiveStatus.archived,
        relationshipId,
      },
    }),
};
