import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PlaceholderPage } from './PlaceholderPage';

describe('PlaceholderPage', () => {
  it('renders without the module page shell wrapper', () => {
    const { container } = render(
      <PlaceholderPage
        eyebrow="Auth"
        title="Forgot Password"
        description="Reset instructions go here."
      />
    );

    expect(container.querySelector('.module-page-layout')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Forgot Password' })).toBeInTheDocument();
  });
});
