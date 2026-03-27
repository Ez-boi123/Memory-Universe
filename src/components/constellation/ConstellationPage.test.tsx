import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ConstellationPage } from './ConstellationPage';

describe('ConstellationPage', () => {
  it('renders the floating action inside the composed page', () => {
    render(
      <ConstellationPage
        model={{
          hero: {
            eyebrow: 'Constellation',
            title: 'Memory Constellation',
            lead: 'Small notes stay brighter when they have a shared sky to return to.',
            description:
              'A quiet wall for greetings, affection, and short daily feelings that belong in the archive, not inside an event record.',
          },
          messages: [],
          emptyState: {
            title: 'No stars yet',
            description: 'Write the first note and let this shared sky begin with something small.',
          },
          floatingAction: {
            ariaLabel: 'Write a new constellation message',
          },
          composer: {
            title: 'Write Into Your Shared Sky',
            helperText: 'Leave one short note that belongs with the rest of your shared constellation.',
            placeholder: 'Write a short message...',
            submitLabel: 'Add Note',
            cancelLabel: 'Cancel',
            maxLength: 220,
          },
        }}
      />
    );

    expect(screen.getByRole('button', { name: 'Write a new constellation message' })).toBeInTheDocument();
  });
});
