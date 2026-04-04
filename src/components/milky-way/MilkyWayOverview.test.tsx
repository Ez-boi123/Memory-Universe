import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MilkyWayOverview } from '@/components/milky-way/MilkyWayOverview';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';
import { beforeEach, vi } from 'vitest';

const refresh = vi.fn();
const fetchMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}));

vi.stubGlobal('fetch', fetchMock);

function buildTimelineModel() {
  return buildMilkyWayViewModel({
    photos: [
      {
        archiveStatus: 'archived',
        id: 'milky-way-entry-2026-03-18',
        memoryDate: '2026-03-18',
        uploadedAt: '2026-03-19T08:00:00.000Z',
      },
    ],
  });
}

describe('MilkyWayOverview', () => {
  beforeEach(() => {
    refresh.mockReset();
    fetchMock.mockReset();
  });

  it('renders the timeline region, upload tile, and first month section', () => {
    render(<MilkyWayOverview model={buildTimelineModel()} />);

    expect(screen.getByText('Memory Milky Way')).toBeInTheDocument();
    expect(screen.getByText('Add to your Milky Way')).toBeInTheDocument();
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(screen.getByText('2026 / 03')).toBeInTheDocument();
  });

  it('renders month links and the upload form defaults', () => {
    render(<MilkyWayOverview model={buildTimelineModel()} />);

    expect(screen.getByRole('navigation', { name: 'Milky Way months' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload to Milky Way' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /mar 27, 2026/i })).not.toBeInTheDocument();
  });

  it('reveals the upload form defaults after clicking the upload tile', async () => {
    const user = userEvent.setup();

    render(<MilkyWayOverview model={buildTimelineModel()} />);

    await user.click(screen.getByRole('button', { name: 'Upload to Milky Way' }));

    expect(screen.getByTestId('milky-way-upload-overlay')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mar 27, 2026/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Optional event')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Upload' })).toBeInTheDocument();
  });

  it('closes the upload dialog when the user clicks cancel', async () => {
    const user = userEvent.setup();

    render(<MilkyWayOverview model={buildTimelineModel()} />);

    await user.click(screen.getByRole('button', { name: 'Upload to Milky Way' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('button', { name: /mar 27, 2026/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId('milky-way-upload-overlay')).not.toBeInTheDocument();
  });

  it('closes the upload dialog when the user clicks the overlay', async () => {
    const user = userEvent.setup();

    render(<MilkyWayOverview model={buildTimelineModel()} />);

    await user.click(screen.getByRole('button', { name: 'Upload to Milky Way' }));
    await user.click(screen.getByTestId('milky-way-upload-overlay'));

    expect(screen.queryByRole('button', { name: /mar 27, 2026/i })).not.toBeInTheDocument();
  });

  it('renders the empty state copy when the feed has no sections', () => {
    const { container } = render(<MilkyWayOverview model={buildMilkyWayViewModel({ isEmpty: true })} />);

    expect(screen.getByText('Your Milky Way starts with one photo')).toBeInTheDocument();
    expect(
      screen.getByText('The first upload becomes the opening memory in your timeline.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Milky Way months' })).not.toBeInTheDocument();
    expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
    expect(container.querySelector('.milky-way-layout')).toHaveClass('is-empty');
  });

  it('supports edit mode selection and batch deletion', async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
    });

    render(
      <MilkyWayOverview
        model={buildMilkyWayViewModel({
          photos: [
            {
              archiveStatus: 'archived',
              displayUrl: 'https://cdn.example.com/photo-1.jpg',
              id: 'photo-1',
              memoryDate: '2026-03-18',
              thumbnailUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
              uploadedAt: '2026-03-19T08:00:00.000Z',
            },
            {
              archiveStatus: 'archived',
              displayUrl: 'https://cdn.example.com/photo-2.jpg',
              id: 'photo-2',
              memoryDate: '2026-03-18',
              thumbnailUrl: 'https://cdn.example.com/photo-2-thumb.jpg',
              uploadedAt: '2026-03-19T08:00:24.000Z',
            },
          ],
        })}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: /select archived photo photo-1/i }));

    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(
      screen.getByRole('dialog', { name: /delete selected milky way photos/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm Delete' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/photos', {
      body: JSON.stringify({
        photoIds: ['photo-1'],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('cancels edit mode and clears the current selection', async () => {
    const user = userEvent.setup();

    render(
      <MilkyWayOverview
        model={buildMilkyWayViewModel({
          photos: [
            {
              archiveStatus: 'archived',
              displayUrl: 'https://cdn.example.com/photo-1.jpg',
              id: 'photo-1',
              memoryDate: '2026-03-18',
              thumbnailUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
              uploadedAt: '2026-03-19T08:00:00.000Z',
            },
          ],
        })}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: /select archived photo photo-1/i }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('closes the custom delete dialog without deleting when cancelled', async () => {
    const user = userEvent.setup();

    render(
      <MilkyWayOverview
        model={buildMilkyWayViewModel({
          photos: [
            {
              archiveStatus: 'archived',
              displayUrl: 'https://cdn.example.com/photo-1.jpg',
              id: 'photo-1',
              memoryDate: '2026-03-18',
              thumbnailUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
              uploadedAt: '2026-03-19T08:00:00.000Z',
            },
          ],
        })}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: /select archived photo photo-1/i }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = screen.getByRole('dialog', { name: /delete selected milky way photos/i });
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('dialog', { name: /delete selected milky way photos/i }),
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
