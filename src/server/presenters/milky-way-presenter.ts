import type { MilkyWayPageModel } from '@/types/milky-way';

interface BuildMilkyWayViewModelOptions {
  isEmpty?: boolean;
}

export function buildMilkyWayViewModel(
  options: BuildMilkyWayViewModelOptions = {},
): MilkyWayPageModel {
  const uploadTile = {
    title: 'Add to your Milky Way',
    description: 'Upload a photo, confirm the memory time, and optionally link it to an event.',
    defaultMemoryTime: '2026-03-27T10:30',
    eventLabel: 'Optional event',
    noteLabel: 'Optional note',
  };

  if (options.isEmpty) {
    return {
      title: 'Memory Milky Way',
      description: 'A time-led album for revisiting shared photos.',
      uploadTile,
      timeline: [],
      sections: [],
      emptyState: {
        title: 'Your Milky Way starts with one photo',
        description: 'The first upload becomes the opening memory in your timeline.',
      },
    };
  }

  return {
    title: 'Memory Milky Way',
    description: 'A time-led album for revisiting shared photos.',
    uploadTile,
    timeline: [
      {
        id: '2026-03',
        label: '2026 / 03',
        sectionId: 'milky-way-section-2026-03',
        isActive: true,
      },
      {
        id: '2026-02',
        label: '2026 / 02',
        sectionId: 'milky-way-section-2026-02',
        isActive: false,
      },
    ],
    sections: [
      {
        id: 'milky-way-section-2026-03',
        monthLabel: 'March 2026',
        entries: [
          {
            id: 'milky-way-entry-2026-03-18',
            dateLabel: 'March 18, 2026',
            note: 'The city felt quiet after midnight, so we kept walking.',
            photos: [
              { id: 'photo-1', alt: 'Night skyline', accent: 'violet' },
              { id: 'photo-2', alt: 'Street reflection', accent: 'blue' },
              { id: 'photo-3', alt: 'Cafe window', accent: 'rose' },
            ],
          },
        ],
      },
      {
        id: 'milky-way-section-2026-02',
        monthLabel: 'February 2026',
        entries: [
          {
            id: 'milky-way-entry-2026-02-09',
            dateLabel: 'February 9, 2026',
            photos: [{ id: 'photo-4', alt: 'Train platform', accent: 'blue' }],
          },
        ],
      },
    ],
    emptyState: null,
  };
}
