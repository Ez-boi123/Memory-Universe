import React from 'react';

import type { PlanetEventDetailViewModel } from '@/types/planet';

interface PlanetEventDetailContentProps {
  event: PlanetEventDetailViewModel;
}

export function PlanetEventDetailContent({ event }: PlanetEventDetailContentProps) {
  return (
    <section className="planet-detail-content" data-testid="planet-detail-content">
      <div className="planet-detail-meta">
        <span>{event.memoryDateLabel}</span>
        <span>{event.eventTypeLabel}</span>
        {event.locationText ? <span>{event.locationText}</span> : null}
      </div>

      <div className="planet-detail-reading-head">
        <p className="planet-detail-kicker">Last edited by {event.lastEditedBy}</p>
        <h2 className="planet-detail-title">{event.title}</h2>
      </div>

      <div className="planet-detail-body">
        <p>{event.body}</p>
      </div>
    </section>
  );
}
