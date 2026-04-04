import { db } from '@/lib/db/client';

export const authRepository = {
  createUser: async ({
    email,
    displayName,
    passwordHash,
    relationCode,
  }: {
    email: string;
    displayName: string;
    passwordHash: string;
    relationCode: string;
  }) =>
    db.user.create({
      data: {
        email,
        name: displayName,
        displayName,
        passwordHash,
        relationCode,
      },
    }),
  findUserById: async (id: string) =>
    db.user.findUnique({
      where: {
        id,
      },
      include: {
        relationships: {
          include: {
            relationship: true,
          },
          orderBy: {
            joinedAt: 'asc',
          },
          take: 1,
        },
      },
    }),
  findUserByEmail: async (email: string) =>
    db.user.findUnique({
      where: {
        email,
      },
      include: {
        relationships: {
          include: {
            relationship: true,
          },
          orderBy: {
            joinedAt: 'asc',
          },
          take: 1,
        },
      },
    }),
  findUserByRelationCode: async (relationCode: string) =>
    db.user.findUnique({
      where: {
        relationCode,
      },
      include: {
        relationships: {
          include: {
            relationship: true,
          },
          orderBy: {
            joinedAt: 'asc',
          },
          take: 1,
        },
      },
    }),
  deleteUserById: async (id: string) =>
    db.user.delete({
      where: {
        id,
      },
    }),
};
