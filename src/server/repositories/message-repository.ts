import { db } from '@/lib/db/client';

export const messageRepository = {
  listByRelationship: async (relationshipId: string) =>
    db.message.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        relationshipId,
      },
    }),
  create: async ({
    authorId,
    content,
    relationshipId,
  }: {
    authorId: string;
    content: string;
    relationshipId: string;
  }) =>
    db.message.create({
      data: {
        authorId,
        content,
        relationshipId,
      },
      include: {
        author: true,
      },
    }),
};
