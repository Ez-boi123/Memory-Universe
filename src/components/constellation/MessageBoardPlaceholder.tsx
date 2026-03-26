import { presentMockMessages } from '@/server/presenters/message-presenter';

export function MessageBoardPlaceholder() {
  const messages = presentMockMessages();

  return (
    <section className="page-card">
      <p className="page-eyebrow">Memory Constellation</p>
      <h1 className="page-title">Message Board</h1>
      <p className="page-description">
        TODO: create/delete message actions and newest-first realtime refresh are not implemented.
      </p>
      <div className="placeholder-grid">
        {messages.map((message) => (
          <div key={message.id} className="placeholder-panel">
            <h2>{message.authorName}</h2>
            <p>{message.content}</p>
            <p>Created At: {message.createdAt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
