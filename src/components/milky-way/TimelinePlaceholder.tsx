import React from 'react';
import { ModulePageHeader } from '@/components/universe/ModulePageHeader';
import { presentMockPhotos } from '@/server/presenters/photo-presenter';

export function TimelinePlaceholder() {
  const photos = presentMockPhotos().filter((photo) => photo.archiveStatus === 'archived');

  return (
    <div className="module-page-layout">
      <ModulePageHeader
        eyebrow="Milky Way"
        title="Memory Milky Way"
        description="A visual timeline where photo memories settle into a readable path."
        actionLabel="Upload"
      />
      <section className="placeholder-page-card">
        <div className="placeholder-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="placeholder-panel">
              <h2>{photo.id}</h2>
              <p>Memory Date: {photo.memoryDate}</p>
              <p>Related Event: {photo.relatedEventId ?? 'None'}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
