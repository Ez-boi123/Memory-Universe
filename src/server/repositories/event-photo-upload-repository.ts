import { db } from '@/lib/db/client';

export const eventPhotoUploadRepository = {
  createTemporaryUpload: async ({
    displayUrl,
    originalUrl,
    relationshipId,
    storageKey,
    thumbnailUrl,
    uploadedAt,
    uploadedBy,
  }: {
    displayUrl: string;
    originalUrl: string;
    relationshipId: string;
    storageKey: string;
    thumbnailUrl: string;
    uploadedAt: Date;
    uploadedBy: string;
  }) =>
    db.eventPhotoUpload.create({
      data: {
        displayUrl,
        originalUrl,
        relationshipId,
        storageKey,
        thumbnailUrl,
        uploadedAt,
        uploadedBy,
      },
    }),
  deleteMany: async (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    await db.eventPhotoUpload.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  },
  findPendingByIds: async ({
    ids,
    relationshipId,
    uploadedBy,
  }: {
    ids: string[];
    relationshipId: string;
    uploadedBy: string;
  }) => {
    if (ids.length === 0) {
      return [];
    }

    return db.eventPhotoUpload.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
      where: {
        id: {
          in: ids,
        },
        relationshipId,
        status: 'pending',
        uploadedBy,
      },
    });
  },
  listExpiredPending: async (olderThan: Date) =>
    db.eventPhotoUpload.findMany({
      orderBy: {
        uploadedAt: 'asc',
      },
      where: {
        status: 'pending',
        uploadedAt: {
          lt: olderThan,
        },
      },
    }),
  markConsumed: async ({
    eventId,
    ids,
  }: {
    eventId: string;
    ids: string[];
  }) => {
    if (ids.length === 0) {
      return;
    }

    await db.eventPhotoUpload.updateMany({
      data: {
        consumedAt: new Date(),
        consumedByEventId: eventId,
        status: 'consumed',
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  },
};
