import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  createTemporaryUpload,
  deleteFile,
  deleteMany,
  findPendingByIds,
  listExpiredPending,
  uploadFile,
} = vi.hoisted(() => ({
  createTemporaryUpload: vi.fn(),
  deleteFile: vi.fn(),
  deleteMany: vi.fn(),
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

vi.mock('@/lib/env', () => ({
  getObjectStorageConfigurationError: () => 'Object storage is not configured.',
  isObjectStorageConfigured: () => true,
}));

import { photoService } from './photo-service';

describe('photoService', () => {
  beforeEach(() => {
    uploadFile.mockReset();
    deleteFile.mockReset();
    createTemporaryUpload.mockReset();
    listExpiredPending.mockReset();
    deleteMany.mockReset();
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
    expect(result.upload.id).toBe('upload-1');
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
});
