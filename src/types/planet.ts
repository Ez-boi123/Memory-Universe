import type { EventType } from '@/types/domain';

export type PlanetLayoutSide = 'left' | 'right';
export type PlanetVariant = 'violet' | 'blue' | 'rose';

export interface PlanetPageHeaderViewModel {
  eyebrow: 'Planet';
  title: 'Memory Planet';
  description: string;
  actionLabel: 'New Event';
}

export interface PlanetEventCardViewModel {
  id: string;
  title: string;
  memoryDateLabel: string;
  eventTypeLabel: string;
  bodyPreview: string;
  locationText?: string | null;
  lastEditedBy: string;
  lastEditedAtLabel?: string;
  layoutSide: PlanetLayoutSide;
  planetVariant: PlanetVariant;
}

export interface PlanetEventDetailViewModel {
  id: string;
  title: string;
  memoryDateLabel: string;
  eventTypeLabel: string;
  body: string;
  locationText?: string | null;
  lastEditedBy: string;
  lastEditedAtLabel?: string;
  planetVariant: PlanetVariant;
}

export interface PlanetEventFormValues {
  title: string;
  memoryDate: string;
  eventType: EventType;
  locationText: string;
  body: string;
}

export interface PlanetEmptyStateViewModel {
  title: string;
  body: string;
  actionLabel: 'New Event';
}

export interface PlanetPageViewModel {
  header: PlanetPageHeaderViewModel;
  events: PlanetEventCardViewModel[];
  eventDetails: Record<string, PlanetEventDetailViewModel>;
  createDefaults: PlanetEventFormValues;
  emptyState: PlanetEmptyStateViewModel;
}
