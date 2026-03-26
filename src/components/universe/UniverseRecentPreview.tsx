import React from 'react';
import type { UniverseRecentPreviewItem } from '@/types/universe';

interface UniverseRecentPreviewProps {
  items: readonly UniverseRecentPreviewItem[];
}

export function UniverseRecentPreview({ items }: UniverseRecentPreviewProps) {
  return (
    <section className="universe-section" aria-labelledby="universe-recent-preview-title">
      <div className="universe-section-heading">
        <p className="universe-kicker">Recent Preview</p>
        <h2 className="universe-section-title" id="universe-recent-preview-title">
          What is closest to the surface
        </h2>
        <p className="universe-section-description">
          A quiet snapshot of the most recent event, photo, and message threads.
        </p>
      </div>

      <div className="universe-recent-grid">
        {items.map((item) => (
          <article key={item.label} className="universe-recent-card">
            <p className="universe-recent-label">{item.label}</p>
            <h3 className="universe-recent-title">{item.title}</h3>
            <p className="universe-recent-description">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
