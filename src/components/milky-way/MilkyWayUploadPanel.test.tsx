import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MilkyWayUploadPanel } from '@/components/milky-way/MilkyWayUploadPanel';
import { waitFor } from '@testing-library/react';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}));

const model = {
  defaultMemoryTime: '2026-03-27',
  eventLabel: 'Optional event',
  noteLabel: 'Optional note',
};

describe('MilkyWayUploadPanel', () => {
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    createObjectURL.mockReset();
    revokeObjectURL.mockReset();
    refresh.mockReset();
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

  it('uploads all selected photos with one shared memory date when the user confirms', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true, photo: { id: 'photo-1' } }),
      ok: true,
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<MilkyWayUploadPanel model={model} onCancel={onCancel} onConfirm={onConfirm} />);

    const input = screen.getByLabelText('Photo file');
    await user.upload(input, [
      new File(['a'], 'one.png', { type: 'image/png' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ]);
    await user.type(screen.getByLabelText('Optional event'), 'Boardwalk Evening');
    await user.type(screen.getByLabelText('Optional note'), 'A quiet blue hour by the water.');
    await user.click(screen.getByRole('button', { name: /mar 27, 2026/i }));
    await user.click(screen.getByRole('button', { name: /next month/i }));
    await user.click(screen.getByRole('button', { name: /april 3, 2026/i }));

    await user.click(screen.getByRole('button', { name: 'Confirm Upload' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall?.[0]).toBe('/api/photos/upload');
    expect(firstCall?.[1]?.method).toBe('POST');
    expect(firstCall?.[1]?.body).toBeInstanceOf(FormData);
    const formData = firstCall?.[1]?.body as FormData;
    expect(formData.get('eventTitle')).toBe('Boardwalk Evening');
    expect(formData.get('memoryDate')).toBe('2026-04-03');
    expect(formData.get('note')).toBe('A quiet blue hour by the water.');
    expect(formData.get('archiveDirectly')).toBe('true');
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('uses the custom calendar popover for memory time selection', async () => {
    const user = userEvent.setup();

    render(<MilkyWayUploadPanel model={model} onCancel={vi.fn()} onConfirm={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /mar 27, 2026/i }));

    expect(screen.getByRole('dialog', { name: /memory time calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next month/i }));
    await user.click(screen.getByRole('button', { name: /april 4, 2026/i }));

    expect(
      screen.queryByRole('dialog', { name: /memory time calendar/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apr 4, 2026/i })).toBeInTheDocument();
  });
});
