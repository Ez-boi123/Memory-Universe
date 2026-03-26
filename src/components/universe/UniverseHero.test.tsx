import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UniverseHero } from './UniverseHero';

describe('UniverseHero', () => {
  it('renders the hero headline, status label, and member summary', () => {
    render(
      <UniverseHero
        hero={{
          eyebrow: 'Memory Universe',
          title: 'J & M Universe',
          description: 'A quiet home for shared memories.',
          statusLabel: 'Active Universe',
          memberSummary: 'J · M',
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'J & M Universe' })).toBeInTheDocument();
    expect(screen.getByText('Memory Universe')).toBeInTheDocument();
    expect(screen.getByText('Active Universe')).toBeInTheDocument();
    expect(screen.getByText('J · M')).toBeInTheDocument();
  });
});
