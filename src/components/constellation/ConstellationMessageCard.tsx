import React from 'react';

import type { ConstellationMessageCardViewModel } from '@/types/constellation';

interface ConstellationMessageCardProps {
  message: ConstellationMessageCardViewModel;
  index: number;
}

export function ConstellationMessageCard({ message, index }: ConstellationMessageCardProps) {
  return (
    <article
      className={`constellation-message-card ${
        index % 2 === 0 ? 'constellation-message-card--left' : 'constellation-message-card--right'
      }`}
    >
      <p className="constellation-message-meta">{message.createdAtLabel}</p>
      <h2 className="constellation-message-author">{message.authorName}</h2>
      <p className="constellation-message-content">{message.content}</p>
    </article>
  );
}
