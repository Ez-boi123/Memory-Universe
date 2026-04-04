import React from 'react';

import type { PlanetEventDetailViewModel } from '@/types/planet';

interface PlanetEventDetailContentProps {
  event: PlanetEventDetailViewModel;
  onDelete: () => void;
  onEdit: () => void;
}

export function PlanetEventDetailContent({
  event,
  onDelete,
  onEdit,
}: PlanetEventDetailContentProps) {
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

      <div className="planet-detail-actions">
        <button className="planet-detail-secondary-action" onClick={onEdit} type="button">
          Edit
        </button>
        <button className="planet-detail-danger-action" onClick={onDelete} type="button">
          Delete
        </button>
      </div>
    </section>
  );
}
