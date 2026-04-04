import { describe, expect, it } from 'vitest';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';

describe('buildMilkyWayViewModel', () => {
  it('builds a newest-first page model with upload defaults and month navigation', () => {
    const model = buildMilkyWayViewModel({
      photos: [
        {
          archiveStatus: 'archived',
          displayUrl: 'https://cdn.example.com/photo-1.jpg',
          eventTitle: 'Moonlight Walk',
          id: 'milky-way-entry-2026-03-18',
          memoryDate: '2026-03-18',
          note: 'A note from upload.',
          thumbnailUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
          uploadedAt: '2026-03-19T08:00:00.000Z',
        },
      ],
    });

    expect(model.title).toBe('Memory Milky Way');
    expect(model.uploadPanel.defaultMemoryTime).toMatch(/^2026-/);
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
      eventTitle: 'Moonlight Walk',
      note: 'A note from upload.',
    });
    expect(model.sections[0].entries[0]?.photos[0]).toMatchObject({
      imageUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
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

  it('groups photos from the same upload batch into one entry with a combined grid', () => {
    const model = buildMilkyWayViewModel({
      photos: [
        {
          archiveStatus: 'archived',
          displayUrl: 'https://cdn.example.com/photo-1.jpg',
          eventTitle: 'Lantern Walk',
          id: 'photo-1',
          memoryDate: '2026-03-18',
          note: 'We stayed until the lights turned silver.',
          thumbnailUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
          uploadedAt: '2026-03-19T08:00:00.000Z',
        },
        {
          archiveStatus: 'archived',
          displayUrl: 'https://cdn.example.com/photo-2.jpg',
          id: 'photo-2',
          memoryDate: '2026-03-18',
          thumbnailUrl: 'https://cdn.example.com/photo-2-thumb.jpg',
          uploadedAt: '2026-03-19T08:00:24.000Z',
        },
      ],
    });

    expect(model.sections[0]?.entries).toHaveLength(1);
    expect(model.sections[0]?.entries[0]?.dateLabel).toBe('March 18, 2026');
    expect(model.sections[0]?.entries[0]?.eventTitle).toBe('Lantern Walk');
    expect(model.sections[0]?.entries[0]?.note).toBe('We stayed until the lights turned silver.');
    expect(model.sections[0]?.entries[0]?.photos).toHaveLength(2);
    expect(model.sections[0]?.entries[0]?.photos[0]).toMatchObject({
      id: 'photo-1',
      imageUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
    });
    expect(model.sections[0]?.entries[0]?.photos[1]).toMatchObject({
      id: 'photo-2',
      imageUrl: 'https://cdn.example.com/photo-2-thumb.jpg',
    });
  });

  it('keeps separate entries when uploads are far apart even on the same memory date', () => {
    const model = buildMilkyWayViewModel({
      photos: [
        {
          archiveStatus: 'archived',
          displayUrl: 'https://cdn.example.com/photo-1.jpg',
          id: 'photo-1',
          memoryDate: '2026-03-18',
          thumbnailUrl: 'https://cdn.example.com/photo-1-thumb.jpg',
          uploadedAt: '2026-03-19T08:00:00.000Z',
        },
        {
          archiveStatus: 'archived',
          displayUrl: 'https://cdn.example.com/photo-2.jpg',
          id: 'photo-2',
          memoryDate: '2026-03-18',
          thumbnailUrl: 'https://cdn.example.com/photo-2-thumb.jpg',
          uploadedAt: '2026-03-19T10:30:00.000Z',
        },
      ],
    });

    expect(model.sections[0]?.entries).toHaveLength(2);
    expect(model.sections[0]?.entries[0]?.photos).toHaveLength(1);
    expect(model.sections[0]?.entries[1]?.photos).toHaveLength(1);
  });
});
