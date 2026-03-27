import React from 'react';
import type { MilkyWayPageModel } from '@/types/milky-way';
import { MilkyWayFeed } from '@/components/milky-way/MilkyWayFeed';
import { MilkyWayTimelineNav } from '@/components/milky-way/MilkyWayTimelineNav';
import { MilkyWayUploadPanel } from '@/components/milky-way/MilkyWayUploadPanel';
import { MilkyWayUploadTile } from '@/components/milky-way/MilkyWayUploadTile';

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
        <aside className="milky-way-sidebar">
          <MilkyWayTimelineNav nodes={model.timeline} />
        </aside>
        <div className="milky-way-feed-region">
          <MilkyWayUploadTile model={model.uploadTile} />
          <MilkyWayUploadPanel model={model.uploadPanel} />
          {model.emptyState ? (
            <section className="milky-way-empty-state">
              <h2>{model.emptyState.title}</h2>
              <p>{model.emptyState.description}</p>
            </section>
          ) : (
            <MilkyWayFeed sections={model.sections} />
          )}
        </div>
      </div>
    </section>
  );
}
