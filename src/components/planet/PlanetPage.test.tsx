import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { buildPlanetPageViewModel } from '@/server/presenters/planet-presenter';

import { PlanetPage } from './PlanetPage';

const { replace } = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/planet',
  useRouter: () => ({
    replace,
  }),
}));

describe('PlanetPage', () => {
  it('opens and closes the detail modal from an event card', async () => {
    const user = userEvent.setup();

    render(<PlanetPage model={buildPlanetPageViewModel()} />);

    await user.click(screen.getByRole('button', { name: /first shared memory placeholder/i }));

    expect(
      screen.getByRole('dialog', { name: /first shared memory placeholder/i }),
    ).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/planet?eventId=event-placeholder-1', {
      scroll: false,
    });

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith('/planet', { scroll: false });
  });

  it('opens the matching modal when an initial event id is provided', () => {
    render(
      <PlanetPage
        initialEventId="event-placeholder-2"
        model={buildPlanetPageViewModel()}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: /second shared memory placeholder/i }),
    ).toBeInTheDocument();
  });

  it('syncs the open modal when the event id prop changes', () => {
    const { rerender } = render(
      <PlanetPage
        initialEventId="event-placeholder-1"
        model={buildPlanetPageViewModel()}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: /first shared memory placeholder/i }),
    ).toBeInTheDocument();

    rerender(
      <PlanetPage
        initialEventId="event-placeholder-3"
        model={buildPlanetPageViewModel()}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: /third shared memory placeholder/i }),
    ).toBeInTheDocument();
  });
});
