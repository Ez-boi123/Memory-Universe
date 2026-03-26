import { eventRepository } from '@/server/repositories/event-repository';

export const eventService = {
  listEvents: async () => ({
    result: await eventRepository.listByRelationship(),
    note: 'TODO: fetch canonical event list for the relationship.',
  }),
  getEventDetail: async () => ({
    result: await eventRepository.findById(),
    note: 'TODO: load event detail and edit metadata.',
  }),
  saveEvent: async () => ({
    result: await eventRepository.save(),
    note: 'TODO: implement last-write-wins save and version snapshot creation.',
  }),
};
