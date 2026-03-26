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
  ];
}
