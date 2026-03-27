import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('closes through backdrop click and Escape key', async () => {
    const user = userEvent.setup();
    const onBackdropClose = vi.fn();

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
        onClose={onBackdropClose}
      />
    );

    await user.click(screen.getByRole('dialog', { name: 'Write Into Your Shared Sky' }).parentElement!);
    expect(onBackdropClose).toHaveBeenCalledTimes(1);
  });

  it('closes through Escape key when the dialog is focused', () => {
    const onEscapeClose = vi.fn();

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
        onClose={onEscapeClose}
      />
    );

    const dialog = screen.getByRole('dialog', { name: 'Write Into Your Shared Sky' });
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(onEscapeClose).toHaveBeenCalledTimes(1);
  });
});
