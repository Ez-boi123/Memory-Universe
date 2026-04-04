import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  createArchivedPhotosForEvent,
  createEventPhotos,
  deleteArchivedPhotosByEventId,
  deleteEventPhotosByIds,
  findById,
  findPendingByIds,
  markConsumed,
  save,
  softDelete,
  update,
} = vi.hoisted(() => ({
  createArchivedPhotosForEvent: vi.fn(),
  createEventPhotos: vi.fn(),
  deleteArchivedPhotosByEventId: vi.fn(),
  deleteEventPhotosByIds: vi.fn(),
  findById: vi.fn(),
  findPendingByIds: vi.fn(),
  markConsumed: vi.fn(),
  save: vi.fn(),
  softDelete: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@/server/repositories/event-repository', () => ({
  eventRepository: {
    createEventPhotos,
    deleteEventPhotosByIds,
    findById,
    listByRelationship: vi.fn(),
    save,
    softDelete,
    update,
  },
}));

vi.mock('@/server/repositories/event-photo-upload-repository', () => ({
  eventPhotoUploadRepository: {
    findPendingByIds,
    markConsumed,
  },
}));

vi.mock('@/server/repositories/photo-repository', () => ({
  photoRepository: {
    createArchivedPhotosForEvent,
    deleteArchivedPhotosByEventId,
  },
}));

import { eventService } from './event-service';

