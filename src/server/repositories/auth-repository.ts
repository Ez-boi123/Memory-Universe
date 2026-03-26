import { db } from '@/lib/db/client';

export const authRepository = {
  createUser: async ({
    email,
    displayName,
    passwordHash,
  }: {
    email: string;
    displayName: string;
    passwordHash: string;
  }) =>
    db.user.create({
      data: {
        email,
        name: displayName,
        displayName,
        passwordHash,
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
};
