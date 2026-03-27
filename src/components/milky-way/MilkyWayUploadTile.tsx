import React from 'react';
import type { MilkyWayUploadTileModel } from '@/types/milky-way';

interface MilkyWayUploadTileProps {
  model: MilkyWayUploadTileModel;
  isOpen: boolean;
  onToggle: () => void;
}

export function MilkyWayUploadTile({ model, isOpen, onToggle }: MilkyWayUploadTileProps) {
  return (
    <section className="milky-way-upload-tile">
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
      <p>{model.description}</p>
    </section>
  );
}
