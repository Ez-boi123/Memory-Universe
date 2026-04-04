import { randomUUID } from 'node:crypto';

import { getObjectStorageConfigurationError, isObjectStorageConfigured } from '@/lib/env';
import { objectStorage } from '@/lib/storage/object-storage';
import { validatePhotoArchive, validatePhotoUpload } from '@/lib/validation/photo';
import { eventPhotoUploadRepository } from '@/server/repositories/event-photo-upload-repository';
import { photoRepository } from '@/server/repositories/photo-repository';
export const photoService = {
  uploadPhoto: async ({
    archiveDirectly,
    eventTitle,
    file,
    memoryDate,
    note,
    relationshipId,
    uploadedBy,
  }: {
    archiveDirectly?: boolean;
    eventTitle?: string;
    file: File;
    memoryDate?: string;
    note?: string;
    relationshipId: string;
    uploadedBy: string;
  }) => {
    const validation = validatePhotoUpload({
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });

    if (!validation.success) {
      return {
        errors: validation.errors,
        ok: false as const,
      };
    }

    if (!isObjectStorageConfigured()) {
      return {
        errors: [getObjectStorageConfigurationError()],
        ok: false as const,
      };
    }

    if (archiveDirectly) {
      const archiveValidation = validatePhotoArchive({ memoryDate });

      if (!archiveValidation.success) {
        return {
          errors: archiveValidation.errors,
          ok: false as const,
        };
      }
    }

    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const key = `planet-photos/tmp/${relationshipId}/${randomUUID()}.${extension}`;
    const body = Buffer.from(await file.arrayBuffer());
    const uploaded = await objectStorage.uploadFile({
      body,
      contentType: file.type || 'application/octet-stream',
      key,
    });
    const uploadedAt = new Date();

    if (archiveDirectly) {
      const photo = await photoRepository.createArchivedPhoto({
        displayUrl: uploaded.url,
        eventTitle: eventTitle?.trim(),
        memoryDate: new Date(`${memoryDate}T00:00:00.000Z`),
        note: note?.trim(),
        originalUrl: uploaded.url,
        relationshipId,
        thumbnailUrl: uploaded.url,
        uploadedAt,
        uploadedBy,
      });

      return {
        ok: true as const,
        photo,
      };
    }

    const temporaryUpload = await eventPhotoUploadRepository.createTemporaryUpload({
      displayUrl: uploaded.url,
      originalUrl: uploaded.url,
      relationshipId,
      storageKey: uploaded.key,
      thumbnailUrl: uploaded.url,
      uploadedAt,
      uploadedBy,
    });

    return {
      ok: true as const,
      upload: {
        id: temporaryUpload.id,
        displayUrl: uploaded.url,
        originalUrl: uploaded.url,
        storageKey: uploaded.key,
        thumbnailUrl: uploaded.url,
        uploadedAt: uploadedAt.toISOString(),
      },
    };
  },
  deleteTemporaryUploads: async ({
    uploadIds,
    relationshipId,
    uploadedBy,
  }: {
    uploadIds: string[];
    relationshipId: string;
    uploadedBy: string;
  }) => {
    if (uploadIds.length === 0) {
      return {
        ok: true as const,
      };
    }

    if (!isObjectStorageConfigured()) {
      return {
        errors: [getObjectStorageConfigurationError()],
        ok: false as const,
      };
    }

    const temporaryUploads = await eventPhotoUploadRepository.findPendingByIds({
      ids: uploadIds,
      relationshipId,
      uploadedBy,
    });

    await Promise.all(
      temporaryUploads.map((upload) => objectStorage.deleteFile(upload.storageKey)),
    );
    await eventPhotoUploadRepository.deleteMany(temporaryUploads.map((upload) => upload.id));

    return {
      ok: true as const,
    };
  },
  cleanupExpiredTemporaryUploads: async ({
    olderThanMs,
  }: {
    olderThanMs: number;
  }) => {
    const olderThan = new Date(Date.now() - olderThanMs);
    const expiredUploads = await eventPhotoUploadRepository.listExpiredPending(olderThan);

    if (expiredUploads.length === 0) {
      return {
        cleanedUploadCount: 0,
        ok: true as const,
      };
    }

    if (!isObjectStorageConfigured()) {
      return {
        errors: [getObjectStorageConfigurationError()],
        ok: false as const,
      };
    }

    await Promise.all(expiredUploads.map((upload) => objectStorage.deleteFile(upload.storageKey)));
    await eventPhotoUploadRepository.deleteMany(expiredUploads.map((upload) => upload.id));

    return {
      cleanedUploadCount: expiredUploads.length,
      ok: true as const,
    };
  },
  deleteTimelinePhoto: async ({
    photoId,
    relationshipId,
  }: {
    photoId: string;
    relationshipId: string;
  }) => {
    const photo = await photoRepository.findArchivedById(photoId);

    if (
      !photo ||
      photo.archiveStatus !== 'archived' ||
      photo.relationshipId !== relationshipId
    ) {
      return {
        errors: ['This photo could not be found.'],
        ok: false as const,
      };
    }

    await photoRepository.deleteArchivedById(photoId);

    return {
      ok: true as const,
    };
  },
  deleteTimelinePhotos: async ({
    photoIds,
    relationshipId,
  }: {
    photoIds: string[];
    relationshipId: string;
  }) => {
    for (const photoId of photoIds) {
      const result = await photoService.deleteTimelinePhoto({
        photoId,
        relationshipId,
      });

      if (!result.ok) {
        return result;
      }
    }

    return {
      ok: true as const,
    };
  },
  listTimelinePhotos: async (relationshipId: string) => ({
    result: await photoRepository.listTimeline(relationshipId),
  }),
};
