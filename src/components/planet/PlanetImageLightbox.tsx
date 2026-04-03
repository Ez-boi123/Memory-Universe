import React from 'react';

import type { PlanetMemoryStripPhotoViewModel } from '@/types/planet';

interface PlanetImageLightboxProps {
  photo: PlanetMemoryStripPhotoViewModel;
  onClose: () => void;
}

export function PlanetImageLightbox({ photo, onClose }: PlanetImageLightboxProps) {
  return (
    <div className="planet-image-lightbox-backdrop" onClick={onClose}>
      <div
        aria-label={photo.alt}
        aria-modal="true"
        className="planet-image-lightbox"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button aria-label="Close image" className="planet-modal-close" onClick={onClose} type="button">
          <span aria-hidden="true" className="planet-modal-close-icon">
            <span />
            <span />
          </span>
        </button>
        <div className="planet-image-lightbox-frame">
          <div
            aria-label={photo.alt}
            className="planet-image-lightbox-image"
            role="img"
            style={{ backgroundImage: `url(${photo.thumbnailUrl})` }}
          />
        </div>
      </div>
    </div>
  );
}
