import type {
  PlanetEventCardViewModel,
  PlanetEventDetailsById,
  PlanetEventDetailViewModel,
  PlanetMemoryStripPhotoViewModel,
  PlanetPageViewModel,
  PlanetVariant,
} from '@/types/planet';
import type { MemoryEventSummary } from '@/types/domain';
import { db } from '@/lib/db/client';

import { presentMockEventRecords, presentMockEvents } from './event-presenter';

interface PlanetEventDetailSource {
  body: string;
  locationText?: string | null;
}

interface BuildPlanetPageViewModelInput {
  events?: MemoryEventSummary[];
  eventDetailSourceById?: Partial<Record<string, PlanetEventDetailSource>>;
  relationshipId?: string | null;
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
  memoryStrip: PlanetMemoryStripPhotoViewModel[],
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
    memoryStrip,
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
  };
}

function buildEventDetail(
  event: MemoryEventSummary,
  detailSource: PlanetEventDetailSource,
  index: number,
  memoryStrip: PlanetMemoryStripPhotoViewModel[],
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
    memoryStrip,
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
  };
}

function buildMemoryStrip(
  photos: { id: string; thumbnailUrl: string }[],
  title: string,
): PlanetMemoryStripPhotoViewModel[] {
  return photos.slice(0, 4).map((photo, index) => ({
    alt: `${title} memory fragment ${index + 1}`,
    id: photo.id,
    thumbnailUrl: photo.thumbnailUrl,
  }));
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

      return [[event.id, buildEventDetail(event, detailSource, index, [])]];
    }),
  );
}

export async function buildPlanetPageViewModel(
  input?: BuildPlanetPageViewModelInput,
): Promise<PlanetPageViewModel> {
  if (input?.relationshipId) {
    const storedEvents = await db.memoryEvent.findMany({
      include: {
        eventPhotos: {
          orderBy: {
            uploadedAt: 'desc',
          },
        },
      },
      orderBy: {
        memoryDate: 'desc',
      },
      where: {
        deletedAt: null,
        relationshipId: input.relationshipId,
      },
    });

    return {
      header: planetHeader,
      events: storedEvents.map((event, index) =>
        buildEventCard(
          {
            bodyPreview:
              event.body.length > 120 ? `${event.body.slice(0, 117).trimEnd()}...` : event.body,
            eventType: event.eventType,
            id: event.id,
            locationText: event.locationText,
            memoryDate: event.memoryDate.toISOString().slice(0, 10),
            title: event.title,
            updatedAt: event.updatedAt.toISOString(),
            updatedBy: event.updatedBy === event.createdBy ? 'You' : 'Shared editor',
          },
          index,
          buildMemoryStrip(
            event.eventPhotos.map((eventPhoto) => ({
              id: eventPhoto.id,
              thumbnailUrl: eventPhoto.thumbnailUrl,
            })),
            event.title,
          ),
        ),
      ),
      eventDetails: Object.fromEntries(
        storedEvents.map((event, index) => [
          event.id,
          buildEventDetail(
            {
              bodyPreview:
                event.body.length > 120 ? `${event.body.slice(0, 117).trimEnd()}...` : event.body,
              eventType: event.eventType,
              id: event.id,
              locationText: event.locationText,
              memoryDate: event.memoryDate.toISOString().slice(0, 10),
              title: event.title,
              updatedAt: event.updatedAt.toISOString(),
              updatedBy: event.updatedBy === event.createdBy ? 'You' : 'Shared editor',
            },
            {
              body: event.body,
              locationText: event.locationText,
            },
            index,
            buildMemoryStrip(
              event.eventPhotos.map((eventPhoto) => ({
                id: eventPhoto.id,
                thumbnailUrl: eventPhoto.thumbnailUrl,
              })),
              event.title,
            ),
          ),
        ]),
      ),
      createDefaults,
      emptyState: planetEmptyState,
    };
  }

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
    events: ordered.map((event, index) => buildEventCard(event, index, [])),
    eventDetails: Object.fromEntries(
      Object.entries(buildDetailMap(ordered, detailSourceById)).map(([eventId, detail]) => [
        eventId,
        detail
          ? {
              ...detail,
              memoryStrip: [],
            }
          : detail,
      ]),
    ),
    createDefaults,
    emptyState: planetEmptyState,
  };
}
