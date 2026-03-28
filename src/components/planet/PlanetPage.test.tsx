import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { buildPlanetPageViewModel } from '@/server/presenters/planet-presenter';

import { PlanetPage } from './PlanetPage';

describe('PlanetPage', () => {
  it('opens and closes the detail modal from an event card', async () => {
    const user = userEvent.setup();

    render(<PlanetPage model={buildPlanetPageViewModel()} />);

    await user.click(screen.getByRole('button', { name: /first shared memory placeholder/i }));

    expect(
      screen.getByRole('dialog', { name: /first shared memory placeholder/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
