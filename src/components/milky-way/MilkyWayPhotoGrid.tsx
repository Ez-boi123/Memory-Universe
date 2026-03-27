import React from 'react';

interface MilkyWayPhotoGridProps {
  photos: Array<{
    id: string;
    alt: string;
    accent: 'violet' | 'blue' | 'rose';
  }>;
}

export function MilkyWayPhotoGrid({ photos }: MilkyWayPhotoGridProps) {
  const gridClassName =
    photos.length === 1 ? 'milky-way-photo-grid is-single' : 'milky-way-photo-grid is-multi';

  return (
    <div className={gridClassName}>
      {photos.map((photo) => (
        <div
          key={photo.id}
          aria-label={photo.alt}
          className={`milky-way-photo-card is-${photo.accent}`}
        />
      ))}
    </div>
  );
}
