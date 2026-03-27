import React from 'react';
import type { MilkyWayUploadTileModel } from '@/types/milky-way';

interface MilkyWayUploadTileProps {
  model: MilkyWayUploadTileModel;
}

export function MilkyWayUploadTile({ model }: MilkyWayUploadTileProps) {
  return (
    <section className="milky-way-upload-tile">
      <button className="milky-way-upload-trigger" type="button" aria-label="Upload to Milky Way">
        <span className="milky-way-upload-plus">+</span>
        <span>{model.title}</span>
      </button>
      <p>{model.description}</p>
    </section>
  );
}
