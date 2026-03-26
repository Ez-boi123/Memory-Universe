import type { MessageSummary } from '@/types/domain';

export function presentMockMessages(): MessageSummary[] {
  return [
    {
      id: 'message-placeholder-1',
      content: 'TODO: message board will render real shared messages later.',
      authorName: 'Member Two',
      createdAt: '2026-03-25T08:30:00Z',
    },
  ];
}
