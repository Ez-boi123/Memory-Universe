import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ConstellationComposer } from './ConstellationComposer';

describe('ConstellationComposer', () => {
  it('renders only when open and closes through the provided callback', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ConstellationComposer
        composer={{
          title: 'Write Into Your Shared Sky',
          helperText: 'Leave one short note that belongs with the rest of your shared constellation.',
          placeholder: 'Write a short message...',
          submitLabel: 'Add Note',
          cancelLabel: 'Cancel',
          maxLength: 220,
        }}
        isOpen
        onClose={onClose}
      />
    );

    expect(screen.getByRole('dialog', { name: 'Write Into Your Shared Sky' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
