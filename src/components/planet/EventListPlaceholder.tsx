import Link from 'next/link';

import { presentMockEvents } from '@/server/presenters/event-presenter';

export function EventListPlaceholder() {
  const events = presentMockEvents();

  return (
    <section className="page-card">
      <p className="page-eyebrow">Memory Planet</p>
      <h1 className="page-title">Memory Events</h1>
      <p className="page-description">
        TODO: event CRUD, collaborative editing, and version history are not implemented yet.
      </p>
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
  );
}
