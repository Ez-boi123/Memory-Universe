import React from 'react';
import type { MilkyWayUploadTileModel } from '@/types/milky-way';

interface MilkyWayUploadTileProps {
  actions?: React.ReactNode;
  model: MilkyWayUploadTileModel;
  isOpen: boolean;
  onToggle: () => void;
}

export function MilkyWayUploadTile({ actions, model, isOpen, onToggle }: MilkyWayUploadTileProps) {
  return (
    <section className="milky-way-upload-tile">
      <div className="milky-way-upload-tile-header">
        <button
          aria-controls="milky-way-upload-panel"
          aria-expanded={isOpen}
          className="milky-way-upload-trigger"
          type="button"
          aria-label="Upload to Milky Way"
          onClick={onToggle}
        >
          <span className="milky-way-upload-plus">+</span>
          <span>{model.title}</span>
        </button>
      </div>
      <div className="milky-way-upload-tile-meta">
        <p>{model.description}</p>
        {actions ? <div className="milky-way-upload-tile-actions">{actions}</div> : null}
      </div>
    </section>
  );
}
