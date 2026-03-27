import React from 'react';
import type { MilkyWayPhotoModel } from '@/types/milky-way';

interface MilkyWayPhotoGridProps {
  photos: MilkyWayPhotoModel[];
}

export function MilkyWayPhotoGrid({ photos }: MilkyWayPhotoGridProps) {
  const gridClassName =
    photos.length === 1 ? 'milky-way-photo-grid is-single' : 'milky-way-photo-grid is-multi';

  return (
    <div className={gridClassName}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`milky-way-photo-card is-${photo.accent}`}
          role="img"
          aria-label={photo.alt}
        />
      ))}
    </div>
  );
}
