import React from 'react';
import Link from 'next/link';

import { ModulePageHeader } from '@/components/universe/ModulePageHeader';
import { presentMockEvents } from '@/server/presenters/event-presenter';

export function EventListPlaceholder() {
  const events = presentMockEvents();

  return (
    <div className="module-page-layout">
      <ModulePageHeader
        eyebrow="Planet"
        title="Memory Planet"
        description="Structured shared memory events, written and revisited like a calm archive."
        actionLabel="New Event"
      />
      <section className="placeholder-page-card">
        <div className="placeholder-grid">
          {events.map((event) => (
            <Link key={event.id} className="placeholder-panel" href={`/planet/${event.id}`}>
              <h2>{event.title}</h2>
              <p>{event.bodyPreview}</p>
              <p>Memory Date: {event.memoryDate}</p>
              <p>Last Edited By: {event.updatedBy}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
