import { relationshipRepository } from '@/server/repositories/relationship-repository';

export const relationshipService = {
  createRelationship: async () => ({
    result: await relationshipRepository.create(),
    note: 'TODO: enforce one relationship space per user.',
  }),
  getCurrentRelationship: async () => ({
    result: await relationshipRepository.findCurrentByUserId(),
    note: 'TODO: attach membership checks and summary presenter.',
  }),
};
