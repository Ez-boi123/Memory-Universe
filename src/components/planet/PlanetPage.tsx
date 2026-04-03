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

function formatEventTypeLabel(eventType: string): string {
  return eventType ? eventType[0].toUpperCase() + eventType.slice(1) : 'Memory';
}

function buildBasePlanetEvents(model: PlanetPageViewModel): LocalPlanetEvent[] {
  return model.events.map((event) => {
    const detail = model.eventDetails[event.id];

    return {
      body: detail?.body ?? event.bodyPreview,
      bodyPreview: event.bodyPreview,
      eventTypeLabel: event.eventTypeLabel,
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

function buildMemoryStripFromUrls(title: string, urls: string[]): PlanetMemoryStripPhotoViewModel[] {
  return urls.map((url, index) => ({
    alt: `${title} memory fragment ${index + 1}`,
    id: `${title}-${index + 1}`,
    thumbnailUrl: url,
  }));
}

export function PlanetPage({ model, initialEventId = null }: PlanetPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEventTypeMenuOpen, setIsEventTypeMenuOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhotoState[]>([]);
  const [createdEvents, setCreatedEvents] = useState<LocalPlanetEvent[]>([]);
  const [createForm, setCreateForm] = useState(model.createDefaults);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [isModalEntering, setIsModalEntering] = useState(false);
  const [openingEventId, setOpeningEventId] = useState<string | null>(null);
  const initialEventDetail = initialEventId ? model.eventDetails[initialEventId] : null;
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

  const mergedEvents = useMemo(
    () => applyOrbitalLayout([...createdEvents, ...buildBasePlanetEvents(model)]),
    [createdEvents, model],
  );

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
    if (!initialEventId || initialEventDetail) {
      setSelectedEventId(initialEventId);
      setIsModalEntering(false);
      return;
    }

    setSelectedEventId(null);
    setIsModalEntering(false);
  }, [initialEventDetail, initialEventId]);

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

  function resetCreateState() {
    setCreateError(null);
    setCreateForm(model.createDefaults);
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

  async function handleUploadSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
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
      const response = await fetch('/api/events', {
        body: JSON.stringify({
          body: normalizedBody,
          eventType: createForm.eventType,
          locationText: createForm.locationText.trim(),
          memoryDate: normalizedDate,
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
          id: `created-event-${payload.event?.id ?? Date.now()}`,
          lastEditedAtLabel: 'Just now',
          lastEditedBy: 'You',
          layoutSide: 'left',
          locationText:
            payload.event?.locationText ?? (createForm.locationText.trim() || null),
          memoryDateLabel: (payload.event?.memoryDate ?? normalizedDate).slice(0, 10),
          memoryStrip:
            payload.photos && payload.photos.length > 0
              ? buildMemoryStripFromUrls(
                  payload.event?.title ?? normalizedTitle,
                  payload.photos.map((photo) => photo.thumbnailUrl),
                )
              : [],
          planetVariant: 'violet',
          title: payload.event?.title ?? normalizedTitle,
        },
        ...current,
      ]);
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
          onImageOpen={handleOpenImageLightbox}
        />
      ) : null}

      {selectedPhoto ? <PlanetImageLightbox photo={selectedPhoto} onClose={handleCloseImageLightbox} /> : null}

      {isCreateModalOpen ? (
        <div className="planet-modal-backdrop">
          <div aria-label="Create New Event" aria-modal="true" className="planet-modal planet-modal--create" role="dialog">
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
            <h2>Create New Event</h2>
            <p className="planet-modal-body">
              Capture the next event before it drifts out of reach and place it into orbit while
              the details are still close.
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
                    <label className="planet-create-field">
                      <span>Memory Date</span>
                      <input
                        name="memoryDate"
                        onChange={(inputEvent) =>
                          handleCreateFieldChange('memoryDate', inputEvent.target.value)
                        }
                        type="date"
                        value={createForm.memoryDate}
                      />
                    </label>
                  <label className="planet-create-field">
                    <span>Event Type</span>
                    <div ref={eventTypeSelectRef} className="planet-select">
                      <button
                        aria-controls="planet-event-type-listbox"
                        aria-expanded={isEventTypeMenuOpen}
                        aria-haspopup="listbox"
                        className="planet-select-trigger"
                        onClick={() => setIsEventTypeMenuOpen((current) => !current)}
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
                </div>

                <aside className="planet-upload-tray">
                  <div className="planet-upload-tray-copy">
                    <p className="planet-upload-tray-kicker">Memory Strip</p>
                    <h3>Upload Images</h3>
                  </div>
                  <label className="planet-upload-dropzone">
                    <input accept="image/*" multiple onChange={handleUploadSelection} type="file" />
                    <span>Drop images here or browse from your device.</span>
                  </label>
                  <div className="planet-upload-list">
                    {uploadedPhotos.length === 0 ? null : (
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
                                ? 'Uploaded'
                                : photo.status === 'uploading'
                                  ? 'Uploading...'
                                  : photo.error ?? 'Upload failed'}
                            </span>
                          </div>
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
                  {isSavingEvent ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
