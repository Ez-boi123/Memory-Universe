import React, { useMemo, useState } from 'react';
import type { MilkyWayEntryModel } from '@/types/milky-way';
import { MilkyWayPhotoGrid } from '@/components/milky-way/MilkyWayPhotoGrid';

interface MilkyWayEntryProps {
  entry: MilkyWayEntryModel;
  isEditing?: boolean;
  onPhotoToggle?: (photoId: string) => void;
  selectedPhotoIds?: Set<string>;
}

export function MilkyWayEntry({
  entry,
  isEditing = false,
  onPhotoToggle,
  selectedPhotoIds,
}: MilkyWayEntryProps) {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const selectedPhoto = useMemo(
    () => entry.photos.find((photo) => photo.id === selectedPhotoId) ?? null,
    [entry.photos, selectedPhotoId],
  );
  const hasLinkedEvent = Boolean(entry.eventTitle);

  return (
    <>
      <article className="milky-way-entry">
        <p className="milky-way-entry-date">{entry.dateLabel}</p>
        <div className={`milky-way-entry-content${hasLinkedEvent ? ' has-meta' : ''}`}>
          <MilkyWayPhotoGrid
            isEditing={isEditing}
            onPhotoOpen={setSelectedPhotoId}
            onPhotoToggle={onPhotoToggle}
            photos={entry.photos}
            selectedPhotoIds={selectedPhotoIds}
          />
          {hasLinkedEvent ? (
            <aside className="milky-way-entry-meta" data-testid="milky-way-entry-meta">
              <div className="milky-way-entry-meta-group">
                <p className="milky-way-entry-meta-title" data-testid="milky-way-entry-event">
                  {entry.eventTitle}
                </p>
              </div>
              <div className="milky-way-entry-meta-group">
                <p className="milky-way-entry-meta-label">Note</p>
                <p className="milky-way-entry-meta-value" data-testid="milky-way-entry-note">
                  {entry.note || 'No note added yet'}
                </p>
              </div>
            </aside>
          ) : null}
        </div>
      </article>
      {selectedPhoto ? (
        <div className="milky-way-image-lightbox-backdrop">
          <div aria-label="Photo preview" className="milky-way-image-lightbox" role="dialog">
            <button
              aria-label="Close photo preview"
              className="planet-modal-close milky-way-image-lightbox-close"
              onClick={() => setSelectedPhotoId(null)}
              type="button"
            >
              <span aria-hidden="true" className="planet-modal-close-icon">
                <span />
                <span />
              </span>
            </button>
            <div className="milky-way-image-lightbox-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={selectedPhoto.alt}
                className="milky-way-image-lightbox-image"
                src={selectedPhoto.imageUrl}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
