import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConstellationComposer } from './ConstellationComposer';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe('ConstellationComposer', () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.restoreAllMocks();
  });

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

  it('moves focus into the dialog and keeps tab navigation inside it', async () => {
    const user = userEvent.setup();

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
        onClose={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText('Write a short message...');
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    const submitButton = screen.getByRole('button', { name: 'Add Note' });

    await waitFor(() => expect(textarea).toHaveFocus());
    await user.type(textarea, 'A draft worth keeping.');

    await user.tab();
    expect(cancelButton).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();

    await user.tab();
    expect(textarea).toHaveFocus();
  });

  it('posts a new message and refreshes the page data without a manual reload', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ message: { id: 'message-1' }, ok: true }),
      ok: true,
    });

    vi.stubGlobal('fetch', fetchMock);

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

    await user.type(screen.getByPlaceholderText('Write a short message...'), 'A note worth keeping.');
    await user.click(screen.getByRole('button', { name: 'Add Note' }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/messages',
        expect.objectContaining({
          body: JSON.stringify({ content: 'A note worth keeping.' }),
          method: 'POST',
        })
      )
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
