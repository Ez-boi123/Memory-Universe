import type { PhotoSummary } from '@/types/domain';

export function presentMockPhotos(): PhotoSummary[] {
  return [
    {
      id: 'photo-placeholder-1',
      archiveStatus: 'pending_archive',
      memoryDate: null,
      uploadedAt: '2026-03-25T10:00:00Z',
      relatedEventId: null,
    },
    {
      id: 'photo-placeholder-2',
      archiveStatus: 'archived',
      memoryDate: '2026-02-14',
      uploadedAt: '2026-03-20T10:00:00Z',
      relatedEventId: 'event-placeholder-1',
    },
  ];
}
