import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MilkyWayOverview } from '@/components/milky-way/MilkyWayOverview';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';

describe('MilkyWayOverview', () => {
  it('renders the timeline region, upload tile, and first month section', () => {
    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    expect(screen.getByText('Memory Milky Way')).toBeInTheDocument();
    expect(screen.getByText('Add to your Milky Way')).toBeInTheDocument();
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(screen.getByText('2026 / 03')).toBeInTheDocument();
  });

  it('renders month links and the upload form defaults', () => {
    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    expect(screen.getByRole('navigation', { name: 'Milky Way months' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload to Milky Way' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Memory time')).not.toBeInTheDocument();
  });

  it('reveals the upload form defaults after clicking the upload tile', async () => {
    const user = userEvent.setup();

    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    await user.click(screen.getByRole('button', { name: 'Upload to Milky Way' }));

    expect(screen.getByTestId('milky-way-upload-overlay')).toBeInTheDocument();
    expect(screen.getByLabelText('Memory time')).toHaveValue('2026-03-27T10:30');
    expect(screen.getByLabelText('Optional event')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Upload' })).toBeInTheDocument();
  });

  it('closes the upload dialog when the user clicks cancel', async () => {
    const user = userEvent.setup();

    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    await user.click(screen.getByRole('button', { name: 'Upload to Milky Way' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByLabelText('Memory time')).not.toBeInTheDocument();
    expect(screen.queryByTestId('milky-way-upload-overlay')).not.toBeInTheDocument();
  });

  it('closes the upload dialog when the user clicks the overlay', async () => {
    const user = userEvent.setup();

    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    await user.click(screen.getByRole('button', { name: 'Upload to Milky Way' }));
    await user.click(screen.getByTestId('milky-way-upload-overlay'));

    expect(screen.queryByLabelText('Memory time')).not.toBeInTheDocument();
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
});
