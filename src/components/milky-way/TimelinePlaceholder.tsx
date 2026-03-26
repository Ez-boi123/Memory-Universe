import { presentMockPhotos } from '@/server/presenters/photo-presenter';

export function TimelinePlaceholder() {
  const photos = presentMockPhotos().filter((photo) => photo.archiveStatus === 'archived');

  return (
    <section className="page-card">
      <p className="page-eyebrow">Memory Milky Way</p>
      <h1 className="page-title">Photo Timeline</h1>
      <p className="page-description">
        TODO: vertical timeline, photo detail, lazy loading, and event relation UI will arrive in a
        later phase.
      </p>
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
  );
}
