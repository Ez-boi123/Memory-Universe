import type { MessageSummary } from '@/types/domain';

export function presentMockMessages(): MessageSummary[] {
  return [
    {
      id: 'message-1',
      content: 'Saved this quiet evening because it felt like it mattered.',
      authorName: 'Member Two',
      createdAt: '2026-03-23T08:30:00Z',
    },
    {
      id: 'message-2',
      content: 'Still thinking about your laugh from earlier today.',
      authorName: 'Member One',
      createdAt: '2026-03-25T20:15:00Z',
    },
    {
      id: 'message-3',
      content: 'Leaving a small note here so this ordinary day stays glowing.',
      authorName: 'Member Two',
      createdAt: '2026-03-26T07:45:00Z',
    },
  ];
}
