import React from 'react';
import type { MilkyWaySectionModel } from '@/types/milky-way';
import { MilkyWayEntry } from '@/components/milky-way/MilkyWayEntry';

interface MilkyWayFeedProps {
  sections: MilkyWaySectionModel[];
}

export function MilkyWayFeed({ sections }: MilkyWayFeedProps) {
  return (
    <div className="milky-way-feed">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="milky-way-month-section">
          <h2 className="milky-way-month-title">{section.monthLabel}</h2>
          <div className="milky-way-entry-list">
            {section.entries.map((entry) => (
              <MilkyWayEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
