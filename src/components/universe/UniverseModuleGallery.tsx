import React from 'react';
import Link from 'next/link';

import type { UniverseModuleCardViewModel } from '@/types/universe';

interface UniverseModuleGalleryProps {
  items: readonly UniverseModuleCardViewModel[];
}

export function UniverseModuleGallery({ items }: UniverseModuleGalleryProps) {
  return (
    <section className="universe-section" aria-labelledby="universe-module-gallery-title">
      <div className="universe-section-heading">
        <p className="universe-kicker">Module Gallery</p>
        <h2 className="universe-section-title" id="universe-module-gallery-title">
          Step into the shared spaces
        </h2>
        <p className="universe-section-description">
          Each module keeps one kind of memory in focus so the archive stays easy to return to.
        </p>
      </div>

      <div className="universe-module-grid">
        {items.map((item) => (
          <Link
            key={item.href}
            className={`universe-module-card universe-module-card--${item.visualName}`}
            href={item.href}
          >
            <span className="universe-module-visual" aria-hidden="true" />
            <span className="universe-module-content">
              <span className="universe-module-label">{item.label}</span>
              <span className="universe-module-description">{item.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
