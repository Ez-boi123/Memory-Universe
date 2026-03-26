interface EventDetailPlaceholderProps {
  eventId: string;
}

export function EventDetailPlaceholder({ eventId }: EventDetailPlaceholderProps) {
  return (
    <section className="page-card">
      <p className="page-eyebrow">Memory Planet</p>
      <h1 className="page-title">Event Detail / Edit</h1>
      <p className="page-description">
        TODO: implement canonical event detail, shared editing form, delete confirmation, version
        history, and restore flow. Current event id: <strong>{eventId}</strong>.
      </p>
      <ul className="placeholder-list">
        <li>TODO: plain text editor for title, body, memory date, location, and event type.</li>
        <li>TODO: show last edited by / last edited at metadata.</li>
        <li>TODO: version history drawer and restore action.</li>
      </ul>
    </section>
  );
}
