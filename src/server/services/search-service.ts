import { searchRepository } from '@/server/repositories/search-repository';

export const searchService = {
  search: async () => ({
    result: await searchRepository.searchUniverseContent(),
    note: 'TODO: search events and messages by keyword and date range.',
  }),
};
