'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ModulePageHeader } from '@/components/universe/ModulePageHeader';
import type { PlanetPageViewModel } from '@/types/planet';

import { PlanetArchive } from './PlanetArchive';

interface PlanetPageProps {
  model: PlanetPageViewModel;
  initialEventId?: string | null;
}

export function PlanetPage({ model, initialEventId = null }: PlanetPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId);
  const initialEventDetail = initialEventId ? model.eventDetails[initialEventId] : null;

  useEffect(() => {
    if (!initialEventId || initialEventDetail) {
      setSelectedEventId(initialEventId);
      return;
    }

    setSelectedEventId(null);
  }, [initialEventDetail, initialEventId]);

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
    if (!model.eventDetails[eventId]) {
      return;
    }

    setSelectedEventId(eventId);
    router.replace(buildPlanetUrl(eventId), {
      scroll: false,
    });
  }

  function handleClose() {
    setSelectedEventId(null);
    router.replace(buildPlanetUrl(null), { scroll: false });
  }

  const selectedEvent = selectedEventId ? model.eventDetails[selectedEventId] : null;

  return (
    <div className="planet-page">
      <ModulePageHeader
        action={
          <button
            aria-disabled="true"
            className="planet-page-primary-action"
            disabled
            title="New Event creation is implemented in the next task."
            type="button"
          >
            {model.header.actionLabel}
          </button>
        }
        description={model.header.description}
        eyebrow={model.header.eyebrow}
        title={model.header.title}
      />
      {model.events.length === 0 ? (
        <section className="planet-page-empty-state">
          <h2>{model.emptyState.title}</h2>
          <p>{model.emptyState.body}</p>
          <button
            aria-disabled="true"
            className="planet-page-primary-action"
            disabled
            title="New Event creation is implemented in the next task."
            type="button"
          >
            {model.emptyState.actionLabel}
          </button>
        </section>
      ) : (
        <PlanetArchive events={model.events} onOpen={handleOpen} />
      )}

      {selectedEvent ? (
        <div className="planet-modal-backdrop">
          <div
            aria-label={selectedEvent.title}
            aria-modal="true"
            className="planet-modal"
            role="dialog"
          >
            <button aria-label="Close" onClick={handleClose} type="button">
              Close
            </button>
            <h2>{selectedEvent.title}</h2>
          </div>
        </div>
      ) : null}
    </div>
  );
}
