import React from 'react';

import type { PlanetEventCardViewModel } from '@/types/planet';

interface PlanetEventCardProps {
  event: PlanetEventCardViewModel;
  onOpen: (eventId: string) => void;
}

export function PlanetEventCard({ event, onOpen }: PlanetEventCardProps) {
  const orbitalFragments = event.memoryStrip;

  return (
    <button
      className={`planet-event-card planet-event-sphere-button planet-event-card--${event.planetVariant}`}
      data-layout-side={event.layoutSide}
      data-testid={`planet-event-${event.id}`}
      onClick={() => onOpen(event.id)}
      type="button"
    >
      <div className="planet-event-card-sphere" aria-hidden="true">
        <div
          className="planet-event-card-ring"
          data-testid={`planet-sphere-ring-${event.id}`}
        />
        <div
          className="planet-event-card-fragments"
          data-testid={`planet-sphere-fragments-${event.id}`}
        >
          {orbitalFragments.map((photo, index) => {
            const angleStep = orbitalFragments.length > 1 ? 360 / orbitalFragments.length : 0;
            const angle = orbitalFragments.length > 1 ? index * angleStep - 90 : -90;

            return (
              <span
                key={photo.id}
                className="planet-event-card-fragment"
                data-testid={`planet-sphere-fragment-${event.id}-${photo.id}`}
                style={
                  {
                    backgroundImage: `url(${photo.thumbnailUrl})`,
                    ['--planet-fragment-angle' as string]: `${angle}deg`,
                    ['--planet-fragment-counter-angle' as string]: `${-angle}deg`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
        <div
          className="planet-event-card-core"
          data-testid={`planet-sphere-core-${event.id}`}
        />
      </div>
      <div className="planet-event-card-copy" data-testid={`planet-sphere-meta-${event.id}`}>
        <div className="planet-event-card-meta">
          <p>{event.memoryDateLabel}</p>
          <p>{event.eventTypeLabel}</p>
          {event.locationText ? <p>{event.locationText}</p> : null}
        </div>
        <h2>{event.title}</h2>
      </div>
    </button>
  );
}
