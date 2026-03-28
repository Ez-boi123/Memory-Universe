import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ConstellationHero } from './ConstellationHero';

describe('ConstellationHero', () => {
  it('renders the constellation heading, lead copy, and hero cluster layer hook', () => {
    render(
      <ConstellationHero
        hero={{
          eyebrow: 'Constellation',
          title: 'Memory Constellation',
          lead: 'Small notes stay brighter when they have a shared sky to return to.',
          description:
            'A quiet wall for greetings, affection, and short daily feelings that belong in the archive, not inside an event record.',
        }}
      />
    );

    expect(screen.getByText('Constellation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Memory Constellation' })).toBeInTheDocument();
    expect(screen.getByText(/shared sky/i)).toBeInTheDocument();
    expect(screen.getByTestId('constellation-hero-cluster-layer')).toBeInTheDocument();
  });
});
