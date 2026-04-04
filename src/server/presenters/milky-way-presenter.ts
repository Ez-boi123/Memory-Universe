import type { MilkyWayPageModel } from '@/types/milky-way';
import type { PhotoSummary } from '@/types/domain';

interface BuildMilkyWayViewModelOptions {
  isEmpty?: boolean;
  photos?: PhotoSummary[];
}

const PHOTO_ACCENTS = ['violet', 'blue', 'rose'] as const;
const UPLOAD_BATCH_THRESHOLD_MS = 2 * 60 * 1000;

function formatMonthLabel(memoryDate: string) {
  return new Date(memoryDate).toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  });
}

function formatDateLabel(memoryDate: string) {
  return new Date(memoryDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  });
}

function getTimestamp(value: string) {
  return new Date(value).getTime();
}

function buildUploadBatches(photos: PhotoSummary[]) {
  const sortedPhotos = [...photos].sort(
    (left, right) => getTimestamp(right.uploadedAt) - getTimestamp(left.uploadedAt),
  );
  const batches: PhotoSummary[][] = [];

  for (const photo of sortedPhotos) {
    const currentBatch = batches[batches.length - 1];
    const previousPhoto = currentBatch?.[currentBatch.length - 1];

    if (
      currentBatch &&
      previousPhoto &&
      previousPhoto.memoryDate === photo.memoryDate &&
      Math.abs(getTimestamp(previousPhoto.uploadedAt) - getTimestamp(photo.uploadedAt)) <=
        UPLOAD_BATCH_THRESHOLD_MS
    ) {
      currentBatch.push(photo);
      continue;
    }

    batches.push([photo]);
  }

  return batches;
}

function buildEntryNote(photo: PhotoSummary) {
  if (photo.note?.trim()) {
    return photo.note.trim();
  }

  const body = photo.relatedEventBody?.trim();
  const location = photo.relatedEventLocationText?.trim();

  if (body && location) {
    return `${body} · ${location}`;
  }

  return body || location || undefined;
}

export function buildMilkyWayViewModel(
  options: BuildMilkyWayViewModelOptions = {},
): MilkyWayPageModel {
  const uploadTile = {
    title: 'Add to your Milky Way',
    description: 'Upload a photo, confirm the memory time, and optionally link it to an event.',
  };

  const uploadPanel = {
    defaultMemoryTime: '2026-03-27',
    eventLabel: 'Optional event',
    noteLabel: 'Optional note',
  };

  const photos = options.photos ?? [];

  if (options.isEmpty || photos.length === 0) {
    return {
      title: 'Memory Milky Way',
      description: 'A time-led album for revisiting shared photos.',
      uploadTile,
      uploadPanel,
      timeline: [],
      sections: [],
      emptyState: {
        title: 'Your Milky Way starts with one photo',
        description: 'The first upload becomes the opening memory in your timeline.',
      },
    };
  }

  const grouped = new Map<string, PhotoSummary[]>();

  for (const photo of photos) {
    if (!photo.memoryDate) {
      continue;
    }

    const monthKey = photo.memoryDate.slice(0, 7);
    const monthGroup = grouped.get(monthKey) ?? [];
    monthGroup.push(photo);
    grouped.set(monthKey, monthGroup);
  }

  const monthKeys = [...grouped.keys()].sort((left, right) => right.localeCompare(left));
  const sections = monthKeys.map((monthKey) => {
    const monthPhotos = grouped.get(monthKey) ?? [];
    const uploadBatches = buildUploadBatches(monthPhotos);

    return {
      entries: uploadBatches.map((batch, batchIndex) => {
        const orderedBatch = [...batch].sort(
          (left, right) => getTimestamp(left.uploadedAt) - getTimestamp(right.uploadedAt),
        );
        const leadPhoto =
          orderedBatch.find(
            (photo) =>
              photo.relatedEventTitle || photo.relatedEventBody || photo.relatedEventLocationText,
          ) ?? orderedBatch[0];

        return {
          dateLabel: formatDateLabel(leadPhoto?.memoryDate ?? leadPhoto?.uploadedAt ?? `${monthKey}-01`),
          eventTitle: leadPhoto?.eventTitle?.trim() || leadPhoto?.relatedEventTitle?.trim() || undefined,
          id: leadPhoto?.id ?? `milky-way-entry-${monthKey}-${batchIndex}`,
          note: leadPhoto ? buildEntryNote(leadPhoto) : undefined,
          photos: orderedBatch.map((photo, index) => ({
            accent: PHOTO_ACCENTS[index % PHOTO_ACCENTS.length],
            alt: `Archived photo ${photo.id}`,
            id: photo.id,
            imageUrl: photo.thumbnailUrl ?? photo.displayUrl ?? '',
          })),
        };
      }),
      id: `milky-way-section-${monthKey}`,
      monthLabel: formatMonthLabel(`${monthKey}-01`),
    };
  });

  return {
    title: 'Memory Milky Way',
    description: 'A time-led album for revisiting shared photos.',
    uploadTile,
    uploadPanel,
    timeline: monthKeys.map((monthKey, index) => ({
      id: monthKey,
      isActive: index === 0,
      label: monthKey.replace('-', ' / '),
      sectionId: `milky-way-section-${monthKey}`,
    })),
    sections,
    emptyState: null,
  };
}
