import { inviteRepository } from '@/server/repositories/invite-repository';

export const inviteService = {
  generateInvite: async () => ({
    result: await inviteRepository.create(),
    note: 'TODO: implement invite token/code generation and expiry.',
  }),
  acceptInvite: async () => ({
    result: await inviteRepository.findByToken(),
    note: 'TODO: validate invite state and activate relationship.',
  }),
};
