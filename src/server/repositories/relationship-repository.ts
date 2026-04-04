import { db } from '@/lib/db/client';

export const relationshipRepository = {
  create: async ({
    createdBy,
    memberIds,
  }: {
    createdBy: string;
    memberIds: [string, string];
  }) =>
    db.relationship.create({
      data: {
        createdBy,
        status: 'active',
        members: {
          create: memberIds.map((userId, index) => ({
            role: index === 0 ? 'owner' : 'member',
            userId,
          })),
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    }),
  findCurrentByUserId: async (userId: string) =>
    db.relationship.findFirst({
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    }),
  findMembershipByUserId: async (userId: string) =>
    db.relationshipMember.findFirst({
      include: {
        relationship: true,
      },
      orderBy: {
        joinedAt: 'asc',
      },
      where: {
        userId,
      },
    }),
};
