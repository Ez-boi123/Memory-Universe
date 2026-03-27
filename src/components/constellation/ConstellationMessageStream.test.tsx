import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ConstellationMessageStream } from './ConstellationMessageStream';

describe('ConstellationMessageStream', () => {
  it('renders messages in the order received from the presenter', () => {
    render(
      <ConstellationMessageStream
        messages={[
          {
            id: 'message-3',
            authorName: 'Member Two',
            content: 'Newest note',
            createdAtLabel: 'Mar 26, 2026',
          },
          {
            id: 'message-2',
            authorName: 'Member One',
            content: 'Older note',
            createdAtLabel: 'Mar 25, 2026',
          },
        ]}
        emptyState={{
          title: 'No stars yet',
          description: 'Write the first note and let this shared sky begin with something small.',
        }}
      />
    );

    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.map((node) => node.textContent)).toEqual(['Member Two', 'Member One']);
  });

  it('renders the empty state when there are no messages', () => {
    render(
      <ConstellationMessageStream
        messages={[]}
        emptyState={{
          title: 'No stars yet',
          description: 'Write the first note and let this shared sky begin with something small.',
        }}
      />
    );

    expect(screen.getByText('No stars yet')).toBeInTheDocument();
  });
});
