import { describe, expect, it, vi } from 'vitest';

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect,
}));

import EventDetailPage from './page';

describe('EventDetailPage', () => {
  it('redirects to the planet page with an encoded event id query', async () => {
    await EventDetailPage({
      params: Promise.resolve({
        eventId: 'planet/event?with&symbols',
      }),
    });

    expect(redirect).toHaveBeenCalledWith(
      '/planet?eventId=planet%2Fevent%3Fwith%26symbols',
    );
  });
});
