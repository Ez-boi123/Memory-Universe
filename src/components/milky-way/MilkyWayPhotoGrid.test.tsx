import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MilkyWayPhotoGrid } from '@/components/milky-way/MilkyWayPhotoGrid';

describe('MilkyWayPhotoGrid', () => {
  it('uses a single-photo class for one image and a multi-photo class for many images', () => {
    const { rerender, container } = render(
      <MilkyWayPhotoGrid photos={[{ id: 'photo-1', alt: 'Skyline', accent: 'violet' }]} />,
    );

    expect(container.firstChild).toHaveClass('milky-way-photo-grid', 'is-single');
    expect(screen.getByLabelText('Skyline')).toBeInTheDocument();

    rerender(
      <MilkyWayPhotoGrid
        photos={[
          { id: 'photo-1', alt: 'Skyline', accent: 'violet' },
          { id: 'photo-2', alt: 'Reflection', accent: 'blue' },
        ]}
      />,
    );

    expect(container.firstChild).toHaveClass('milky-way-photo-grid', 'is-multi');
  });
});
