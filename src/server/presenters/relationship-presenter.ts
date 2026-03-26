import type { RelationshipSummary } from '@/types/domain';

export function presentRelationshipSummary(): RelationshipSummary {
  return {
    id: 'relationship-placeholder',
    status: 'pending',
    title: 'Memory Universe Placeholder',
    members: [
      {
        id: 'user-1',
        displayName: 'Member One',
        email: 'member.one@example.com',
      },
      {
        id: 'user-2',
        displayName: 'Member Two',
        email: 'member.two@example.com',
      },
    ],
  };
}
