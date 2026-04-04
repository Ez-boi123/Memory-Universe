import { normalizeRelationCode } from '@/lib/auth/relation-code';
import { getDatabaseConfigurationError, isDatabaseConfigured } from '@/lib/env';
import { authRepository } from '@/server/repositories/auth-repository';
import { relationshipRepository } from '@/server/repositories/relationship-repository';

export const relationshipService = {
  createRelationship: async ({
    createdBy,
    memberIds,
  }: {
    createdBy: string;
    memberIds: [string, string];
  }) => ({
    result: await relationshipRepository.create({
      createdBy,
      memberIds,
    }),
  }),
  getCurrentRelationship: async (userId: string) => {
    const relationship = await relationshipRepository.findCurrentByUserId(userId);

    if (!relationship) {
      return {
        result: null,
      };
    }

    return {
      result: {
        id: relationship.id,
        members: relationship.members.map((member) => ({
          id: member.user.id,
          displayName: member.user.displayName,
          email: member.user.email,
        })),
        status: relationship.status,
        title:
          relationship.members.map((member) => member.user.displayName).join(' · ') ||
          'Memory Universe',
      },
    };
  },
  bindByRelationCode: async ({
    currentUserId,
    targetRelationCode,
  }: {
    currentUserId: string;
    targetRelationCode: string;
  }) => {
    if (!isDatabaseConfigured()) {
      return {
        error: getDatabaseConfigurationError(),
        ok: false as const,
      };
    }

    const normalizedCode = normalizeRelationCode(targetRelationCode);

    if (!normalizedCode) {
      return {
        error: 'Relation code is required.',
        ok: false as const,
      };
    }

    const [currentUser, targetUser, currentMembership] = await Promise.all([
      authRepository.findUserById(currentUserId),
      authRepository.findUserByRelationCode(normalizedCode),
      relationshipRepository.findMembershipByUserId(currentUserId),
    ]);

    if (!currentUser) {
      return {
        error: 'Current user could not be found.',
        ok: false as const,
      };
    }

    if (!targetUser) {
      return {
        error: 'No user was found for that relation code.',
        ok: false as const,
      };
    }

    if (targetUser.id === currentUserId) {
      return {
        error: 'You cannot bind a relationship with your own relation code.',
        ok: false as const,
      };
    }

    if (currentMembership) {
      return {
        error: 'Your account is already connected to a relationship.',
        ok: false as const,
      };
    }

    const targetMembership = await relationshipRepository.findMembershipByUserId(targetUser.id);

    if (targetMembership) {
      return {
        error: 'That user is already connected to a relationship.',
        ok: false as const,
      };
    }

    const relationship = await relationshipRepository.create({
      createdBy: currentUserId,
      memberIds: [currentUserId, targetUser.id],
    });

    return {
      ok: true as const,
      relationship,
      targetUser: {
        displayName: targetUser.displayName,
        id: targetUser.id,
      },
    };
  },
};
