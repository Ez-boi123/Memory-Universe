import { PhotoArchiveStatus } from '@prisma/client';

import { db } from '@/lib/db/client';

export const photoRepository = {
  createArchivedPhotosForEvent: async ({
    eventId,
    eventTitle,
    memoryDate,
    note,
    photos,
    relationshipId,
  }: {
    eventId: string;
    eventTitle?: string | null;
    memoryDate: Date;
    note?: string | null;
    photos: Array<{
      displayUrl: string;
      originalUrl: string;
      thumbnailUrl: string;
      uploadedAt: Date;
      uploadedBy: string;
    }>;
    relationshipId: string;
  }) => {
    if (photos.length === 0) {
      return [];
    }

    await db.photo.createMany({
      data: photos.map((photo) => ({
        archiveStatus: PhotoArchiveStatus.archived,
        displayUrl: photo.displayUrl,
        eventTitle: eventTitle || null,
        memoryDate,
        note: note || null,
        originalUrl: photo.originalUrl,
        relatedEventId: eventId,
        relationshipId,
        thumbnailUrl: photo.thumbnailUrl,
        uploadedAt: photo.uploadedAt,
        uploadedBy: photo.uploadedBy,
      })),
    });

    return db.photo.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
      where: {
        archiveStatus: PhotoArchiveStatus.archived,
        relatedEventId: eventId,
        relationshipId,
      },
    });
  },
  createArchivedPhoto: async ({
    displayUrl,
    eventTitle,
    memoryDate,
    note,
    originalUrl,
    relationshipId,
    thumbnailUrl,
    uploadedAt,
    uploadedBy,
  }: {
    displayUrl: string;
    eventTitle?: string;
    memoryDate: Date;
    note?: string;
    originalUrl: string;
    relationshipId: string;
    thumbnailUrl: string;
    uploadedAt: Date;
    uploadedBy: string;
  }) =>
    db.photo.create({
      data: {
        archiveStatus: PhotoArchiveStatus.archived,
        displayUrl,
        eventTitle: eventTitle || null,
        memoryDate,
        note: note || null,
        originalUrl,
        relationshipId,
        thumbnailUrl,
        uploadedAt,
        uploadedBy,
      },
    }),
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
      include: {
        relatedEvent: {
          select: {
            body: true,
            locationText: true,
            title: true,
          },
        },
      },
      orderBy: {
        memoryDate: 'desc',
      },
      where: {
        archiveStatus: PhotoArchiveStatus.archived,
        relationshipId,
      },
    }),
  findArchivedById: async (photoId: string) =>
    db.photo.findUnique({
      where: {
        id: photoId,
      },
    }),
  deleteArchivedById: async (photoId: string) =>
    db.photo.delete({
      where: {
        id: photoId,
      },
    }),
  deleteArchivedPhotosByEventId: async ({
    eventId,
    relationshipId,
  }: {
    eventId: string;
    relationshipId: string;
  }) =>
    db.photo.deleteMany({
      where: {
        archiveStatus: PhotoArchiveStatus.archived,
        relatedEventId: eventId,
        relationshipId,
      },
    }),
};
