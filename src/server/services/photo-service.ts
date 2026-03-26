import { photoRepository } from '@/server/repositories/photo-repository';

export const photoService = {
  uploadPhoto: async () => ({
    result: await photoRepository.saveUpload(),
    note: 'TODO: implement file validation and storage upload pipeline.',
  }),
  listTimelinePhotos: async () => ({
    result: await photoRepository.listTimeline(),
    note: 'TODO: return archived photos ordered by user-confirmed memory date.',
  }),
};