describe('eventService', () => {
  beforeEach(() => {
    save.mockReset();
    createArchivedPhotosForEvent.mockReset();
    createEventPhotos.mockReset();
    deleteArchivedPhotosByEventId.mockReset();
    deleteEventPhotosByIds.mockReset();
    findById.mockReset();
    findPendingByIds.mockReset();
    markConsumed.mockReset();
    softDelete.mockReset();
    update.mockReset();
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
      syncToMilkyWay: false,
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
    expect(createArchivedPhotosForEvent).not.toHaveBeenCalled();
  });

  it('rejects saving an event with more than nine photos', async () => {
    const result = await eventService.saveEvent({
      body: 'We kept walking until the river looked like light.',
      createdBy: 'user-1',
      eventType: 'travel',
      locationText: 'Moonlit Pier',
      memoryDate: '2026-03-29',
      relationshipId: 'relationship-1',
      syncToMilkyWay: false,
      temporaryUploadIds: Array.from({ length: 10 }, (_, index) => `upload-${index + 1}`),
      title: 'Night Orbit',
      updatedBy: 'user-1',
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(['Each event can include up to 9 images.']);
    expect(save).not.toHaveBeenCalled();
  });

  it('updates an existing event when it belongs to the current relationship', async () => {
    findById.mockResolvedValue({
      id: 'event-1',
      relationshipId: 'relationship-1',
      deletedAt: null,
      eventPhotos: [
        {
          id: 'event-photo-1',
        },
      ],
    });
    update.mockResolvedValue({
      id: 'event-1',
      title: 'Updated Orbit',
    });
    findPendingByIds.mockResolvedValue([
      {
        displayUrl: 'https://cdn.example.com/photo-2.jpg',
        id: 'upload-2',
        originalUrl: 'https://cdn.example.com/photo-2.jpg',
        storageKey: 'planet-photos/tmp/relationship-1/photo-2.jpg',
        thumbnailUrl: 'https://cdn.example.com/photo-2.jpg',
        uploadedAt: new Date('2026-03-30T12:00:00Z'),
        uploadedBy: 'user-1',
      },
    ]);

    const result = await eventService.updateEvent({
      body: 'Updated body',
      eventId: 'event-1',
      eventType: 'daily',
      locationText: 'Moonlit Pier',
      memoryDate: '2026-03-29',
      retainedEventPhotoIds: ['event-photo-1'],
      relationshipId: 'relationship-1',
      syncToMilkyWay: false,
      temporaryUploadIds: ['upload-2'],
      title: 'Updated Orbit',
      updatedBy: 'user-1',
    });

    expect(result.ok).toBe(true);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'event-1',
        title: 'Updated Orbit',
        updatedBy: 'user-1',
      }),
    );
    expect(createEventPhotos).toHaveBeenCalledWith({
      eventId: 'event-1',
      photos: [
        expect.objectContaining({
          storageKey: 'planet-photos/tmp/relationship-1/photo-2.jpg',
        }),
      ],
    });
    expect(markConsumed).toHaveBeenCalledWith({
      eventId: 'event-1',
      ids: ['upload-2'],
    });
    expect(deleteEventPhotosByIds).not.toHaveBeenCalled();
  });

  it('removes event photos that are not retained during an update', async () => {
    findById.mockResolvedValue({
      id: 'event-1',
      relationshipId: 'relationship-1',
      deletedAt: null,
      eventPhotos: [
        { id: 'event-photo-1' },
        { id: 'event-photo-2' },
      ],
    });
    update.mockResolvedValue({
      id: 'event-1',
      title: 'Updated Orbit',
    });
    findPendingByIds.mockResolvedValue([]);

    const result = await eventService.updateEvent({
      body: 'Updated body',
      eventId: 'event-1',
      eventType: 'daily',
      locationText: 'Moonlit Pier',
      memoryDate: '2026-03-29',
      retainedEventPhotoIds: ['event-photo-2'],
      relationshipId: 'relationship-1',
      syncToMilkyWay: false,
      temporaryUploadIds: [],
      title: 'Updated Orbit',
      updatedBy: 'user-1',
    });

    expect(result.ok).toBe(true);
    expect(deleteEventPhotosByIds).toHaveBeenCalledWith(['event-photo-1']);
  });

  it('rejects updating an event when retained and new photos exceed nine total', async () => {
    findById.mockResolvedValue({
      id: 'event-1',
      relationshipId: 'relationship-1',
      deletedAt: null,
      eventPhotos: Array.from({ length: 9 }, (_, index) => ({
        id: `event-photo-${index + 1}`,
      })),
    });

    const result = await eventService.updateEvent({
      body: 'Updated body',
      eventId: 'event-1',
      eventType: 'daily',
      locationText: 'Moonlit Pier',
      memoryDate: '2026-03-29',
      retainedEventPhotoIds: Array.from({ length: 9 }, (_, index) => `event-photo-${index + 1}`),
      relationshipId: 'relationship-1',
      syncToMilkyWay: false,
      temporaryUploadIds: ['upload-10'],
      title: 'Updated Orbit',
      updatedBy: 'user-1',
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(['Each event can include up to 9 images.']);
    expect(update).not.toHaveBeenCalled();
  });

  it('syncs event photos to Milky Way when requested during creation', async () => {
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
        displayUrl: 'https://cdn.example.com/photo-1.jpg',
        id: 'event-photo-1',
        originalUrl: 'https://cdn.example.com/photo-1.jpg',
        thumbnailUrl: 'https://cdn.example.com/photo-1.jpg',
        uploadedAt: new Date('2026-03-29T12:00:00Z'),
        uploadedBy: 'user-1',
      },
    ]);

    const result = await eventService.saveEvent({
      body: 'We kept walking until the river looked like light.',
      createdBy: 'user-1',
      eventType: 'travel',
      locationText: 'Moonlit Pier',
      memoryDate: '2026-03-29',
      relationshipId: 'relationship-1',
      syncToMilkyWay: true,
      temporaryUploadIds: ['upload-1'],
      title: 'Night Orbit',
      updatedBy: 'user-1',
    });

    expect(result.ok).toBe(true);
    expect(deleteArchivedPhotosByEventId).toHaveBeenCalledWith({
      eventId: 'event-1',
      relationshipId: 'relationship-1',
    });
    expect(createArchivedPhotosForEvent).toHaveBeenCalledWith({
      eventId: 'event-1',
      memoryDate: new Date('2026-03-29'),
      photos: [
        {
          displayUrl: 'https://cdn.example.com/photo-1.jpg',
          originalUrl: 'https://cdn.example.com/photo-1.jpg',
          thumbnailUrl: 'https://cdn.example.com/photo-1.jpg',
          uploadedAt: new Date('2026-03-29T12:00:00Z'),
          uploadedBy: 'user-1',
        },
      ],
      relationshipId: 'relationship-1',
    });
  });

  it('soft deletes an existing event when it belongs to the current relationship', async () => {
    findById.mockResolvedValue({
      id: 'event-1',
      relationshipId: 'relationship-1',
      deletedAt: null,
    });

    const result = await eventService.deleteEvent({
      eventId: 'event-1',
      relationshipId: 'relationship-1',
    });

    expect(result.ok).toBe(true);
    expect(softDelete).toHaveBeenCalledWith('event-1');
  });
});
