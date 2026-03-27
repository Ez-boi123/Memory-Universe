import React from 'react';

import type {
  ConstellationEmptyStateViewModel,
  ConstellationMessageCardViewModel,
} from '@/types/constellation';

import { ConstellationMessageCard } from './ConstellationMessageCard';

interface ConstellationMessageStreamProps {
  messages: ConstellationMessageCardViewModel[];
  emptyState: ConstellationEmptyStateViewModel;
}

export function ConstellationMessageStream({
  messages,
  emptyState,
}: ConstellationMessageStreamProps) {
  if (messages.length === 0) {
    return (
      <section className="constellation-empty-state">
        <h2>{emptyState.title}</h2>
        <p>{emptyState.description}</p>
      </section>
    );
  }

  return (
    <section className="constellation-message-stream">
      {messages.map((message, index) => (
        <ConstellationMessageCard key={message.id} message={message} index={index} />
      ))}
    </section>
  );
}
