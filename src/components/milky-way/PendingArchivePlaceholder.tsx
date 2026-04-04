import type { PhotoSummary } from '@/types/domain';

interface PendingArchivePlaceholderProps {
  photos: PhotoSummary[];
}

export function PendingArchivePlaceholder({ photos }: PendingArchivePlaceholderProps) {

  return (
    <section className="page-card">
      <p className="page-eyebrow">Pending Archive</p>
      <h1 className="page-title">Upload Memory</h1>
      <p className="page-description">
        TODO: upload, archive confirmation, and event linking are all placeholder-only in this
        scaffold.
      </p>
      {photos.length > 0 ? (
        <div className="placeholder-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="placeholder-panel">
              <h2>{photo.id}</h2>
              <p>Uploaded At: {photo.uploadedAt}</p>
              <p>TODO: confirm memory date before moving to timeline.</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="placeholder-panel">
          <h2>No pending archive photos</h2>
          <p>New uploads waiting for memory-date confirmation will appear here.</p>
        </div>
      )}
    </section>
  );
}
