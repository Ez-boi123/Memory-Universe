import React from 'react';

import type { PlanetEventCardViewModel } from '@/types/planet';

interface PlanetEventCardProps {
  event: PlanetEventCardViewModel;
  onOpen: (eventId: string) => void;
}

export function PlanetEventCard({ event, onOpen }: PlanetEventCardProps) {
  return (
    <button
      className={`planet-event-card planet-event-card--${event.planetVariant}`}
      data-layout-side={event.layoutSide}
      data-testid={`planet-event-${event.id}`}
      onClick={() => onOpen(event.id)}
      type="button"
    >
      <div className="planet-event-card-visual-wrap" aria-hidden="true">
        <div className="planet-event-card-orbit" />
        <div className="planet-event-card-visual" />
      </div>
      <div className="planet-event-card-copy">
        <div className="planet-event-card-meta">
          <p>{event.memoryDateLabel}</p>
          <p>{event.eventTypeLabel}</p>
        </div>
        <h2>{event.title}</h2>
        <p className="planet-event-card-preview">{event.bodyPreview}</p>
        <p className="planet-event-card-editor">
          Last edited by {event.lastEditedBy}
          {event.lastEditedAtLabel ? ` on ${event.lastEditedAtLabel}` : ''}
        </p>
      </div>
    </button>
  );
}
