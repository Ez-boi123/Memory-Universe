import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  createArchivedPhoto,
  createTemporaryUpload,
  deleteArchivedById,
  deleteFile,
  deleteMany,
  findArchivedById,
  findPendingByIds,
  listExpiredPending,
  uploadFile,
} = vi.hoisted(() => ({
  createArchivedPhoto: vi.fn(),
  createTemporaryUpload: vi.fn(),
  deleteArchivedById: vi.fn(),
  deleteFile: vi.fn(),
  deleteMany: vi.fn(),
  findArchivedById: vi.fn(),
  findPendingByIds: vi.fn(),
  listExpiredPending: vi.fn(),
  uploadFile: vi.fn(),
}));

vi.mock('@/lib/storage/object-storage', () => ({
  objectStorage: {
    deleteFile,
    uploadFile,
  },
}));

vi.mock('@/server/repositories/event-photo-upload-repository', () => ({
  eventPhotoUploadRepository: {
    createTemporaryUpload,
    deleteMany,
    findPendingByIds,
    listExpiredPending,
  },
}));

vi.mock('@/server/repositories/photo-repository', () => ({
  photoRepository: {
    createArchivedPhoto,
    deleteArchivedById,
    findArchivedById,
    listTimeline: vi.fn(),
  },
}));

vi.mock('@/lib/env', () => ({
  getObjectStorageConfigurationError: () => 'Object storage is not configured.',
  isObjectStorageConfigured: () => true,
}));

import { photoService } from './photo-service';

describe('photoService', () => {
  beforeEach(() => {
    uploadFile.mockReset();
    deleteFile.mockReset();
    createArchivedPhoto.mockReset();
    createTemporaryUpload.mockReset();
    deleteArchivedById.mockReset();
    listExpiredPending.mockReset();
    deleteMany.mockReset();
    findArchivedById.mockReset();
    findPendingByIds.mockReset();
  });

  it('stores uploaded event images as temporary uploads before the event is saved', async () => {
    uploadFile.mockResolvedValue({
      key: 'planet-photos/tmp/relationship-1/photo-1.jpg',
      url: 'https://cdn.example.com/photo-1.jpg',
    });
    createTemporaryUpload.mockResolvedValue({
      id: 'upload-1',
      storageKey: 'planet-photos/tmp/relationship-1/photo-1.jpg',
      uploadedAt: new Date('2026-03-29T12:00:00Z'),
    });

    const file = {
      arrayBuffer: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
      name: 'orbit.jpg',
      size: 3,
      type: 'image/jpeg',
    } as unknown as File;

    const result = await photoService.uploadPhoto({
      file,
      relationshipId: 'relationship-1',
      uploadedBy: 'user-1',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected upload to succeed.');
    }
    expect(uploadFile).toHaveBeenCalled();
    expect(createTemporaryUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        relationshipId: 'relationship-1',
        storageKey: 'planet-photos/tmp/relationship-1/photo-1.jpg',
        uploadedBy: 'user-1',
      }),
    );
    expect(result.upload?.id).toBe('upload-1');
  });

  it('can upload a photo directly into the milky way timeline with a shared memory date', async () => {
    uploadFile.mockResolvedValue({
      key: 'planet-photos/tmp/relationship-1/photo-2.jpg',
      url: 'https://cdn.example.com/photo-2.jpg',
    });
    createArchivedPhoto.mockResolvedValue({
      archiveStatus: 'archived',
      id: 'photo-2',
      memoryDate: new Date('2026-04-03T00:00:00.000Z'),
      uploadedAt: new Date('2026-04-03T10:00:00.000Z'),
    });

    const file = {
      arrayBuffer: vi.fn().mockResolvedValue(new Uint8Array([4, 5, 6]).buffer),
      name: 'aurora.jpg',
      size: 3,
      type: 'image/jpeg',
    } as unknown as File;

    const result = await photoService.uploadPhoto({
      archiveDirectly: true,
      eventTitle: 'Boardwalk Evening',
      file,
      memoryDate: '2026-04-03',
      note: 'A quiet blue hour by the water.',
      relationshipId: 'relationship-1',
      uploadedBy: 'user-1',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error('Expected direct archive upload to succeed.');
    }
    expect(createArchivedPhoto).toHaveBeenCalledWith(
      expect.objectContaining({
        eventTitle: 'Boardwalk Evening',
        memoryDate: new Date('2026-04-03T00:00:00.000Z'),
        note: 'A quiet blue hour by the water.',
        relationshipId: 'relationship-1',
        uploadedBy: 'user-1',
      }),
    );
    expect(createTemporaryUpload).not.toHaveBeenCalled();
    expect(result.photo?.id).toBe('photo-2');
  });

  it('cleans up expired pending temporary uploads from storage and the database', async () => {
    listExpiredPending.mockResolvedValue([
      {
        id: 'upload-1',
        storageKey: 'planet-photos/tmp/relationship-1/photo-1.jpg',
      },
      {
        id: 'upload-2',
        storageKey: 'planet-photos/tmp/relationship-2/photo-2.jpg',
      },
    ]);

    const result = await photoService.cleanupExpiredTemporaryUploads({
      olderThanMs: 60 * 60 * 1000,
    });

    expect(result.ok).toBe(true);
    expect(deleteFile).toHaveBeenCalledTimes(2);
    expect(deleteMany).toHaveBeenCalledWith(['upload-1', 'upload-2']);
  });

  it('deletes an archived milky way photo when it belongs to the current relationship', async () => {
    findArchivedById.mockResolvedValue({
      archiveStatus: 'archived',
      id: 'photo-9',
      relationshipId: 'relationship-1',
    });

    const result = await photoService.deleteTimelinePhoto({
      photoId: 'photo-9',
      relationshipId: 'relationship-1',
    });

    expect(result.ok).toBe(true);
    expect(deleteArchivedById).toHaveBeenCalledWith('photo-9');
  });

  it('deletes multiple archived milky way photos when they belong to the current relationship', async () => {
    findArchivedById
      .mockResolvedValueOnce({
        archiveStatus: 'archived',
        id: 'photo-1',
        relationshipId: 'relationship-1',
      })
      .mockResolvedValueOnce({
        archiveStatus: 'archived',
        id: 'photo-2',
        relationshipId: 'relationship-1',
      });

    const result = await photoService.deleteTimelinePhotos({
      photoIds: ['photo-1', 'photo-2'],
      relationshipId: 'relationship-1',
    });

    expect(result.ok).toBe(true);
    expect(deleteArchivedById).toHaveBeenNthCalledWith(1, 'photo-1');
    expect(deleteArchivedById).toHaveBeenNthCalledWith(2, 'photo-2');
  });
});
