import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MilkyWayPhotoGrid } from '@/components/milky-way/MilkyWayPhotoGrid';

describe('MilkyWayPhotoGrid', () => {
  it('uses a single-photo class for one image and switches to a two-column layout for small groups', () => {
    const { rerender, container } = render(
      <MilkyWayPhotoGrid
        photos={[
          {
            id: 'photo-1',
            alt: 'Skyline',
            accent: 'violet',
            imageUrl: 'https://cdn.example.com/skyline.jpg',
          },
        ]}
      />,
    );

    expect(container.firstChild).toHaveClass('milky-way-photo-grid', 'is-single');
    expect(screen.getByRole('img', { name: 'Skyline' })).toHaveAttribute(
      'src',
      'https://cdn.example.com/skyline.jpg',
    );

    rerender(
      <MilkyWayPhotoGrid
        photos={[
          {
            id: 'photo-1',
            alt: 'Skyline',
            accent: 'violet',
            imageUrl: 'https://cdn.example.com/skyline.jpg',
          },
          {
            id: 'photo-2',
            alt: 'Reflection',
            accent: 'blue',
            imageUrl: 'https://cdn.example.com/reflection.jpg',
          },
        ]}
      />,
    );

    expect(container.firstChild).toHaveClass('milky-way-photo-grid', 'is-pair');
    expect(screen.getByRole('img', { name: 'Reflection' })).toHaveAttribute(
      'src',
      'https://cdn.example.com/reflection.jpg',
    );
  });

  it('uses a three-column grid when there are five or more photos', () => {
    const { container } = render(
      <MilkyWayPhotoGrid
        photos={[
          {
            id: 'photo-1',
            alt: 'Skyline',
            accent: 'violet',
            imageUrl: 'https://cdn.example.com/skyline.jpg',
          },
          {
            id: 'photo-2',
            alt: 'Reflection',
            accent: 'blue',
            imageUrl: 'https://cdn.example.com/reflection.jpg',
          },
          {
            id: 'photo-3',
            alt: 'Station',
            accent: 'rose',
            imageUrl: 'https://cdn.example.com/station.jpg',
          },
          {
            id: 'photo-4',
            alt: 'Bridge',
            accent: 'violet',
            imageUrl: 'https://cdn.example.com/bridge.jpg',
          },
          {
            id: 'photo-5',
            alt: 'Night',
            accent: 'blue',
            imageUrl: 'https://cdn.example.com/night.jpg',
          },
        ]}
      />,
    );

    expect(container.firstChild).toHaveClass('milky-way-photo-grid', 'is-gallery');
  });

  it('uses a three-column grid for three-photo batches', () => {
    const { container } = render(
      <MilkyWayPhotoGrid
        photos={[
          {
            id: 'photo-1',
            alt: 'Skyline',
            accent: 'violet',
            imageUrl: 'https://cdn.example.com/skyline.jpg',
          },
          {
            id: 'photo-2',
            alt: 'Reflection',
            accent: 'blue',
            imageUrl: 'https://cdn.example.com/reflection.jpg',
          },
          {
            id: 'photo-3',
            alt: 'Station',
            accent: 'rose',
            imageUrl: 'https://cdn.example.com/station.jpg',
          },
        ]}
      />,
    );

    expect(container.firstChild).toHaveClass('milky-way-photo-grid', 'is-gallery');
  });

  it('renders photo cards as buttons so timeline images can open a larger preview', async () => {
    const user = userEvent.setup();
    const onPhotoOpen = vi.fn();

    render(
      <MilkyWayPhotoGrid
        onPhotoOpen={onPhotoOpen}
        photos={[
          {
            id: 'photo-1',
            alt: 'Skyline',
            accent: 'violet',
            imageUrl: 'https://cdn.example.com/skyline.jpg',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /open skyline/i }));

    expect(onPhotoOpen).toHaveBeenCalledWith('photo-1');
  });
});
