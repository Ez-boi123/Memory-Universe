export interface UniverseHeroViewModel {
  eyebrow: string;
  title: string;
  description: string;
  statusLabel: string;
  memberSummary: string;
}

export type UniverseModuleVisualName = 'planet' | 'milky-way' | 'constellation';

export interface UniverseModuleCardViewModel {
  href: string;
  label: string;
  description: string;
  visualName: UniverseModuleVisualName;
}

export interface UniverseRecentPreviewItem {
  label: string;
  title: string;
  description: string;
}

export interface UniverseArchiveNote {
  title: string;
  body: string;
}

export type UniverseModuleGalleryViewModel = readonly [
  {
    href: '/planet';
    label: 'Memory Planet';
    description: string;
    visualName: 'planet';
  },
  {
    href: '/milky-way';
    label: 'Memory Milky Way';
    description: string;
    visualName: 'milky-way';
  },
  {
    href: '/constellation';
    label: 'Memory Constellation';
    description: string;
    visualName: 'constellation';
  },
];

export type UniverseRecentPreviewViewModel = readonly [
  {
    label: 'Latest Event';
    title: 'First Shared Chapter';
    description: string;
  },
  {
    label: 'Latest Photo Moment';
    title: 'A Memory Waiting In Time';
    description: string;
  },
  {
    label: 'Latest Message';
    title: 'A Small Note Still Glowing';
    description: string;
  },
];

export interface UniversePageViewModel {
  hero: UniverseHeroViewModel;
  moduleGallery: UniverseModuleGalleryViewModel;
  recentPreview: UniverseRecentPreviewViewModel;
  archiveNote: UniverseArchiveNote;
}
