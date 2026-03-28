import React from 'react';

import type { PlanetEventCardViewModel } from '@/types/planet';

import { PlanetEventCard } from './PlanetEventCard';

interface PlanetArchiveProps {
  events: PlanetEventCardViewModel[];
  onOpen: (eventId: string) => void;
}

export function PlanetArchive({ events, onOpen }: PlanetArchiveProps) {
  return (
    <section className="planet-archive" aria-label="Planet archive">
      {events.map((event) => (
        <PlanetEventCard key={event.id} event={event} onOpen={onOpen} />
      ))}
    </section>
  );
}
