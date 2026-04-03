import React from 'react';

import type { PlanetEventDetailViewModel } from '@/types/planet';

interface PlanetEventDetailMediaStageProps {
  event: PlanetEventDetailViewModel;
  onImageOpen: (photoId: string) => void;
}

const FRAGMENT_VARIANTS = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'] as const;

function buildFrameStyle(index: number, total: number): React.CSSProperties {
  if (total === 1) {
    return {
      inset: '14% 14% 10% 14%',
      transform: 'rotate(-2deg) translate3d(0, 0, 0)',
      zIndex: 3,
    };
  }

  const variant = FRAGMENT_VARIANTS[index % FRAGMENT_VARIANTS.length];

  switch (variant) {
    case 'primary':
      return {
        inset: '18% 18% 14% 12%',
        transform: 'rotate(-5deg) translate3d(0, 0, 0)',
        zIndex: 4,
      };
    case 'secondary':
      return {
        inset: '8% 7% 40% 44%',
        transform: 'rotate(7deg) translate3d(0, 0, 0)',
        zIndex: 3,
      };
    case 'tertiary':
      return {
        inset: '56% 12% 7% 10%',
        transform: 'rotate(-9deg) translate3d(0, 0, 0)',
        zIndex: 2,
      };
    case 'quaternary':
      return {
        inset: '18% 52% 32% 7%',
        transform: 'rotate(10deg) translate3d(0, 0, 0)',
        zIndex: 2,
      };
    case 'quinary':
    default:
      return {
        inset: '42% 18% 18% 42%',
        transform: 'rotate(-4deg) translate3d(0, 0, 0)',
        zIndex: 1,
      };
  }
}

export function PlanetEventDetailMediaStage({
  event,
  onImageOpen,
}: PlanetEventDetailMediaStageProps) {
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
      <div className="planet-detail-photo-stack">
        {event.memoryStrip.map((photo, index) => (
          <button
            key={photo.id}
            aria-label={`Open ${photo.alt}`}
            className="planet-detail-photo-frame"
            data-testid={`planet-detail-photo-frame-${photo.id}`}
            onClick={() => onImageOpen(photo.id)}
            style={buildFrameStyle(index, event.memoryStrip.length)}
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
