import { db } from '@/lib/db/client';

export const eventRepository = {
  listByRelationship: async (relationshipId: string) =>
    db.memoryEvent.findMany({
      include: {
        eventPhotos: {
          orderBy: {
            uploadedAt: 'desc',
          },
        },
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          memoryDate: 'desc',
        },
      ],
      where: {
        deletedAt: null,
        relationshipId,
      },
    }),
  findById: async (eventId: string) =>
    db.memoryEvent.findUnique({
      include: {
        eventPhotos: true,
      },
      where: {
        id: eventId,
      },
    }),
  update: async ({
    body,
    eventId,
    eventType,
    locationText,
    memoryDate,
    title,
    updatedBy,
  }: {
    body: string;
    eventId: string;
    eventType?: 'anniversary' | 'travel' | 'daily' | 'festival';
    locationText?: string;
    memoryDate: Date;
    title: string;
    updatedBy: string;
  }) =>
    db.memoryEvent.update({
      data: {
        body,
        eventType: eventType ?? null,
        locationText: locationText || null,
        memoryDate,
        title,
        updatedBy,
      },
      include: {
        eventPhotos: {
          orderBy: {
            uploadedAt: 'desc',
          },
        },
      },
      where: {
        id: eventId,
      },
    }),
  deleteEventPhotosByIds: async (ids: string[]) => {
    if (ids.length === 0) {
      return;
    }

    await db.eventPhoto.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  },
  softDelete: async (eventId: string) =>
    db.memoryEvent.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: eventId,
      },
    }),
  save: async ({
    body,
    createdBy,
    eventType,
    locationText,
    memoryDate,
    relationshipId,
    title,
    updatedBy,
  }: {
    body: string;
    createdBy: string;
    eventType?: 'anniversary' | 'travel' | 'daily' | 'festival';
    locationText?: string;
    memoryDate: Date;
    relationshipId: string;
    title: string;
    updatedBy: string;
  }) =>
    db.memoryEvent.create({
      data: {
        body,
        createdBy,
        eventType: eventType ?? null,
        locationText: locationText || null,
        memoryDate,
        relationshipId,
        title,
        updatedBy,
      },
    }),
  createEventPhotos: async ({
    eventId,
    photos,
  }: {
    eventId: string;
    photos: Array<{
      displayUrl: string;
      originalUrl: string;
      storageKey: string;
      thumbnailUrl: string;
      uploadedAt: Date;
      uploadedBy: string;
    }>;
  }) => {
    if (photos.length === 0) {
      return [];
    }

    await db.eventPhoto.createMany({
      data: photos.map((photo) => ({
        displayUrl: photo.displayUrl,
        eventId,
        originalUrl: photo.originalUrl,
        storageKey: photo.storageKey,
        thumbnailUrl: photo.thumbnailUrl,
        uploadedAt: photo.uploadedAt,
        uploadedBy: photo.uploadedBy,
      })),
    });

    return db.eventPhoto.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
      where: {
        eventId,
      },
    });
  },
};
