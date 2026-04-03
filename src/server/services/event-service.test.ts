import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createEventPhotos, findPendingByIds, markConsumed, save } = vi.hoisted(() => ({
  createEventPhotos: vi.fn(),
  findPendingByIds: vi.fn(),
  markConsumed: vi.fn(),
  save: vi.fn(),
}));

vi.mock('@/server/repositories/event-repository', () => ({
  eventRepository: {
    createEventPhotos,
    findById: vi.fn(),
    listByRelationship: vi.fn(),
    save,
  },
}));

vi.mock('@/server/repositories/event-photo-upload-repository', () => ({
  eventPhotoUploadRepository: {
    findPendingByIds,
    markConsumed,
  },
}));

import { eventService } from './event-service';

describe('eventService', () => {
  beforeEach(() => {
    save.mockReset();
    createEventPhotos.mockReset();
    findPendingByIds.mockReset();
    markConsumed.mockReset();
  });

  it('consumes pending temporary uploads by id when saving an event', async () => {
    save.mockResolvedValue({
      id: 'event-1',
      title: 'Night Orbit',
    });
    findPendingByIds.mockResolvedValue([
      {
        displayUrl: 'https://cdn.example.com/photo-1.jpg',
        id: 'upload-1',
        originalUrl: 'https://cdn.example.com/photo-1.jpg',
        storageKey: 'planet-photos/tmp/relationship-1/photo-1.jpg',
        thumbnailUrl: 'https://cdn.example.com/photo-1.jpg',
        uploadedAt: new Date('2026-03-29T12:00:00Z'),
        uploadedBy: 'user-1',
      },
    ]);
    createEventPhotos.mockResolvedValue([
      {
        id: 'event-photo-1',
        thumbnailUrl: 'https://cdn.example.com/photo-1.jpg',
      },
    ]);

    const result = await eventService.saveEvent({
      body: 'We kept walking until the river looked like light.',
      createdBy: 'user-1',
      eventType: 'travel',
      locationText: 'Moonlit Pier',
      memoryDate: '2026-03-29',
      relationshipId: 'relationship-1',
      temporaryUploadIds: ['upload-1'],
      title: 'Night Orbit',
      updatedBy: 'user-1',
    });

    expect(result.ok).toBe(true);
    expect(findPendingByIds).toHaveBeenCalledWith({
      ids: ['upload-1'],
      relationshipId: 'relationship-1',
      uploadedBy: 'user-1',
    });
    expect(createEventPhotos).toHaveBeenCalledWith({
      eventId: 'event-1',
      photos: [
        expect.objectContaining({
          storageKey: 'planet-photos/tmp/relationship-1/photo-1.jpg',
        }),
      ],
    });
    expect(markConsumed).toHaveBeenCalledWith({
      eventId: 'event-1',
      ids: ['upload-1'],
    });
  });
});
