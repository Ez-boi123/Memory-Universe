'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ModulePageHeader } from '@/components/universe/ModulePageHeader';
import type { PlanetPageViewModel } from '@/types/planet';

import { PlanetArchive } from './PlanetArchive';

interface PlanetPageProps {
  model: PlanetPageViewModel;
  initialEventId?: string | null;
}

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  padding: '16px',
  background: 'rgba(4, 6, 16, 0.7)',
};

const modalStyle: React.CSSProperties = {
  width: 'min(720px, 100%)',
  maxHeight: 'calc(100vh - 32px)',
  overflow: 'auto',
  padding: '24px',
  borderRadius: '24px',
  background: 'rgba(14, 16, 33, 0.96)',
  boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
};

export function PlanetPage({ model, initialEventId = null }: PlanetPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId);

  useEffect(() => {
    if (!initialEventId || model.eventDetails[initialEventId]) {
      setSelectedEventId(initialEventId);
      return;
    }

    setSelectedEventId(null);
  }, [initialEventId, model.eventDetails]);

  function handleOpen(eventId: string) {
    if (!model.eventDetails[eventId]) {
      return;
    }

    setSelectedEventId(eventId);
    router.replace(`${pathname}?eventId=${encodeURIComponent(eventId)}`, {
      scroll: false,
    });
  }

  function handleClose() {
    setSelectedEventId(null);
    router.replace(pathname, { scroll: false });
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
      <PlanetArchive events={model.events} onOpen={handleOpen} />

      {selectedEvent ? (
        <div style={modalBackdropStyle}>
          <div aria-label={selectedEvent.title} aria-modal="true" role="dialog" style={modalStyle}>
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
