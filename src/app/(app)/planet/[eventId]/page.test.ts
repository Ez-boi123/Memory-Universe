import { describe, expect, it, vi } from 'vitest';

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('next/navigation', () => ({
  redirect,
}));

import EventDetailPage from './page';

describe('EventDetailPage', () => {
  it('redirects to the planet page with an encoded event id query', async () => {
    await expect(
      EventDetailPage({
        params: Promise.resolve({
          eventId: 'planet/event?with&symbols',
        }),
      }),
    ).rejects.toThrow('NEXT_REDIRECT:/planet?eventId=planet%2Fevent%3Fwith%26symbols');

    expect(redirect).toHaveBeenCalledWith(
      '/planet?eventId=planet%2Fevent%3Fwith%26symbols',
    );
  });
});
