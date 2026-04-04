import React from 'react';
import type { MilkyWayPhotoModel } from '@/types/milky-way';

interface MilkyWayPhotoGridProps {
  isEditing?: boolean;
  onPhotoToggle?: (photoId: string) => void;
  onPhotoOpen?: (photoId: string) => void;
  photos: MilkyWayPhotoModel[];
  selectedPhotoIds?: Set<string>;
}

export function MilkyWayPhotoGrid({
  isEditing = false,
  onPhotoOpen,
  onPhotoToggle,
  photos,
  selectedPhotoIds,
}: MilkyWayPhotoGridProps) {
  const layoutClassName =
    photos.length === 1
      ? 'is-single'
      : photos.length === 2 || photos.length === 4
        ? 'is-pair'
        : 'is-gallery';

  return (
    <div className={`milky-way-photo-grid ${layoutClassName}`} data-count={photos.length}>
      {photos.map((photo) => (
        <button
          key={photo.id}
          aria-label={isEditing ? `Select ${photo.alt}` : `Open ${photo.alt}`}
          className={`milky-way-photo-card is-${photo.accent}`}
          data-selected={selectedPhotoIds?.has(photo.id) ? 'true' : 'false'}
          onClick={() => (isEditing ? onPhotoToggle?.(photo.id) : onPhotoOpen?.(photo.id))}
          type="button"
        >
          {isEditing ? (
            <>
              <span
                aria-hidden="true"
                className="milky-way-photo-selection-indicator"
                data-selected={selectedPhotoIds?.has(photo.id) ? 'true' : 'false'}
              >
                {selectedPhotoIds?.has(photo.id) ? '✓' : ''}
              </span>
              <span
                aria-hidden="true"
                className="milky-way-photo-selection-overlay"
                data-selected={selectedPhotoIds?.has(photo.id) ? 'true' : 'false'}
              />
            </>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={photo.alt}
            className="milky-way-photo-card-image"
            src={photo.imageUrl}
          />
        </button>
      ))}
    </div>
  );
}
