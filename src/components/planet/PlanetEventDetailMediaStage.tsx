import React from 'react';

import type { PlanetEventDetailViewModel } from '@/types/planet';

interface PlanetEventDetailMediaStageProps {
  event: PlanetEventDetailViewModel;
  onImageOpen: (photoId: string) => void;
}

export function PlanetEventDetailMediaStage({
  event,
  onImageOpen,
}: PlanetEventDetailMediaStageProps) {
  const photoCount = event.memoryStrip.length;

  if (event.memoryStrip.length === 0) {
    return (
      <section
        className="planet-detail-media-stage planet-detail-media-stage--empty"
        data-testid="planet-detail-media-stage"
      >
        <div className="planet-detail-media-empty" data-testid="planet-detail-media-empty">
          <div className="planet-detail-media-empty-glow" />
          <div className="planet-detail-media-empty-core" />
          <div className="planet-detail-media-empty-ring" />
        </div>
      </section>
    );
  }

  return (
    <section className="planet-detail-media-stage" data-testid="planet-detail-media-stage">
      <div className="planet-detail-media-atmosphere" />
      <p className="planet-detail-media-kicker">Planet Interior Stage</p>
      <div
        className={`planet-detail-photo-grid ${
          photoCount === 1
            ? 'is-single'
            : photoCount === 2 || photoCount === 4
              ? 'is-pair'
              : 'is-moments'
        }`}
        data-count={photoCount}
        data-testid="planet-detail-photo-grid"
      >
        {event.memoryStrip.map((photo) => (
          <button
            key={photo.id}
            aria-label={`Open ${photo.alt}`}
            className="planet-detail-photo-frame"
            data-testid={`planet-detail-photo-frame-${photo.id}`}
            onClick={() => onImageOpen(photo.id)}
            type="button"
          >
            <span
              aria-hidden="true"
              className="planet-detail-photo-image"
              style={{ backgroundImage: `url(${photo.thumbnailUrl})` }}
            />
            <span aria-hidden="true" className="planet-detail-photo-glow" />
          </button>
        ))}
      </div>
    </section>
  );
}
