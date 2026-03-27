import React from 'react';
import type { MilkyWayEntryModel } from '@/types/milky-way';
import { MilkyWayPhotoGrid } from '@/components/milky-way/MilkyWayPhotoGrid';

interface MilkyWayEntryProps {
  entry: MilkyWayEntryModel;
}

export function MilkyWayEntry({ entry }: MilkyWayEntryProps) {
  return (
    <article className="milky-way-entry">
      <p className="milky-way-entry-date">{entry.dateLabel}</p>
      <MilkyWayPhotoGrid photos={entry.photos} />
      {entry.note ? (
        <p className="milky-way-entry-note" data-testid="milky-way-entry-note">
          {entry.note}
        </p>
      ) : null}
    </article>
  );
}
