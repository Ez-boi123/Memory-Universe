'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import type { PlanetPageViewModel } from '@/types/planet';

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
    setSelectedEventId(initialEventId);
  }, [initialEventId]);

  function handleOpen(eventId: string) {
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
    <div>
      {model.events.map((event) => (
        <button key={event.id} onClick={() => handleOpen(event.id)} type="button">
          {event.title}
        </button>
      ))}

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
