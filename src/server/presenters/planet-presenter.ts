import type {
  PlanetEventCardViewModel,
  PlanetEventDetailsById,
  PlanetEventDetailViewModel,
  PlanetPageViewModel,
  PlanetVariant,
} from '@/types/planet';
import type { MemoryEventSummary } from '@/types/domain';

import { presentMockEventRecords, presentMockEvents } from './event-presenter';

interface PlanetEventDetailSource {
  body: string;
  locationText?: string | null;
}

interface BuildPlanetPageViewModelInput {
  events?: MemoryEventSummary[];
  eventDetailSourceById?: Partial<Record<string, PlanetEventDetailSource>>;
}

const PLANET_VARIANTS: PlanetVariant[] = ['violet', 'blue', 'rose'];

const planetHeader: PlanetPageViewModel['header'] = {
  eyebrow: 'Planet',
  title: 'Memory Planet',
  description: 'Recorded shared events, revisited like a calm orbital archive.',
  actionLabel: 'New Event',
};

const planetEmptyState: PlanetPageViewModel['emptyState'] = {
  title: 'Record the first planet in this archive',
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
    lastEditedBy: event.updatedBy,
    lastEditedAtLabel: event.updatedAt,
    layoutSide: index % 2 === 0 ? 'left' : 'right',
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
  };
}

function buildEventDetail(
  event: MemoryEventSummary,
  detailSource: PlanetEventDetailSource,
  index: number,
): PlanetEventDetailViewModel {
  return {
    id: event.id,
    title: event.title,
    memoryDateLabel: event.memoryDate,
    eventTypeLabel: formatEventTypeLabel(event.eventType),
    body: detailSource.body,
    locationText: detailSource.locationText ?? null,
    lastEditedBy: event.updatedBy,
    lastEditedAtLabel: event.updatedAt,
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
  };
}

function buildDetailMap(
  events: MemoryEventSummary[],
  detailSourceById: Partial<Record<string, PlanetEventDetailSource>>,
): PlanetEventDetailsById {
  return Object.fromEntries(
    events.flatMap((event, index) => {
      const detailSource = detailSourceById[event.id];

      if (!detailSource) {
        return [];
      }

      return [[event.id, buildEventDetail(event, detailSource, index)]];
    }),
  );
}

export function buildPlanetPageViewModel(input?: BuildPlanetPageViewModelInput): PlanetPageViewModel {
  const mockRecords = input?.events ? null : presentMockEventRecords();
  const source = input?.events ?? presentMockEvents();
  const detailSourceById =
    input?.eventDetailSourceById ??
    Object.fromEntries(
      (mockRecords ?? []).map((record) => [
        record.id,
        {
          body: record.body,
          locationText: record.locationText ?? null,
        },
      ]),
    );
  const ordered = [...source].sort((left, right) => right.memoryDate.localeCompare(left.memoryDate));

  return {
    header: planetHeader,
    events: ordered.map((event, index) => buildEventCard(event, index)),
    eventDetails: buildDetailMap(ordered, detailSourceById),
    createDefaults,
    emptyState: planetEmptyState,
  };
}
