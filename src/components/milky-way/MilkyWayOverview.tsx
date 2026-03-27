import React from 'react';
import type { MilkyWayPageModel } from '@/types/milky-way';

interface MilkyWayOverviewProps {
  model: MilkyWayPageModel;
}

export function MilkyWayOverview({ model }: MilkyWayOverviewProps) {
  return (
    <section className="milky-way-page">
      <header className="milky-way-page-header">
        <p className="page-eyebrow">Milky Way</p>
        <h1 className="page-title">{model.title}</h1>
        <p className="page-description">{model.description}</p>
      </header>
      <div className="milky-way-layout">
        <aside className="milky-way-sidebar" aria-label="Milky Way timeline">
          <span>{model.timeline[0]?.label}</span>
        </aside>
        <div className="milky-way-feed-region">
          <section className="milky-way-upload-tile">
            <h2>{model.uploadTile.title}</h2>
            <p>{model.uploadTile.description}</p>
          </section>
          <section id={model.sections[0]?.id}>
            <h2>{model.sections[0]?.monthLabel}</h2>
          </section>
        </div>
      </div>
    </section>
  );
}
