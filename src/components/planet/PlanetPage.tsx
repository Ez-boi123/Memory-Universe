'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { EventType } from '@/types/domain';
import type {
  PlanetMemoryStripPhotoViewModel,
  PlanetPageViewModel,
  PlanetVariant,
} from '@/types/planet';

import { PlanetArchive } from './PlanetArchive';
import { PlanetEventDetailModal } from './PlanetEventDetailModal';
import { PlanetImageLightbox } from './PlanetImageLightbox';

interface PlanetPageProps {
  model: PlanetPageViewModel;
  initialEventId?: string | null;
}

interface LocalPlanetEvent {
  body: string;
  bodyPreview: string;
  eventTypeLabel: string;
  eventTypeValue: EventType;
  id: string;
  lastEditedAtLabel?: string;
  lastEditedBy: string;
  layoutSide: 'left' | 'right';
  locationText?: string | null;
  memoryDateLabel: string;
  memoryStrip: PlanetMemoryStripPhotoViewModel[];
  planetVariant: PlanetVariant;
  title: string;
}

interface UploadedPhotoState {
  displayUrl?: string;
  error?: string;
  existingEventPhotoId?: string;
  fileName: string;
  id: string;
  previewUrl: string;
  originalUrl?: string;
  storageKey?: string;
  status: 'uploading' | 'uploaded' | 'error';
  temporaryUploadId?: string;
  thumbnailUrl?: string;
  uploadedAt?: string;
}

const EVENT_TYPE_OPTIONS: { label: string; value: EventType }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Travel', value: 'travel' },
  { label: 'Anniversary', value: 'anniversary' },
  { label: 'Festival', value: 'festival' },
];

const PLANET_VARIANTS: PlanetVariant[] = ['violet', 'blue', 'rose'];
const MAX_EVENT_PHOTOS = 9;
const CALENDAR_WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatEventTypeLabel(eventType: string): string {
  return eventType ? eventType[0].toUpperCase() + eventType.slice(1) : 'Memory';
}

function parseEventTypeValue(eventTypeLabel: string): EventType {
  const normalizedValue = eventTypeLabel.trim().toLowerCase();

  return EVENT_TYPE_OPTIONS.some((option) => option.value === normalizedValue)
    ? (normalizedValue as EventType)
    : 'daily';
}

function resolvePersistedEventId(eventId: string): string {
  return eventId.startsWith('created-event-') ? eventId.replace(/^created-event-/, '') : eventId;
}

function buildBasePlanetEvents(model: PlanetPageViewModel): LocalPlanetEvent[] {
  return model.events.map((event) => {
    const detail = model.eventDetails[event.id];

    return {
      body: detail?.body ?? event.bodyPreview,
      bodyPreview: event.bodyPreview,
      eventTypeLabel: event.eventTypeLabel,
      eventTypeValue: parseEventTypeValue(event.eventTypeLabel),
      id: event.id,
      lastEditedAtLabel: event.lastEditedAtLabel,
      lastEditedBy: event.lastEditedBy,
      layoutSide: event.layoutSide,
      locationText: detail?.locationText ?? null,
      memoryDateLabel: event.memoryDateLabel,
      memoryStrip: event.memoryStrip,
      planetVariant: event.planetVariant,
      title: event.title,
    };
  });
}

function applyOrbitalLayout(events: LocalPlanetEvent[]): LocalPlanetEvent[] {
  return events.map((event, index) => ({
    ...event,
    layoutSide: index % 2 === 0 ? 'left' : 'right',
    planetVariant: PLANET_VARIANTS[index % PLANET_VARIANTS.length],
  }));
}

function buildBodyPreview(body: string) {
  return body.length > 120 ? `${body.slice(0, 117).trimEnd()}...` : body;
}

