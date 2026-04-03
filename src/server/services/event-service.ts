import { validateEventDraft } from '@/lib/validation/event';
import { eventPhotoUploadRepository } from '@/server/repositories/event-photo-upload-repository';
import { eventRepository } from '@/server/repositories/event-repository';

export const eventService = {
  listEvents: async (relationshipId: string) => ({
    result: await eventRepository.listByRelationship(relationshipId),
  }),
  getEventDetail: async (eventId: string) => ({
    result: await eventRepository.findById(eventId),
  }),
  saveEvent: async ({
    body,
    createdBy,
    eventType,
    locationText,
    memoryDate,
    relationshipId,
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
    temporaryUploadIds: string[];
    title: string;
    updatedBy: string;
  }) => {
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

    return {
      event,
      ok: true as const,
      photos: attachedPhotos,
    };
  },
};
