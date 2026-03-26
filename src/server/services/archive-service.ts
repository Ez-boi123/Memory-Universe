import { photoRepository } from '@/server/repositories/photo-repository';

export const archiveService = {
  listPendingArchive: async () => ({
    result: await photoRepository.listPending(),
    note: 'TODO: separate pending archive flow from timeline.',
  }),
  archivePhotoMetadata: async () => ({
    result: null,
    note: 'TODO: confirm memory date and optional event relation before archive.',
  }),
};
