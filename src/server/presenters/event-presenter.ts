import type { MemoryEventSummary } from '@/types/domain';

export function presentMockEvents(): MemoryEventSummary[] {
  return [
    {
      id: 'event-placeholder-1',
      title: 'First Shared Memory Placeholder',
      bodyPreview: 'TODO: event list and detail data will come from the real service layer later.',
      memoryDate: '2026-03-01',
      locationText: 'Placeholder City',
      eventType: 'daily',
      updatedAt: '2026-03-24T20:00:00Z',
      updatedBy: 'Member One',
    },
    {
      id: 'event-placeholder-2',
      title: 'Second Shared Memory Placeholder',
      bodyPreview: 'TODO: event detail and edit data will come from the real service layer later.',
      memoryDate: '2026-03-12',
      locationText: 'Placeholder Library',
      eventType: 'travel',
      updatedAt: '2026-03-25T11:30:00Z',
      updatedBy: 'Member Two',
    },
    {
      id: 'event-placeholder-3',
      title: 'Third Shared Memory Placeholder',
      bodyPreview: 'TODO: milestone details will come from the real service layer later.',
      memoryDate: '2026-03-18',
      locationText: 'Placeholder Garden',
      eventType: 'anniversary',
      updatedAt: '2026-03-26T09:15:00Z',
      updatedBy: 'Member One',
    },
  ];
}
