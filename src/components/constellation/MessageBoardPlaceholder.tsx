import React from 'react';
import { ModulePageHeader } from '@/components/universe/ModulePageHeader';
import { presentMockMessages } from '@/server/presenters/message-presenter';

export function MessageBoardPlaceholder() {
  const messages = presentMockMessages();

  return (
    <div className="module-page-layout">
      <ModulePageHeader
        eyebrow="Constellation"
        title="Memory Constellation"
        description="A quiet wall for small notes that stay part of the shared archive."
        actionLabel="Write Message"
      />
      <section className="placeholder-page-card">
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
    </div>
  );
}
