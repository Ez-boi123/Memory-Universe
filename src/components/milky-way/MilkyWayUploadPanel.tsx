import React from 'react';
import type { MilkyWayUploadTileModel } from '@/types/milky-way';

interface MilkyWayUploadPanelProps {
  model: MilkyWayUploadTileModel;
}

export function MilkyWayUploadPanel({ model }: MilkyWayUploadPanelProps) {
  return (
    <form className="milky-way-upload-panel">
      <label>
        Photo file
        <input type="file" name="photo" />
      </label>
      <label>
        Memory time
        <input defaultValue={model.defaultMemoryTime} name="memoryTime" type="datetime-local" />
      </label>
      <label>
        {model.eventLabel}
        <input defaultValue="" name="eventName" type="text" />
      </label>
      <label>
        {model.noteLabel}
        <textarea name="note" rows={3} />
      </label>
    </form>
  );
}
