import { messageRepository } from '@/server/repositories/message-repository';

export const messageService = {
  listMessages: async () => ({
    result: await messageRepository.listByRelationship(),
    note: 'TODO: list newest-first relationship messages.',
  }),
  createMessage: async () => ({
    result: await messageRepository.create(),
    note: 'TODO: persist a short relationship message.',
  }),
};
