import { auth } from '@/auth';
import { db } from '@/lib/db/client';

export async function getSessionUser() {
  const session = await auth();

  return {
    user: session?.user ?? null,
    note:
      'TODO: replace placeholder session data with real relationship-aware session enrichment.',
  };
}

export async function resolveSessionRelationship(userId: string, relationshipId?: string | null) {
  if (relationshipId) {
    return relationshipId;
  }

  const membership = await db.relationshipMember.findFirst({
    orderBy: {
      joinedAt: 'asc',
    },
    where: {
      userId,
    },
  });

  return membership?.relationshipId ?? null;
}
