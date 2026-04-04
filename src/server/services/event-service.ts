import { validateEventDraft } from '@/lib/validation/event';
import { eventPhotoUploadRepository } from '@/server/repositories/event-photo-upload-repository';
import { eventRepository } from '@/server/repositories/event-repository';
import { photoRepository } from '@/server/repositories/photo-repository';

const MAX_EVENT_PHOTOS = 9;

async function syncEventToMilkyWay({
  eventId,
  memoryDate,
  photos,
  relationshipId,
}: {
  eventId: string;
  memoryDate: Date;
  photos: Array<{
    displayUrl: string;
    originalUrl: string;
    thumbnailUrl: string;
    uploadedAt: Date;
    uploadedBy: string;
  }>;
  relationshipId: string;
}) {
  await photoRepository.deleteArchivedPhotosByEventId({
    eventId,
    relationshipId,
  });

  await photoRepository.createArchivedPhotosForEvent({
    eventId,
    eventTitle: null,
    memoryDate,
    note: null,
    photos,
    relationshipId,
  });
}

export const eventService = {
  listEvents: async (relationshipId: string) => ({
    result: await eventRepository.listByRelationship(relationshipId),
  }),
  getEventDetail: async (eventId: string) => ({
    result: await eventRepository.findById(eventId),
  }),
  updateEvent: async ({
    body,
    eventId,
    eventType,
    locationText,
    memoryDate,
    retainedEventPhotoIds,
    relationshipId,
    syncToMilkyWay,
    temporaryUploadIds,
    title,
    updatedBy,
  }: {
    body: string;
    eventId: string;
    eventType?: 'anniversary' | 'travel' | 'daily' | 'festival';
    locationText?: string;
    memoryDate: string;
    retainedEventPhotoIds: string[];
    relationshipId: string;
    syncToMilkyWay?: boolean;
    temporaryUploadIds: string[];
    title: string;
    updatedBy: string;
  }) => {
    if (retainedEventPhotoIds.length + temporaryUploadIds.length > MAX_EVENT_PHOTOS) {
      return {
        errors: ['Each event can include up to 9 images.'],
        ok: false as const,
      };
    }

    const validation = validateEventDraft({
      body,
      eventType,
      locationText,
      memoryDate,
      title,
    });

    if (!validation.success) {
      return {
        errors: validation.errors,
        ok: false as const,
      };
    }

    const existingEvent = await eventRepository.findById(eventId);

    if (!existingEvent || existingEvent.deletedAt || existingEvent.relationshipId !== relationshipId) {
      return {
        errors: ['This event could not be found.'],
        ok: false as const,
      };
    }

    const pendingUploads = await eventPhotoUploadRepository.findPendingByIds({
      ids: temporaryUploadIds,
      relationshipId,
      uploadedBy: updatedBy,
    });

    if (pendingUploads.length !== temporaryUploadIds.length) {
      return {
        errors: ['Some uploaded images are no longer available. Please upload them again.'],
        ok: false as const,
      };
    }

    const normalizedDate = new Date(memoryDate);
    const event = await eventRepository.update({
      body: body.trim(),
      eventId,
      eventType,
      locationText: locationText?.trim(),
      memoryDate: normalizedDate,
      title: title.trim(),
      updatedBy,
    });
    const removedPhotoIds = existingEvent.eventPhotos
      .map((photo) => photo.id)
      .filter((photoId) => !retainedEventPhotoIds.includes(photoId));

    if (removedPhotoIds.length > 0) {
      await eventRepository.deleteEventPhotosByIds(removedPhotoIds);
    }

    const attachedPhotos =
      (await eventRepository.createEventPhotos({
        eventId,
        photos: pendingUploads.map((upload) => ({
          displayUrl: upload.displayUrl,
          originalUrl: upload.originalUrl,
          storageKey: upload.storageKey,
          thumbnailUrl: upload.thumbnailUrl,
          uploadedAt: upload.uploadedAt,
          uploadedBy: upload.uploadedBy,
        })),
      })) ?? [];
    await eventPhotoUploadRepository.markConsumed({
      eventId,
      ids: temporaryUploadIds,
    });

    const currentPhotos = [
      ...existingEvent.eventPhotos.filter((photo) => retainedEventPhotoIds.includes(photo.id)),
      ...attachedPhotos,
    ];

    if (syncToMilkyWay) {
      await syncEventToMilkyWay({
        eventId,
        memoryDate: normalizedDate,
        photos: currentPhotos.map((photo) => ({
          displayUrl: photo.displayUrl,
          originalUrl: photo.originalUrl,
          thumbnailUrl: photo.thumbnailUrl,
          uploadedAt: photo.uploadedAt,
          uploadedBy: photo.uploadedBy,
        })),
        relationshipId,
      });
    }

    return {
      event,
      photos: currentPhotos,
      ok: true as const,
    };
  },
  deleteEvent: async ({
    eventId,
    relationshipId,
  }: {
    eventId: string;
    relationshipId: string;
  }) => {
    const existingEvent = await eventRepository.findById(eventId);

    if (!existingEvent || existingEvent.deletedAt || existingEvent.relationshipId !== relationshipId) {
      return {
        errors: ['This event could not be found.'],
        ok: false as const,
      };
    }

    await eventRepository.softDelete(eventId);

    return {
      ok: true as const,
    };
  },
  saveEvent: async ({
    body,
    createdBy,
    eventType,
    locationText,
    memoryDate,
    relationshipId,
    syncToMilkyWay,
    temporaryUploadIds,
    title,
    updatedBy,
  }: {
    body: string;
    createdBy: string;
    eventType?: 'anniversary' | 'travel' | 'daily' | 'festival';
    locationText?: string;
    memoryDate: string;
    relationshipId: string;
    syncToMilkyWay?: boolean;
    temporaryUploadIds: string[];
    title: string;
    updatedBy: string;
  }) => {
    if (temporaryUploadIds.length > MAX_EVENT_PHOTOS) {
      return {
        errors: ['Each event can include up to 9 images.'],
        ok: false as const,
      };
    }

    const validation = validateEventDraft({
      body,
      eventType,
      locationText,
      memoryDate,
      title,
    });

    if (!validation.success) {
      return {
        errors: validation.errors,
        ok: false as const,
      };
    }

    const normalizedDate = new Date(memoryDate);
    const pendingUploads = await eventPhotoUploadRepository.findPendingByIds({
      ids: temporaryUploadIds,
      relationshipId,
      uploadedBy: createdBy,
    });

    if (pendingUploads.length !== temporaryUploadIds.length) {
      return {
        errors: ['Some uploaded images are no longer available. Please upload them again.'],
        ok: false as const,
      };
    }

    const event = await eventRepository.save({
      body: body.trim(),
      createdBy,
      eventType,
      locationText: locationText?.trim(),
      memoryDate: normalizedDate,
      relationshipId,
      title: title.trim(),
      updatedBy,
    });

    const attachedPhotos = await eventRepository.createEventPhotos({
      eventId: event.id,
      photos: pendingUploads.map((upload) => ({
        displayUrl: upload.displayUrl,
        originalUrl: upload.originalUrl,
        storageKey: upload.storageKey,
        thumbnailUrl: upload.thumbnailUrl,
        uploadedAt: upload.uploadedAt,
        uploadedBy: upload.uploadedBy,
      })),
    });
    await eventPhotoUploadRepository.markConsumed({
      eventId: event.id,
      ids: temporaryUploadIds,
    });

    if (syncToMilkyWay) {
      await syncEventToMilkyWay({
        eventId: event.id,
        memoryDate: normalizedDate,
        photos: attachedPhotos.map((photo) => ({
          displayUrl: photo.displayUrl,
          originalUrl: photo.originalUrl,
          thumbnailUrl: photo.thumbnailUrl,
          uploadedAt: photo.uploadedAt,
          uploadedBy: photo.uploadedBy,
        })),
        relationshipId,
      });
    }

    return {
      event,
      ok: true as const,
      photos: attachedPhotos,
    };
  },
};
