'use client';

import React, { useState } from 'react';

import type { PlanetPageViewModel } from '@/types/planet';

interface PlanetPageProps {
  model: PlanetPageViewModel;
}

export function PlanetPage({ model }: PlanetPageProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = selectedEventId ? model.eventDetails[selectedEventId] : null;

  return (
    <div>
      {model.events.map((event) => (
        <button key={event.id} onClick={() => setSelectedEventId(event.id)} type="button">
          {event.title}
        </button>
      ))}

      {selectedEvent ? (
        <div aria-label={selectedEvent.title} role="dialog">
          <button aria-label="Close" onClick={() => setSelectedEventId(null)} type="button">
            Close
          </button>
          <h2>{selectedEvent.title}</h2>
        </div>
      ) : null}
    </div>
  );
}
