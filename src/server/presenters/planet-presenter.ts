import type {
  PlanetEventCardViewModel,
  PlanetEventDetailViewModel,
  PlanetPageViewModel,
  PlanetVariant,
} from '@/types/planet';
import type { MemoryEventSummary } from '@/types/domain';

import { presentMockEvents } from './event-presenter';

const PLANET_VARIANTS: PlanetVariant[] = ['violet', 'blue', 'rose'];

const planetHeader: PlanetPageViewModel['header'] = {
  eyebrow: 'Planet',
  title: 'Memory Planet',
  description: 'Recorded shared events, revisited like a calm orbital archive.',
  actionLabel: 'New Event',
};

const planetEmptyState: PlanetPageViewModel['emptyState'] = {
  title: 'Record the first event in this archive',
  body: 'Shared events will appear here as distinct planets once the first memory is saved.',
  actionLabel: 'New Event',
};

const createDefaults: PlanetPageViewModel['createDefaults'] = {
  title: '',
  memoryDate: '',
  eventType: 'daily',
  locationText: '',
  body: '',
};

function formatEventTypeLabel(eventType: MemoryEventSummary['eventType']): string {
  return eventType ? eventType[0].toUpperCase() + eventType.slice(1) : 'Memory';
}

function buildEventCard(
  event: MemoryEventSummary,
  index: number,
): PlanetEventCardViewModel {
  return {
    id: event.id,
    title: event.title,
    memoryDateLabel: event.memoryDate,
    eventTypeLabel: formatEventTypeLabel(event.eventType),
    bodyPreview: event.bodyPreview,
    locationText: event.locationText ?? null,
    lastEditedBy: event.updatedBy,
    lastEditedAtLabel: event.updatedAt,
    layoutSide: index % 2 === 0 ? 'left' : 'right',
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
  };
}

function buildEventDetail(
  event: MemoryEventSummary,
  index: number,
): PlanetEventDetailViewModel {
  return {
    id: event.id,
    title: event.title,
    memoryDateLabel: event.memoryDate,
    eventTypeLabel: formatEventTypeLabel(event.eventType),
    body: event.bodyPreview,
    locationText: event.locationText ?? null,
    lastEditedBy: event.updatedBy,
    lastEditedAtLabel: event.updatedAt,
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
  };
}

export function buildPlanetPageViewModel(input?: {
  events?: MemoryEventSummary[];
}): PlanetPageViewModel {
  const source = input?.events ?? presentMockEvents();
  const ordered = [...source].sort((left, right) => right.memoryDate.localeCompare(left.memoryDate));

  return {
    header: planetHeader,
    events: ordered.map((event, index) => buildEventCard(event, index)),
    eventDetails: Object.fromEntries(
      ordered.map((event, index) => [event.id, buildEventDetail(event, index)]),
    ),
    createDefaults,
    emptyState: planetEmptyState,
  };
}
