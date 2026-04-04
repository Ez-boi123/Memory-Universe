import { describe, expect, it } from 'vitest';
import { resolveActiveSectionId } from '@/components/milky-way/MilkyWayTimelineNav';

describe('resolveActiveSectionId', () => {
  it('prefers the latest section whose top has crossed the viewport anchor', () => {
    const activeSectionId = resolveActiveSectionId({
      documentHeight: 2400,
      scrollY: 900,
      sectionMetrics: [
        { bottom: -40, id: 'may', top: -320 },
        { bottom: 200, id: 'april', top: -48 },
        { bottom: 1120, id: 'march', top: 96 },
      ],
      viewportHeight: 1000,
    });

    expect(activeSectionId).toBe('march');
  });

  it('falls back to the final section near the bottom of the page', () => {
    const activeSectionId = resolveActiveSectionId({
      documentHeight: 2000,
      scrollY: 1220,
      sectionMetrics: [
        { bottom: -180, id: 'may', top: -540 },
        { bottom: 80, id: 'april', top: -180 },
        { bottom: 860, id: 'march', top: 220 },
      ],
      viewportHeight: 780,
    });

    expect(activeSectionId).toBe('march');
  });

  it('keeps the current month active when the viewport anchor sits inside its content range', () => {
    const activeSectionId = resolveActiveSectionId({
      documentHeight: 3600,
      scrollY: 1360,
      sectionMetrics: [
        { bottom: -420, id: 'may', top: -980 },
        { bottom: 110, id: 'april', top: -260 },
        { bottom: 1480, id: 'march', top: 160 },
      ],
      viewportHeight: 960,
    });

    expect(activeSectionId).toBe('march');
  });
});
