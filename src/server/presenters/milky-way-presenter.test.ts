import { describe, expect, it } from 'vitest';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';

describe('buildMilkyWayViewModel', () => {
  it('builds a newest-first page model with upload defaults and month navigation', () => {
    const model = buildMilkyWayViewModel();

    expect(model.title).toBe('Memory Milky Way');
    expect(model.uploadTile.defaultMemoryTime).toMatch(/^2026-/);
    expect(model.timeline[0]).toMatchObject({
      label: '2026 / 03',
      sectionId: 'milky-way-section-2026-03',
      isActive: true,
    });
    expect(model.sections[0]).toMatchObject({
      id: 'milky-way-section-2026-03',
      monthLabel: 'March 2026',
    });
    expect(model.sections[0].entries[0]).toMatchObject({
      id: 'milky-way-entry-2026-03-18',
      dateLabel: 'March 18, 2026',
    });
  });

  it('returns a quiet empty state model when requested', () => {
    const model = buildMilkyWayViewModel({ isEmpty: true });

    expect(model.timeline).toEqual([]);
    expect(model.sections).toEqual([]);
    expect(model.emptyState).toMatchObject({
      title: 'Your Milky Way starts with one photo',
    });
  });
});
