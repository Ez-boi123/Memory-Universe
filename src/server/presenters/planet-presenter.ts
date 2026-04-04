import type {
  PlanetEventCardViewModel,
  PlanetEventDetailViewModel,
  PlanetMemoryStripPhotoViewModel,
  PlanetPageViewModel,
  PlanetVariant,
} from '@/types/planet';
import type { MemoryEventSummary } from '@/types/domain';
import { eventService } from '@/server/services/event-service';

interface BuildPlanetPageViewModelInput {
  eventDetailSourceById?: Partial<Record<string, { body: string; locationText?: string | null }>>;
  events?: MemoryEventSummary[];
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

function buildCreateDefaults(): PlanetPageViewModel['createDefaults'] {
  return {
    title: '',
    memoryDate: new Date().toISOString().slice(0, 10),
    eventType: 'daily',
    locationText: '',
    body: '',
    syncToMilkyWay: false,
  };
}

function formatEventTypeLabel(eventType: MemoryEventSummary['eventType']): string {
  return eventType ? eventType[0].toUpperCase() + eventType.slice(1) : 'Memory';
}

function buildMemoryStrip(
  photos: { id: string; thumbnailUrl: string }[],
  title: string,
): PlanetMemoryStripPhotoViewModel[] {
  return photos.map((photo, index) => ({
    alt: `${title} memory fragment ${index + 1}`,
    id: photo.id,
    thumbnailUrl: photo.thumbnailUrl,
  }));
}

function buildEventCard(
  event: MemoryEventSummary,
  index: number,
  memoryStrip: PlanetMemoryStripPhotoViewModel[],
): PlanetEventCardViewModel {
  return {
    bodyPreview: event.bodyPreview,
    eventTypeLabel: formatEventTypeLabel(event.eventType),
    id: event.id,
    lastEditedAtLabel: event.updatedAt,
    lastEditedBy: event.updatedBy,
    layoutSide: index % 2 === 0 ? 'left' : 'right',
    memoryDateLabel: event.memoryDate,
    memoryStrip,
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
    title: event.title,
  };
}

function buildEventDetail(
  event: MemoryEventSummary,
  index: number,
  body: string,
  locationText: string | null | undefined,
  memoryStrip: PlanetMemoryStripPhotoViewModel[],
): PlanetEventDetailViewModel {
  return {
    body,
    eventTypeLabel: formatEventTypeLabel(event.eventType),
    id: event.id,
    lastEditedAtLabel: event.updatedAt,
    lastEditedBy: event.updatedBy,
    locationText: locationText ?? null,
    memoryDateLabel: event.memoryDate,
    memoryStrip,
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
    title: event.title,
  };
}

function buildEmptyPlanetPageModel(): PlanetPageViewModel {
  return {
    createDefaults: buildCreateDefaults(),
    emptyState: planetEmptyState,
    eventDetails: {},
    events: [],
    header: planetHeader,
  };
}

export async function buildPlanetPageViewModel(
  input?: BuildPlanetPageViewModelInput,
): Promise<PlanetPageViewModel> {
  if (!input?.relationshipId) {
    return buildEmptyPlanetPageModel();
  }

  const { result: storedEvents } = await eventService.listEvents(input.relationshipId);

  return {
    createDefaults: buildCreateDefaults(),
    emptyState: planetEmptyState,
    eventDetails: Object.fromEntries(
      storedEvents.map((event, index) => {
        const summary: MemoryEventSummary = {
          bodyPreview:
            event.body.length > 120 ? `${event.body.slice(0, 117).trimEnd()}...` : event.body,
          eventType: event.eventType,
          id: event.id,
          locationText: event.locationText,
          memoryDate: event.memoryDate.toISOString().slice(0, 10),
          title: event.title,
          updatedAt: event.updatedAt.toISOString(),
          updatedBy: event.updatedBy === event.createdBy ? 'You' : 'Shared editor',
        };

        return [
          event.id,
          buildEventDetail(
            summary,
            index,
            event.body,
            event.locationText,
            buildMemoryStrip(
              event.eventPhotos.map((eventPhoto) => ({
                id: eventPhoto.id,
                thumbnailUrl: eventPhoto.thumbnailUrl,
              })),
              event.title,
            ),
          ),
        ];
      }),
    ),
    events: storedEvents.map((event, index) => {
      const summary: MemoryEventSummary = {
        bodyPreview:
          event.body.length > 120 ? `${event.body.slice(0, 117).trimEnd()}...` : event.body,
        eventType: event.eventType,
        id: event.id,
        locationText: event.locationText,
        memoryDate: event.memoryDate.toISOString().slice(0, 10),
        title: event.title,
        updatedAt: event.updatedAt.toISOString(),
        updatedBy: event.updatedBy === event.createdBy ? 'You' : 'Shared editor',
      };

      return buildEventCard(
        summary,
        index,
        buildMemoryStrip(
          event.eventPhotos.map((eventPhoto) => ({
            id: eventPhoto.id,
            thumbnailUrl: eventPhoto.thumbnailUrl,
          })),
          event.title,
        ),
      );
    }),
    header: planetHeader,
  };
}
