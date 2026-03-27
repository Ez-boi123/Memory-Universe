'use client';

import React, { useState } from 'react';
import type { MilkyWayPageModel } from '@/types/milky-way';
import { MilkyWayFeed } from '@/components/milky-way/MilkyWayFeed';
import { MilkyWayTimelineNav } from '@/components/milky-way/MilkyWayTimelineNav';
import { MilkyWayUploadPanel } from '@/components/milky-way/MilkyWayUploadPanel';
import { MilkyWayUploadTile } from '@/components/milky-way/MilkyWayUploadTile';

interface MilkyWayOverviewProps {
  model: MilkyWayPageModel;
}

export function MilkyWayOverview({ model }: MilkyWayOverviewProps) {
  const hasTimeline = model.timeline.length > 0;
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <section className="milky-way-page">
      <header className="milky-way-page-header">
        <p className="page-eyebrow">Milky Way</p>
        <h1 className="page-title">{model.title}</h1>
        <p className="page-description">{model.description}</p>
      </header>
      <div className={hasTimeline ? 'milky-way-layout' : 'milky-way-layout is-empty'}>
        {hasTimeline ? (
          <aside className="milky-way-sidebar">
            <MilkyWayTimelineNav nodes={model.timeline} />
          </aside>
        ) : null}
        <div className="milky-way-feed-region">
          <MilkyWayUploadTile
            isOpen={isUploadOpen}
            model={model.uploadTile}
            onToggle={() => setIsUploadOpen((current) => !current)}
          />
          {isUploadOpen ? (
            <>
              <button
                aria-label="Close upload dialog"
                className="milky-way-upload-overlay"
                data-testid="milky-way-upload-overlay"
                type="button"
                onClick={() => setIsUploadOpen(false)}
              />
              <div
                aria-modal="true"
                className="milky-way-upload-dialog"
                role="dialog"
                onClick={(event) => event.stopPropagation()}
              >
                <MilkyWayUploadPanel
                  model={model.uploadPanel}
                  onCancel={() => setIsUploadOpen(false)}
                  onConfirm={() => setIsUploadOpen(false)}
                />
              </div>
            </>
          ) : null}
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
