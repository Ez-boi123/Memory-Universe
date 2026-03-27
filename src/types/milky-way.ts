export interface MilkyWayUploadTileModel {
  title: string;
  description: string;
}

export interface MilkyWayUploadPanelModel {
  defaultMemoryTime: string;
  eventLabel: string;
  noteLabel: string;
}

export interface MilkyWayEntryModel {
  id: string;
  dateLabel: string;
  note?: string;
  photos: MilkyWayPhotoModel[];
}

export interface MilkyWayPhotoModel {
  id: string;
  alt: string;
  accent: 'violet' | 'blue' | 'rose';
}

export interface MilkyWaySectionModel {
  id: string;
  monthLabel: string;
  entries: MilkyWayEntryModel[];
}

export interface MilkyWayTimelineNode {
  id: string;
  label: string;
  sectionId: string;
  isActive: boolean;
}

export interface MilkyWayPageModel {
  title: string;
  description: string;
  uploadTile: MilkyWayUploadTileModel;
  uploadPanel: MilkyWayUploadPanelModel;
  timeline: MilkyWayTimelineNode[];
  sections: MilkyWaySectionModel[];
  emptyState: {
    title: string;
    description: string;
  } | null;
}