function formatMemoryDateLabel(memoryDate: string) {
  if (!memoryDate) {
    return 'Select date';
  }

  const normalizedDate = new Date(`${memoryDate}T00:00:00`);

  if (Number.isNaN(normalizedDate.getTime())) {
    return memoryDate;
  }

  return normalizedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function parseMemoryDate(memoryDate: string) {
  if (!memoryDate) {
    return null;
  }

  const normalizedDate = new Date(`${memoryDate}T00:00:00`);

  return Number.isNaN(normalizedDate.getTime()) ? null : normalizedDate;
}

function formatMemoryDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createCalendarMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftCalendarMonth(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function formatCalendarMonthLabel(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function formatCalendarDayLabel(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildCalendarGrid(month: Date) {
  const firstDayOfMonth = createCalendarMonth(month);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingEmptyCells = firstDayOfMonth.getDay();
  const cells: Array<Date | null> = Array.from({ length: leadingEmptyCells }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function buildEditablePhotosFromMemoryStrip(
  memoryStrip: PlanetMemoryStripPhotoViewModel[],
): UploadedPhotoState[] {
  return memoryStrip.map((photo, index) => {
    const fallbackFileName = photo.thumbnailUrl.split('/').pop() || `image-${index + 1}.jpg`;

    return {
      existingEventPhotoId: photo.id,
      fileName: fallbackFileName,
      id: `existing-photo-${photo.id}`,
      previewUrl: photo.thumbnailUrl,
      status: 'uploaded',
      thumbnailUrl: photo.thumbnailUrl,
    };
  });
}

export function PlanetPage({ model, initialEventId = null }: PlanetPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeEventId = searchParams?.get('eventId') ?? initialEventId ?? null;
  const routeEventDetail = routeEventId ? model.eventDetails[routeEventId] : null;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEventTypeMenuOpen, setIsEventTypeMenuOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotoState[]>([]);
  const [createdEvents, setCreatedEvents] = useState<LocalPlanetEvent[]>([]);
  const [editedEvents, setEditedEvents] = useState<LocalPlanetEvent[]>([]);
  const [deletedEventIds, setDeletedEventIds] = useState<string[]>([]);
  const [createForm, setCreateForm] = useState(model.createDefaults);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(routeEventId);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [isModalEntering, setIsModalEntering] = useState(false);
  const [openingEventId, setOpeningEventId] = useState<string | null>(null);
  const [visibleCalendarMonth, setVisibleCalendarMonth] = useState(() =>
    createCalendarMonth(parseMemoryDate(model.createDefaults.memoryDate) ?? new Date()),
  );
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const eventTypeSelectRef = useRef<HTMLDivElement | null>(null);
  const openingEventButtonRef = useRef<HTMLElement | null>(null);
  const openingTransitionTimeoutRef = useRef<number | null>(null);
  const uploadSessionRef = useRef(0);

  useEffect(() => {
    return () => {
      uploadedPhotos.forEach((photo) => {
        if (photo.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, [uploadedPhotos]);

  useEffect(() => {
    if (!isEventTypeMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        eventTypeSelectRef.current &&
        event.target instanceof Node &&
        !eventTypeSelectRef.current.contains(event.target)
      ) {
        setIsEventTypeMenuOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isEventTypeMenuOpen]);

  useEffect(() => {
    if (!isDatePickerOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        datePickerRef.current &&
        event.target instanceof Node &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isDatePickerOpen]);

  const mergedEvents = useMemo(() => {
    const hiddenEventIds = new Set(deletedEventIds);
    const localEvents = [...createdEvents, ...editedEvents].filter((event) => !hiddenEventIds.has(event.id));
    const localEventIds = new Set(localEvents.map((event) => event.id));
    const baseEvents = buildBasePlanetEvents(model).filter(
      (event) => !hiddenEventIds.has(event.id) && !localEventIds.has(event.id),
    );

    return applyOrbitalLayout([...localEvents, ...baseEvents]);
  }, [createdEvents, deletedEventIds, editedEvents, model]);

  const eventCards = useMemo(
    () =>
      mergedEvents.map((event) => ({
        bodyPreview: event.bodyPreview,
        eventTypeLabel: event.eventTypeLabel,
        id: event.id,
        lastEditedAtLabel: event.lastEditedAtLabel,
        lastEditedBy: event.lastEditedBy,
        layoutSide: event.layoutSide,
        locationText: event.locationText,
        memoryDateLabel: event.memoryDateLabel,
        memoryStrip: event.memoryStrip,
        planetVariant: event.planetVariant,
        title: event.title,
      })),
    [mergedEvents],
  );

  const eventDetails = useMemo(
    () =>
      Object.fromEntries(
        mergedEvents.flatMap((event) => {
          const hasModelDetail = Boolean(model.eventDetails[event.id]);
          const isLocalCreated = event.id.startsWith('created-event-');

          if (!hasModelDetail && !isLocalCreated) {
            return [];
          }

          return [
            [
              event.id,
              {
                body: event.body,
                eventTypeLabel: event.eventTypeLabel,
                id: event.id,
                lastEditedAtLabel: event.lastEditedAtLabel,
                lastEditedBy: event.lastEditedBy,
                locationText: event.locationText ?? null,
                memoryDateLabel: event.memoryDateLabel,
                memoryStrip: event.memoryStrip,
                planetVariant: event.planetVariant,
                title: event.title,
              },
            ],
          ];
        }),
      ),
    [mergedEvents, model.eventDetails],
  );

  useEffect(() => {
    if (openingEventButtonRef.current) {
      openingEventButtonRef.current.classList.remove('planet-event-sphere-button--opening');
      openingEventButtonRef.current = null;
    }

    if (!openingEventId) {
      return;
    }

    const button = document.querySelector(`[data-testid="planet-event-${openingEventId}"]`);

    if (button instanceof HTMLElement) {
      button.classList.add('planet-event-sphere-button--opening');
      openingEventButtonRef.current = button;
    }

    return () => {
      if (openingEventButtonRef.current) {
        openingEventButtonRef.current.classList.remove('planet-event-sphere-button--opening');
        openingEventButtonRef.current = null;
      }
    };
  }, [openingEventId]);

  useEffect(() => {
    if (!routeEventId) {
      setSelectedEventId(null);
      setIsModalEntering(false);
      return;
    }

    if (routeEventDetail) {
      setSelectedEventId(routeEventId);
      setIsModalEntering(false);
      return;
    }

    setSelectedEventId(null);
    setIsModalEntering(false);
  }, [routeEventDetail, routeEventId]);

  useEffect(() => {
    if (!isModalEntering || !selectedEventId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsModalEntering(false);
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isModalEntering, selectedEventId]);

  useEffect(() => {
    return () => {
      if (openingTransitionTimeoutRef.current !== null) {
        window.clearTimeout(openingTransitionTimeoutRef.current);
      }
    };
  }, []);

  function buildPlanetUrl(nextEventId: string | null) {
    const params = new URLSearchParams(searchParams?.toString());

    if (nextEventId) {
      params.set('eventId', nextEventId);
    } else {
      params.delete('eventId');
    }

    const query = params.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';

    return `${pathname}${query ? `?${query}` : ''}${hash}`;
  }

  function handleOpen(eventId: string) {
    if (!eventDetails[eventId]) {
      return;
    }

    if (openingTransitionTimeoutRef.current !== null) {
      window.clearTimeout(openingTransitionTimeoutRef.current);
      openingTransitionTimeoutRef.current = null;
    }

    setOpeningEventId(eventId);
    setIsModalEntering(false);
    setSelectedPhotoId(null);
    setSelectedEventId(null);
    openingTransitionTimeoutRef.current = window.setTimeout(() => {
      setSelectedEventId(eventId);
      setIsModalEntering(true);
      setOpeningEventId(null);
      router.replace(buildPlanetUrl(eventId), {
        scroll: false,
      });
      openingTransitionTimeoutRef.current = null;
    }, 180);
  }

  function handleClose() {
    if (openingTransitionTimeoutRef.current !== null) {
      window.clearTimeout(openingTransitionTimeoutRef.current);
      openingTransitionTimeoutRef.current = null;
    }

    setOpeningEventId(null);
    setIsModalEntering(false);
    setSelectedPhotoId(null);
    setSelectedEventId(null);
    router.replace(buildPlanetUrl(null), { scroll: false });
  }

  function handleOpenEditModal() {
    if (!selectedEvent) {
      return;
    }

    const matchingEvent = mergedEvents.find((event) => event.id === selectedEvent.id);

    if (!matchingEvent) {
      return;
    }

    if (openingTransitionTimeoutRef.current !== null) {
      window.clearTimeout(openingTransitionTimeoutRef.current);
      openingTransitionTimeoutRef.current = null;
    }

    setSelectedPhotoId(null);
    setSelectedEventId(null);
    setIsModalEntering(false);
    setOpeningEventId(null);
    setCreateError(null);
    setEditingEventId(selectedEvent.id);
    setCreateForm({
      body: matchingEvent.body,
      eventType: matchingEvent.eventTypeValue,
      locationText: matchingEvent.locationText ?? '',
      memoryDate: matchingEvent.memoryDateLabel,
      syncToMilkyWay: false,
      title: matchingEvent.title,
    });
    setUploadedPhotos(buildEditablePhotosFromMemoryStrip(matchingEvent.memoryStrip));
    setIsEventTypeMenuOpen(false);
    setIsDatePickerOpen(false);
    setVisibleCalendarMonth(
      createCalendarMonth(parseMemoryDate(matchingEvent.memoryDateLabel) ?? new Date()),
    );
    setIsCreateModalOpen(true);
    router.replace(buildPlanetUrl(null), { scroll: false });
  }

  async function handleDeleteEvent() {
    if (!selectedEvent) {
      return;
    }

    const confirmed = window.confirm(
      'Delete this event from Memory Planet? This removes it from the orbit view.',
    );

    if (!confirmed) {
      return;
    }

    const eventId = selectedEvent.id;
    const persistedEventId = resolvePersistedEventId(eventId);

    try {
      const response = await fetch(`/api/events/${persistedEventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = (await response.json()) as { errors?: string[] };

        throw new Error(payload.errors?.[0] ?? 'Deleting this event failed.');
      }

      setCreatedEvents((current) => current.filter((event) => event.id !== eventId));
      setEditedEvents((current) => current.filter((event) => event.id !== eventId));
      setDeletedEventIds((current) =>
        Array.from(new Set([...current, eventId, persistedEventId])),
      );
      setSelectedPhotoId(null);
      setSelectedEventId(null);
      setIsModalEntering(false);
      router.replace(buildPlanetUrl(null), { scroll: false });
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Deleting this event failed.');
    }
  }

  function resetCreateState() {
    setCreateError(null);
    setCreateForm(model.createDefaults);
    setEditingEventId(null);
    setIsDatePickerOpen(false);
    setVisibleCalendarMonth(
      createCalendarMonth(parseMemoryDate(model.createDefaults.memoryDate) ?? new Date()),
    );
    setUploadedPhotos([]);
  }

  async function cleanupTemporaryUploads(uploadIds: string[]) {
    if (uploadIds.length === 0) {
      return;
    }

    try {
      await fetch('/api/photos/upload', {
        body: JSON.stringify({ uploadIds }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
    } catch {
      // Best-effort cleanup. Temporary objects can be cleaned again later if needed.
    }
  }

  function removeUploadedPhoto(photoId: string) {
    const targetPhoto = uploadedPhotos.find((photo) => photo.id === photoId);

    if (!targetPhoto || targetPhoto.status === 'uploading') {
      return;
    }

    if (targetPhoto.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(targetPhoto.previewUrl);
    }

    setUploadedPhotos((current) => current.filter((photo) => photo.id !== photoId));

    if (targetPhoto.temporaryUploadId) {
      void cleanupTemporaryUploads([targetPhoto.temporaryUploadId]);
    }
  }

  function handleOpenCreateModal() {
    uploadSessionRef.current += 1;
    resetCreateState();
    setIsCreateModalOpen(true);
  }

  function handleCloseCreateModal() {
    const nextSessionId = uploadSessionRef.current + 1;
    const uploadIds = uploadedPhotos.flatMap((photo) =>
      photo.status === 'uploaded' && photo.temporaryUploadId ? [photo.temporaryUploadId] : [],
    );

    uploadSessionRef.current = nextSessionId;
    resetCreateState();
    setIsEventTypeMenuOpen(false);
    setIsCreateModalOpen(false);
    void cleanupTemporaryUploads(uploadIds);
  }

  function handleCreateFieldChange(
    field: keyof PlanetPageViewModel['createDefaults'],
    value: string,
  ) {
    setCreateForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleEventTypeSelect(value: EventType) {
    handleCreateFieldChange('eventType', value);
    setIsEventTypeMenuOpen(false);
  }

  function handleToggleDatePicker() {
    setIsEventTypeMenuOpen(false);
    setIsDatePickerOpen((current) => {
      const nextState = !current;

      if (nextState) {
        setVisibleCalendarMonth(
          createCalendarMonth(parseMemoryDate(createForm.memoryDate) ?? new Date()),
        );
      }

      return nextState;
    });
  }

  function handleMemoryDateSelect(date: Date) {
    handleCreateFieldChange('memoryDate', formatMemoryDateValue(date));
    setVisibleCalendarMonth(createCalendarMonth(date));
    setIsDatePickerOpen(false);
  }

  async function handleUploadSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    if (uploadedPhotos.length + files.length > MAX_EVENT_PHOTOS) {
      setCreateError('Each event can include up to 9 images.');
      event.target.value = '';
      return;
    }

    setCreateError(null);

    const draftPhotos = files.map((file, index) => ({
      fileName: file.name,
      id: `draft-photo-${Date.now()}-${index}`,
      previewUrl: URL.createObjectURL(file),
      status: 'uploading' as const,
    }));

    setUploadedPhotos((current) => [...draftPhotos, ...current]);
    event.target.value = '';
    const uploadSessionId = uploadSessionRef.current;

    await Promise.all(
      files.map(async (file, index) => {
        const draftId = draftPhotos[index]?.id;
        const formData = new FormData();

        formData.append('file', file);

        try {
          const response = await fetch('/api/photos/upload', {
            body: formData,
            method: 'POST',
          });
          const payload = (await response.json()) as {
            errors?: string[];
            upload?: {
              id: string;
              displayUrl: string;
              originalUrl: string;
              storageKey: string;
              thumbnailUrl: string;
              uploadedAt: string;
            };
          };

          if (!response.ok || !payload.upload) {
            throw new Error(payload.errors?.[0] ?? 'Image upload failed.');
          }

          if (uploadSessionRef.current !== uploadSessionId) {
            void cleanupTemporaryUploads([payload.upload.id]);
            return;
          }

          setUploadedPhotos((current) =>
            current.map((photo) =>
              photo.id === draftId
                ? {
                    ...photo,
                    displayUrl: payload.upload?.displayUrl,
                    originalUrl: payload.upload?.originalUrl,
                    previewUrl: payload.upload?.thumbnailUrl ?? photo.previewUrl,
                    storageKey: payload.upload?.storageKey,
                    status: 'uploaded',
                    temporaryUploadId: payload.upload?.id,
                    thumbnailUrl: payload.upload?.thumbnailUrl,
                    uploadedAt: payload.upload?.uploadedAt,
                  }
                : photo,
            ),
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Image upload failed.';

          setUploadedPhotos((current) =>
            current.map((photo) =>
              photo.id === draftId
                ? {
                    ...photo,
                    error: message,
                    status: 'error',
                  }
                : photo,
            ),
          );
        }
      }),
    );
  }

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = createForm.title.trim();
    const normalizedBody = createForm.body.trim();
    const normalizedDate = createForm.memoryDate.trim();

    if (!normalizedTitle || !normalizedBody || !normalizedDate) {
      setCreateError('Title, memory date, and notes are required.');
      return;
    }

    if (uploadedPhotos.some((photo) => photo.status === 'uploading')) {
      setCreateError('Wait for image uploads to finish before saving the event.');
      return;
    }

    setIsSavingEvent(true);
    setCreateError(null);

    try {
      if (editingEventId) {
        const response = await fetch(`/api/events/${resolvePersistedEventId(editingEventId)}`, {
          body: JSON.stringify({
            body: normalizedBody,
            eventType: createForm.eventType,
            locationText: createForm.locationText.trim(),
            memoryDate: normalizedDate,
            retainedEventPhotoIds: uploadedPhotos.flatMap((photo) =>
              photo.status === 'uploaded' && photo.existingEventPhotoId ? [photo.existingEventPhotoId] : [],
            ),
            syncToMilkyWay: createForm.syncToMilkyWay,
            temporaryUploadIds: uploadedPhotos.flatMap((photo) =>
              photo.status === 'uploaded' && photo.temporaryUploadId ? [photo.temporaryUploadId] : [],
            ),
            title: normalizedTitle,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        });
        const payload = (await response.json()) as {
          errors?: string[];
          event?: {
            id: string;
            title: string;
            body: string;
            memoryDate: string | Date;
            locationText?: string | null;
            updatedAt: string | Date;
          };
          photos?: Array<{
            id: string;
            thumbnailUrl: string;
          }>;
        };

        if (!response.ok || !payload.event) {
          throw new Error(payload.errors?.[0] ?? 'Saving this event failed.');
        }

        const existingEvent = mergedEvents.find((currentEvent) => currentEvent.id === editingEventId);
        const updatedEvent: LocalPlanetEvent = {
          body: payload.event.body ?? normalizedBody,
          bodyPreview: buildBodyPreview(payload.event.body ?? normalizedBody),
          eventTypeLabel: formatEventTypeLabel(createForm.eventType),
          eventTypeValue: createForm.eventType,
          id: editingEventId,
          lastEditedAtLabel: 'Just now',
          lastEditedBy: 'You',
          layoutSide: 'left',
          locationText: payload.event.locationText ?? (createForm.locationText.trim() || null),
          memoryDateLabel: String(payload.event.memoryDate ?? normalizedDate).slice(0, 10),
          memoryStrip:
            payload.photos && payload.photos.length > 0
              ? payload.photos.map((photo, index) => ({
                  alt: `${payload.event?.title ?? normalizedTitle} memory fragment ${index + 1}`,
                  id: photo.id,
                  thumbnailUrl: photo.thumbnailUrl,
                }))
              : [],
          planetVariant: existingEvent?.planetVariant ?? 'violet',
          title: payload.event.title ?? normalizedTitle,
        };

        const isCreatedEvent = editingEventId.startsWith('created-event-');

        setCreatedEvents((current) => {
          const existingIndex = current.findIndex((currentEvent) => currentEvent.id === editingEventId);

          if (existingIndex === -1) {
            return current;
          }

          return [updatedEvent, ...current.filter((currentEvent) => currentEvent.id !== editingEventId)];
        });
        setEditedEvents((current) =>
          isCreatedEvent
            ? current.filter((currentEvent) => currentEvent.id !== editingEventId)
            : [updatedEvent, ...current.filter((currentEvent) => currentEvent.id !== editingEventId)],
        );
        setDeletedEventIds((current) => current.filter((id) => id !== editingEventId));
      } else {
        const response = await fetch('/api/events', {
          body: JSON.stringify({
            body: normalizedBody,
            eventType: createForm.eventType,
            locationText: createForm.locationText.trim(),
            memoryDate: normalizedDate,
            syncToMilkyWay: createForm.syncToMilkyWay,
            temporaryUploadIds: uploadedPhotos
              .filter(
                (
                  photo,
                ): photo is UploadedPhotoState & {
                  temporaryUploadId: string;
                } => photo.status === 'uploaded' && Boolean(photo.temporaryUploadId),
              )
              .map((photo) => photo.temporaryUploadId),
            title: normalizedTitle,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
        const payload = (await response.json()) as {
          errors?: string[];
          event?: {
            id: string;
            title: string;
            body: string;
            memoryDate: string;
            locationText?: string | null;
            updatedAt: string;
          };
          photos?: Array<{
            id: string;
            thumbnailUrl: string;
          }>;
        };

        if (!response.ok || !payload.event) {
          throw new Error(payload.errors?.[0] ?? 'Saving this event failed.');
        }

        setCreatedEvents((current) => [
          {
            body: payload.event?.body ?? normalizedBody,
            bodyPreview: buildBodyPreview(payload.event?.body ?? normalizedBody),
            eventTypeLabel: formatEventTypeLabel(createForm.eventType),
            eventTypeValue: createForm.eventType,
            id: `created-event-${payload.event?.id ?? Date.now()}`,
            lastEditedAtLabel: 'Just now',
            lastEditedBy: 'You',
            layoutSide: 'left',
            locationText:
              payload.event?.locationText ?? (createForm.locationText.trim() || null),
            memoryDateLabel: (payload.event?.memoryDate ?? normalizedDate).slice(0, 10),
            memoryStrip:
              payload.photos && payload.photos.length > 0
                ? payload.photos.map((photo, index) => ({
                    alt: `${payload.event?.title ?? normalizedTitle} memory fragment ${index + 1}`,
                    id: photo.id,
                    thumbnailUrl: photo.thumbnailUrl,
                  }))
                : [],
            planetVariant: 'violet',
            title: payload.event?.title ?? normalizedTitle,
          },
          ...current,
        ]);
      }

      resetCreateState();
      setIsEventTypeMenuOpen(false);
      setIsCreateModalOpen(false);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Saving this event failed.');
    } finally {
      setIsSavingEvent(false);
    }
  }

  function handleOpenImageLightbox(photoId: string) {
    setSelectedPhotoId(photoId);
  }

  function handleCloseImageLightbox() {
    setSelectedPhotoId(null);
  }

  const selectedEvent = selectedEventId ? eventDetails[selectedEventId] ?? null : null;
  const selectedPhoto =
    selectedEvent && selectedPhotoId
      ? selectedEvent.memoryStrip.find((photo) => photo.id === selectedPhotoId) ?? null
      : null;
  const calendarDays = useMemo(() => buildCalendarGrid(visibleCalendarMonth), [visibleCalendarMonth]);
  const selectedMemoryDate = parseMemoryDate(createForm.memoryDate);
  const orbitSummaryLabel =
    eventCards.length === 1
      ? '1 event already in orbit'
      : `${eventCards.length} events already in orbit`;
  const isCreateFormValid =
    createForm.title.trim().length > 0 &&
    createForm.memoryDate.trim().length > 0 &&
    createForm.body.trim().length > 0 &&
    !isSavingEvent &&
    !uploadedPhotos.some((photo) => photo.status === 'uploading');

  return (
    <div className="planet-page">
      <section aria-label="Memory Planet hero" className="planet-hero">
        <div className="planet-hero-copy">
          <p className="planet-hero-eyebrow">{model.header.eyebrow}</p>
          <h1 className="planet-hero-title">{model.header.title}</h1>
          <p className="planet-hero-description">
            Every shared event settles somewhere in orbit before it becomes part of your story.
          </p>
          <p className="planet-hero-support">{model.header.description}</p>
          <div className="planet-hero-action-row">
            <div className="planet-hero-summary">
              <span className="planet-hero-summary-dot" />
              <span>{orbitSummaryLabel}</span>
            </div>
            <div className="planet-hero-action">
              <button className="planet-page-primary-action" onClick={handleOpenCreateModal} type="button">
                {model.header.actionLabel}
              </button>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="planet-hero-stage">
          <div className="planet-hero-nebula planet-hero-nebula--violet" />
          <div className="planet-hero-nebula planet-hero-nebula--rose" />
          <div className="planet-hero-starfield">
            <span className="planet-hero-star planet-hero-star--silver planet-hero-star--one" />
            <span className="planet-hero-star planet-hero-star--gold planet-hero-star--two" />
            <span className="planet-hero-star planet-hero-star--silver planet-hero-star--three" />
            <span className="planet-hero-star planet-hero-star--gold planet-hero-star--four" />
            <span className="planet-hero-star planet-hero-star--silver planet-hero-star--five" />
          </div>
          <div className="planet-hero-halo planet-hero-halo--outer" />
          <div className="planet-hero-halo planet-hero-halo--middle" />
          <div className="planet-hero-halo planet-hero-halo--inner" />
          <div className="planet-hero-halo planet-hero-halo--trail" />
          <div className="planet-hero-core">
            <div className="planet-hero-core-glow" />
            <div className="planet-hero-planet">
              <span className="planet-hero-planet-atmosphere" />
              <span className="planet-hero-planet-shine" />
              <span className="planet-hero-planet-band planet-hero-planet-band--one" />
              <span className="planet-hero-planet-band planet-hero-planet-band--two" />
            </div>
          </div>
        </div>
      </section>

      {eventCards.length === 0 ? (
        <section className="planet-page-empty-state">
          <button className="planet-page-primary-action" onClick={handleOpenCreateModal} type="button">
            {model.emptyState.actionLabel}
          </button>
          <h2>{model.emptyState.title}</h2>
          <p>{model.emptyState.body}</p>
        </section>
      ) : (
        <PlanetArchive events={eventCards} onOpen={handleOpen} />
      )}

      {selectedEvent ? (
        <PlanetEventDetailModal
          event={selectedEvent}
          isEntering={isModalEntering}
          onClose={handleClose}
          onDelete={handleDeleteEvent}
          onEdit={handleOpenEditModal}
          onImageOpen={handleOpenImageLightbox}
        />
      ) : null}

      {selectedPhoto ? <PlanetImageLightbox photo={selectedPhoto} onClose={handleCloseImageLightbox} /> : null}

      {isCreateModalOpen ? (
        <div className="planet-modal-backdrop">
          <div
            aria-label={editingEventId ? 'Edit Event' : 'Create New Event'}
            aria-modal="true"
            className="planet-modal planet-modal--create"
            role="dialog"
          >
            <button
              aria-label="Close create event modal"
              className="planet-modal-close"
              onClick={handleCloseCreateModal}
              type="button"
            >
              <span aria-hidden="true" className="planet-modal-close-icon">
                <span />
                <span />
              </span>
            </button>
            <p className="planet-modal-kicker">{model.header.eyebrow}</p>
            <h2>{editingEventId ? 'Edit Event' : 'Create New Event'}</h2>
            <p className="planet-modal-body">
              {editingEventId
                ? 'Refine the details of this event and keep its orbit aligned with the memory you want to preserve.'
                : 'Capture the next event before it drifts out of reach and place it into orbit while the details are still close.'}
            </p>
            {createError ? <p className="planet-create-error">{createError}</p> : null}
            <form className="planet-create-form" onSubmit={handleCreateSubmit}>
              <div className="planet-create-layout">
                <div className="planet-create-fields">
                  <label className="planet-create-field">
                    <span>Event Title</span>
                    <input
                      name="title"
                      onChange={(inputEvent) => handleCreateFieldChange('title', inputEvent.target.value)}
                      type="text"
                      value={createForm.title}
                    />
                  </label>
                <div className="planet-create-form-grid">
                  <div className="planet-create-field">
                    <span id="planet-memory-date-label">Memory Date</span>
                    <div ref={datePickerRef} className="planet-select planet-date-field">
                      <button
                        aria-controls="planet-memory-date-calendar"
                        aria-describedby="planet-memory-date-label"
                        aria-expanded={isDatePickerOpen}
                        aria-haspopup="dialog"
                        aria-label={formatMemoryDateLabel(createForm.memoryDate)}
                        className="planet-select-trigger planet-date-trigger"
                        onClick={handleToggleDatePicker}
                        type="button"
                      >
                        <span>{formatMemoryDateLabel(createForm.memoryDate)}</span>
                      </button>
                      <input name="memoryDate" type="hidden" value={createForm.memoryDate} />
                      {isDatePickerOpen ? (
                        <div className="planet-select-menu planet-date-menu" role="presentation">
                          <div
                            aria-label="Memory Date Calendar"
                            className="planet-date-picker"
                            id="planet-memory-date-calendar"
                            role="dialog"
                          >
                            <div className="planet-date-picker-header">
                              <button
                                aria-label="Previous month"
                                className="planet-date-picker-nav"
                                onClick={() =>
                                  setVisibleCalendarMonth((current) =>
                                    shiftCalendarMonth(current, -1),
                                  )
                                }
                                type="button"
                              >
                                <span aria-hidden="true">‹</span>
                              </button>
                              <p className="planet-date-picker-month">
                                {formatCalendarMonthLabel(visibleCalendarMonth)}
                              </p>
                              <button
                                aria-label="Next month"
                                className="planet-date-picker-nav"
                                onClick={() =>
                                  setVisibleCalendarMonth((current) =>
                                    shiftCalendarMonth(current, 1),
                                  )
                                }
                                type="button"
                              >
                                <span aria-hidden="true">›</span>
                              </button>
                            </div>
                            <div className="planet-date-picker-weekdays" aria-hidden="true">
                              {CALENDAR_WEEKDAY_LABELS.map((weekday) => (
                                <span key={weekday}>{weekday}</span>
                              ))}
                            </div>
                            <div className="planet-date-picker-grid">
                              {calendarDays.map((calendarDate, index) =>
                                calendarDate ? (
                                  <button
                                    aria-label={formatCalendarDayLabel(calendarDate)}
                                    className="planet-date-picker-day"
                                    data-selected={
                                      selectedMemoryDate
                                        ? formatMemoryDateValue(calendarDate) ===
                                          formatMemoryDateValue(selectedMemoryDate)
                                        : false
                                    }
                                    key={formatMemoryDateValue(calendarDate)}
                                    onClick={() => handleMemoryDateSelect(calendarDate)}
                                    type="button"
                                  >
                                    {calendarDate.getDate()}
                                  </button>
                                ) : (
                                  <span
                                    aria-hidden="true"
                                    className="planet-date-picker-day planet-date-picker-day--empty"
                                    key={`empty-${visibleCalendarMonth.getTime()}-${index}`}
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <label className="planet-create-field">
                    <span>Event Type</span>
                    <div ref={eventTypeSelectRef} className="planet-select">
                      <button
                        aria-controls="planet-event-type-listbox"
                        aria-expanded={isEventTypeMenuOpen}
                        aria-haspopup="listbox"
                        className="planet-select-trigger"
                        onClick={() => {
                          setIsDatePickerOpen(false);
                          setIsEventTypeMenuOpen((current) => !current);
                        }}
                        type="button"
                      >
                        <span>
                          {EVENT_TYPE_OPTIONS.find((option) => option.value === createForm.eventType)
                            ?.label ?? 'Select event type'}
                        </span>
                      </button>
                      {isEventTypeMenuOpen ? (
                        <div className="planet-select-menu" role="presentation">
                          <ul
                            aria-label="Event Type"
                            className="planet-select-listbox"
                            id="planet-event-type-listbox"
                            role="listbox"
                          >
                            {EVENT_TYPE_OPTIONS.map((option) => {
                              const isSelected = option.value === createForm.eventType;

                              return (
                                <li key={option.value} role="presentation">
                                  <button
                                    aria-selected={isSelected}
                                    className="planet-select-option"
                                    data-selected={isSelected ? 'true' : 'false'}
                                    onClick={() => handleEventTypeSelect(option.value)}
                                    role="option"
                                    type="button"
                                  >
                                    {option.label}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </label>
                </div>
                  <label className="planet-create-field">
                    <span>Location</span>
                    <input
                      name="locationText"
                      onChange={(inputEvent) =>
                        handleCreateFieldChange('locationText', inputEvent.target.value)
                      }
                      placeholder="Optional"
                      type="text"
                      value={createForm.locationText}
                    />
                  </label>
                  <label className="planet-create-field">
                    <span>Memory Notes</span>
                    <textarea
                      name="body"
                      onChange={(inputEvent) => handleCreateFieldChange('body', inputEvent.target.value)}
                      rows={6}
                      value={createForm.body}
                    />
                  </label>
                  <label className="planet-create-checkbox">
                    <input
                      checked={createForm.syncToMilkyWay}
                      name="syncToMilkyWay"
                      onChange={(inputEvent) =>
                        setCreateForm((current) => ({
                          ...current,
                          syncToMilkyWay: inputEvent.target.checked,
                        }))
                      }
                      type="checkbox"
                    />
                    <span>Sync this event to Milky Way</span>
                  </label>
                </div>

                <aside className="planet-upload-tray">
                  <div className="planet-upload-tray-copy">
                    <p className="planet-upload-tray-kicker">Memory Strip</p>
                    <h3>{editingEventId ? 'Edit Images' : 'Upload Images'}</h3>
                  </div>
                  <label className="planet-upload-dropzone">
                    <input accept="image/*" multiple onChange={handleUploadSelection} type="file" />
                    <span>Drop images here or browse from your device.</span>
                  </label>
                  <div className="planet-upload-list">
                    {uploadedPhotos.length === 0 ? (
                      <p className="planet-upload-empty">
                        {editingEventId
                          ? 'No images are attached to this event yet.'
                          : 'Uploaded images will appear here before you save the event.'}
                      </p>
                    ) : (
                      uploadedPhotos.map((photo) => (
                        <div key={photo.id} className={`planet-upload-item planet-upload-item--${photo.status}`}>
                          <div
                            className="planet-upload-preview"
                            style={{ backgroundImage: `url(${photo.thumbnailUrl ?? photo.previewUrl})` }}
                          />
                          <div className="planet-upload-item-copy">
                            <p>{photo.fileName}</p>
                            <span>
                              {photo.status === 'uploaded'
                                ? photo.existingEventPhotoId
                                  ? 'Already attached'
                                  : 'Uploaded'
                                : photo.status === 'uploading'
                                  ? 'Uploading...'
                                  : photo.error ?? 'Upload failed'}
                            </span>
                          </div>
                          {photo.status === 'uploading' ? null : (
                            <button
                              aria-label={`Remove image ${photo.fileName}`}
                              className="planet-upload-remove"
                              onClick={() => removeUploadedPhoto(photo.id)}
                              type="button"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </aside>
              </div>

              <div className="planet-create-actions">
                <button className="planet-create-secondary" onClick={handleCloseCreateModal} type="button">
                  Cancel
                </button>
                <button className="planet-page-primary-action" disabled={!isCreateFormValid} type="submit">
                  {isSavingEvent ? 'Saving...' : editingEventId ? 'Save Changes' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
