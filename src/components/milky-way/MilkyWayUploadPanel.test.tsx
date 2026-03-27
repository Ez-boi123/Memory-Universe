import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MilkyWayUploadPanel } from '@/components/milky-way/MilkyWayUploadPanel';

const model = {
  defaultMemoryTime: '2026-03-27T10:30',
  eventLabel: 'Optional event',
  noteLabel: 'Optional note',
};

describe('MilkyWayUploadPanel', () => {
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    createObjectURL.mockReset();
    revokeObjectURL.mockReset();
    createObjectURL.mockImplementation((file: File) => `blob:${file.name}`);

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a quiet placeholder before any files are selected', () => {
    render(<MilkyWayUploadPanel model={model} onCancel={vi.fn()} onConfirm={vi.fn()} />);

    expect(screen.getByTestId('milky-way-upload-preview')).toHaveAttribute('data-state', 'empty');
    expect(screen.getByText('Select up to 9 photos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose photos' })).toBeInTheDocument();
    expect(screen.queryByText('Photo file')).not.toBeInTheDocument();
  });

  it('opens file selection when the preview surface is clicked', async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

    render(<MilkyWayUploadPanel model={model} onCancel={vi.fn()} onConfirm={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Choose photos' }));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows a 1-9 photo preview grid, appends newly added photos, and supports removal', async () => {
    const user = userEvent.setup();

    render(<MilkyWayUploadPanel model={model} onCancel={vi.fn()} onConfirm={vi.fn()} />);

    const input = screen.getByLabelText('Photo file');
    const firstSelection = [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
      new File(['c'], 'three.png', { type: 'image/png' }),
    ];

    await user.upload(input, firstSelection);

    expect(screen.getByTestId('milky-way-upload-preview')).toHaveAttribute('data-state', 'filled');
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByRole('img', { name: 'one.png' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'three.png' })).toBeInTheDocument();
    const addMoreButton = screen.getByRole('button', { name: 'Add more photos' });
    expect(addMoreButton).toBeInTheDocument();

    const secondSelection = [new File(['d'], 'four.png', { type: 'image/png' })];
    await user.upload(input, secondSelection);

    expect(screen.getAllByRole('img')).toHaveLength(4);
    expect(screen.getByRole('img', { name: 'one.png' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'four.png' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove one.png' }));

    expect(screen.queryByRole('img', { name: 'one.png' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:one.png');
  });
});
