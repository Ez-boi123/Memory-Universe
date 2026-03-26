import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ModulePageHeader } from './ModulePageHeader';

describe('ModulePageHeader', () => {
  it('renders eyebrow, title, description, and a non-interactive action label', () => {
    render(
      <ModulePageHeader
        eyebrow="Planet"
        title="Memory Planet"
        description="Structured shared memory events."
        actionLabel="New Event"
      />
    );

    expect(screen.getByText('Planet')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Memory Planet' })).toBeInTheDocument();
    expect(screen.getByText('Structured shared memory events.')).toBeInTheDocument();
    expect(screen.getByText('New Event')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'New Event' })).toBeNull();
  });
});
