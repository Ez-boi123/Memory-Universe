import { presentMockPhotos } from '@/server/presenters/photo-presenter';

export function PendingArchivePlaceholder() {
  const photos = presentMockPhotos().filter((photo) => photo.archiveStatus === 'pending_archive');

  return (
    <section className="page-card">
      <p className="page-eyebrow">Pending Archive</p>
      <h1 className="page-title">Upload Memory</h1>
      <p className="page-description">
        TODO: upload, archive confirmation, and event linking are all placeholder-only in this
        scaffold.
      </p>
      <div className="placeholder-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="placeholder-panel">
            <h2>{photo.id}</h2>
            <p>Uploaded At: {photo.uploadedAt}</p>
            <p>TODO: confirm memory date before moving to timeline.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
