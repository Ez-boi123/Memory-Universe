# Milky Way Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Milky Way placeholder with a timeline-driven editorial album page that has a left-side galaxy month navigator, a top upload tile, and a moments-style photo feed driven by mock presenter data.

**Architecture:** The page will follow the existing authenticated shell and presenter-driven pattern already used by the Universe page. Data stays mock-only and flows from a new Milky Way presenter into a focused set of view components: timeline nav, upload tile/panel, feed, entries, and photo grid.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, Testing Library, global CSS

---

## File Structure

### Create

- `src/types/milky-way.ts`
  - Milky Way page view-model types for month navigation, feed sections, entries, and upload tile defaults.
- `src/server/presenters/milky-way-presenter.ts`
  - Builds deterministic mock page data for empty and populated Milky Way states.
- `src/server/presenters/milky-way-presenter.test.ts`
  - Presenter coverage for populated and empty page models.
- `src/components/milky-way/MilkyWayOverview.tsx`
  - Top-level page composition for timeline + feed layout.
- `src/components/milky-way/MilkyWayTimelineNav.tsx`
  - Left-side month navigation rail.
- `src/components/milky-way/MilkyWayUploadTile.tsx`
  - First feed tile that invites photo upload.
- `src/components/milky-way/MilkyWayUploadPanel.tsx`
  - Static upload UI skeleton with required memory time and optional event/note fields.
- `src/components/milky-way/MilkyWayFeed.tsx`
  - Right-side feed section wrapper.
- `src/components/milky-way/MilkyWayEntry.tsx`
  - Date-level memory entry renderer.
- `src/components/milky-way/MilkyWayPhotoGrid.tsx`
  - Single-photo and multi-photo display grid.
- `src/components/milky-way/MilkyWayOverview.test.tsx`
  - End-to-end render test for populated page composition.
- `src/components/milky-way/MilkyWayEntry.test.tsx`
  - Entry tests for optional note rendering and date block output.
- `src/components/milky-way/MilkyWayPhotoGrid.test.tsx`
  - Grid tests for one-photo and multi-photo variants.

### Modify

- `src/app/(app)/milky-way/page.tsx`
  - Replace placeholder export with presenter-backed Milky Way overview.
- `src/styles/globals.css`
  - Add Milky Way-specific layout, timeline, upload tile, feed, entry, and photo-grid styles.

### Keep unchanged

- `src/components/milky-way/PendingArchivePlaceholder.tsx`
  - Leave unused for now; this plan does not remove unrelated placeholder pages.
- `src/app/(app)/milky-way/pending/page.tsx`
  - Leave untouched because pending is explicitly out of scope for this page redesign.

---

### Task 1: Define Milky Way View Model and Presenter

**Files:**
- Create: `src/types/milky-way.ts`
- Create: `src/server/presenters/milky-way-presenter.ts`
- Test: `src/server/presenters/milky-way-presenter.test.ts`

- [ ] **Step 1: Write the failing presenter test**

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/server/presenters/milky-way-presenter.test.ts`
Expected: FAIL with module-not-found errors for `milky-way-presenter` and `milky-way` types.

- [ ] **Step 3: Write minimal types and presenter implementation**

```ts
export interface MilkyWayUploadTileModel {
  title: string;
  description: string;
  defaultMemoryTime: string;
  eventLabel: string;
  noteLabel: string;
}

export interface MilkyWayEntryModel {
  id: string;
  dateLabel: string;
  note?: string;
  photos: Array<{
    id: string;
    alt: string;
    accent: 'violet' | 'blue' | 'rose';
  }>;
}

export interface MilkyWaySectionModel {
  id: string;
  monthLabel: string;
  entries: MilkyWayEntryModel[];
}

export interface MilkyWayTimelineNode {
  id: string;
  label: string;
  sectionId: string;
  isActive: boolean;
}

export interface MilkyWayPageModel {
  title: string;
  description: string;
  uploadTile: MilkyWayUploadTileModel;
  timeline: MilkyWayTimelineNode[];
  sections: MilkyWaySectionModel[];
  emptyState: {
    title: string;
    description: string;
  } | null;
}
```

```ts
import type { MilkyWayPageModel } from '@/types/milky-way';

interface BuildMilkyWayViewModelOptions {
  isEmpty?: boolean;
}

export function buildMilkyWayViewModel(
  options: BuildMilkyWayViewModelOptions = {},
): MilkyWayPageModel {
  const uploadTile = {
    title: 'Add to your Milky Way',
    description: 'Upload a photo, confirm the memory time, and optionally link it to an event.',
    defaultMemoryTime: '2026-03-27T10:30',
    eventLabel: 'Optional event',
    noteLabel: 'Optional note',
  };

  if (options.isEmpty) {
    return {
      title: 'Memory Milky Way',
      description: 'A time-led album for revisiting shared photos.',
      uploadTile,
      timeline: [],
      sections: [],
      emptyState: {
        title: 'Your Milky Way starts with one photo',
        description: 'The first upload becomes the opening memory in your timeline.',
      },
    };
  }

  return {
    title: 'Memory Milky Way',
    description: 'A time-led album for revisiting shared photos.',
    uploadTile,
    timeline: [
      {
        id: '2026-03',
        label: '2026 / 03',
        sectionId: 'milky-way-section-2026-03',
        isActive: true,
      },
      {
        id: '2026-02',
        label: '2026 / 02',
        sectionId: 'milky-way-section-2026-02',
        isActive: false,
      },
    ],
    sections: [
      {
        id: 'milky-way-section-2026-03',
        monthLabel: 'March 2026',
        entries: [
          {
            id: 'milky-way-entry-2026-03-18',
            dateLabel: 'March 18, 2026',
            note: 'The city felt quiet after midnight, so we kept walking.',
            photos: [
              { id: 'photo-1', alt: 'Night skyline', accent: 'violet' },
              { id: 'photo-2', alt: 'Street reflection', accent: 'blue' },
              { id: 'photo-3', alt: 'Cafe window', accent: 'rose' },
            ],
          },
        ],
      },
      {
        id: 'milky-way-section-2026-02',
        monthLabel: 'February 2026',
        entries: [
          {
            id: 'milky-way-entry-2026-02-09',
            dateLabel: 'February 9, 2026',
            photos: [{ id: 'photo-4', alt: 'Train platform', accent: 'blue' }],
          },
        ],
      },
    ],
    emptyState: null,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/server/presenters/milky-way-presenter.test.ts`
Expected: PASS with 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/types/milky-way.ts src/server/presenters/milky-way-presenter.ts src/server/presenters/milky-way-presenter.test.ts
git commit -m "feat: add milky way presenter model"
```

### Task 2: Replace the Page Placeholder With a Presenter-Backed Overview

**Files:**
- Modify: `src/app/(app)/milky-way/page.tsx`
- Create: `src/components/milky-way/MilkyWayOverview.tsx`
- Test: `src/components/milky-way/MilkyWayOverview.test.tsx`

- [ ] **Step 1: Write the failing overview test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MilkyWayOverview } from '@/components/milky-way/MilkyWayOverview';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';

describe('MilkyWayOverview', () => {
  it('renders the timeline region, upload tile, and first month section', () => {
    render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

    expect(screen.getByText('Memory Milky Way')).toBeInTheDocument();
    expect(screen.getByText('Add to your Milky Way')).toBeInTheDocument();
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    expect(screen.getByText('2026 / 03')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/milky-way/MilkyWayOverview.test.tsx`
Expected: FAIL with module-not-found errors for `MilkyWayOverview`.

- [ ] **Step 3: Implement the page shell handoff**

```tsx
import { MilkyWayOverview } from '@/components/milky-way/MilkyWayOverview';
import { buildMilkyWayViewModel } from '@/server/presenters/milky-way-presenter';

export default function MilkyWayPage() {
  return <MilkyWayOverview model={buildMilkyWayViewModel()} />;
}
```

```tsx
import type { MilkyWayPageModel } from '@/types/milky-way';

interface MilkyWayOverviewProps {
  model: MilkyWayPageModel;
}

export function MilkyWayOverview({ model }: MilkyWayOverviewProps) {
  return (
    <section className="milky-way-page">
      <header className="milky-way-page-header">
        <p className="page-eyebrow">Milky Way</p>
        <h1 className="page-title">{model.title}</h1>
        <p className="page-description">{model.description}</p>
      </header>
      <div className="milky-way-layout">
        <aside className="milky-way-sidebar" aria-label="Milky Way timeline" />
        <div className="milky-way-feed-region">
          <section className="milky-way-upload-tile" />
          <section id={model.sections[0]?.id}>
            <h2>{model.sections[0]?.monthLabel}</h2>
          </section>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/milky-way/MilkyWayOverview.test.tsx`
Expected: PASS with 1 test passed.

- [ ] **Step 5: Commit**

```bash
git add src/app/(app)/milky-way/page.tsx src/components/milky-way/MilkyWayOverview.tsx src/components/milky-way/MilkyWayOverview.test.tsx
git commit -m "feat: mount milky way overview page"
```

### Task 3: Add the Timeline Nav, Upload Tile, and Upload Panel Skeleton

**Files:**
- Modify: `src/components/milky-way/MilkyWayOverview.tsx`
- Create: `src/components/milky-way/MilkyWayTimelineNav.tsx`
- Create: `src/components/milky-way/MilkyWayUploadTile.tsx`
- Create: `src/components/milky-way/MilkyWayUploadPanel.tsx`
- Modify: `src/components/milky-way/MilkyWayOverview.test.tsx`

- [ ] **Step 1: Extend the failing overview test**

```tsx
it('renders month links and the upload form defaults', () => {
  render(<MilkyWayOverview model={buildMilkyWayViewModel()} />);

  expect(screen.getByRole('navigation', { name: 'Milky Way months' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Upload to Milky Way' })).toBeInTheDocument();
  expect(screen.getByLabelText('Memory time')).toHaveValue('2026-03-27T10:30');
  expect(screen.getByLabelText('Optional event')).toHaveValue('');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/milky-way/MilkyWayOverview.test.tsx`
Expected: FAIL because navigation, button label, and form fields are missing.

- [ ] **Step 3: Implement the timeline and upload components**

```tsx
import type { MilkyWayTimelineNode } from '@/types/milky-way';

interface MilkyWayTimelineNavProps {
  nodes: MilkyWayTimelineNode[];
}

export function MilkyWayTimelineNav({ nodes }: MilkyWayTimelineNavProps) {
  return (
    <nav className="milky-way-timeline-nav" aria-label="Milky Way months">
      <ol className="milky-way-timeline-list">
        {nodes.map((node) => (
          <li key={node.id}>
            <a
              className={node.isActive ? 'milky-way-timeline-link is-active' : 'milky-way-timeline-link'}
              href={`#${node.sectionId}`}
            >
              {node.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

```tsx
import type { MilkyWayUploadTileModel } from '@/types/milky-way';

interface MilkyWayUploadTileProps {
  model: MilkyWayUploadTileModel;
}

export function MilkyWayUploadTile({ model }: MilkyWayUploadTileProps) {
  return (
    <section className="milky-way-upload-tile">
      <button className="milky-way-upload-trigger" type="button" aria-label="Upload to Milky Way">
        <span className="milky-way-upload-plus">+</span>
        <span>{model.title}</span>
      </button>
      <p>{model.description}</p>
    </section>
  );
}
```

```tsx
import type { MilkyWayUploadTileModel } from '@/types/milky-way';

interface MilkyWayUploadPanelProps {
  model: MilkyWayUploadTileModel;
}

export function MilkyWayUploadPanel({ model }: MilkyWayUploadPanelProps) {
  return (
    <form className="milky-way-upload-panel">
      <label>
        Photo file
        <input type="file" name="photo" />
      </label>
      <label>
        Memory time
        <input defaultValue={model.defaultMemoryTime} name="memoryTime" type="datetime-local" />
      </label>
      <label>
        {model.eventLabel}
        <input defaultValue="" name="eventName" type="text" />
      </label>
      <label>
        {model.noteLabel}
        <textarea name="note" rows={3} />
      </label>
    </form>
  );
}
```

```tsx
<div className="milky-way-layout">
  <aside className="milky-way-sidebar">
    <MilkyWayTimelineNav nodes={model.timeline} />
  </aside>
  <div className="milky-way-feed-region">
    <MilkyWayUploadTile model={model.uploadTile} />
    <MilkyWayUploadPanel model={model.uploadTile} />
  </div>
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/milky-way/MilkyWayOverview.test.tsx`
Expected: PASS with the new navigation and upload-field assertions passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/milky-way/MilkyWayOverview.tsx src/components/milky-way/MilkyWayTimelineNav.tsx src/components/milky-way/MilkyWayUploadTile.tsx src/components/milky-way/MilkyWayUploadPanel.tsx src/components/milky-way/MilkyWayOverview.test.tsx
git commit -m "feat: add milky way timeline and upload shell"
```

### Task 4: Implement the Feed, Date Entries, and Photo Grid

**Files:**
- Modify: `src/components/milky-way/MilkyWayOverview.tsx`
- Create: `src/components/milky-way/MilkyWayFeed.tsx`
- Create: `src/components/milky-way/MilkyWayEntry.tsx`
- Create: `src/components/milky-way/MilkyWayPhotoGrid.tsx`
- Create: `src/components/milky-way/MilkyWayEntry.test.tsx`
- Create: `src/components/milky-way/MilkyWayPhotoGrid.test.tsx`

- [ ] **Step 1: Write the failing entry and grid tests**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MilkyWayEntry } from '@/components/milky-way/MilkyWayEntry';

describe('MilkyWayEntry', () => {
  it('renders the date and hides the note block when note is absent', () => {
    render(
      <MilkyWayEntry
        entry={{
          id: 'entry-1',
          dateLabel: 'February 9, 2026',
          photos: [{ id: 'photo-1', alt: 'Platform', accent: 'blue' }],
        }}
      />,
    );

    expect(screen.getByText('February 9, 2026')).toBeInTheDocument();
    expect(screen.queryByTestId('milky-way-entry-note')).not.toBeInTheDocument();
  });
});
```

```tsx
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/milky-way/MilkyWayEntry.test.tsx src/components/milky-way/MilkyWayPhotoGrid.test.tsx`
Expected: FAIL with module-not-found errors for the new components.

- [ ] **Step 3: Implement the feed and card components**

```tsx
import type { MilkyWayEntryModel } from '@/types/milky-way';
import { MilkyWayPhotoGrid } from '@/components/milky-way/MilkyWayPhotoGrid';

interface MilkyWayEntryProps {
  entry: MilkyWayEntryModel;
}

export function MilkyWayEntry({ entry }: MilkyWayEntryProps) {
  return (
    <article className="milky-way-entry">
      <p className="milky-way-entry-date">{entry.dateLabel}</p>
      <MilkyWayPhotoGrid photos={entry.photos} />
      {entry.note ? (
        <p className="milky-way-entry-note" data-testid="milky-way-entry-note">
          {entry.note}
        </p>
      ) : null}
    </article>
  );
}
```

```tsx
interface MilkyWayPhotoGridProps {
  photos: Array<{
    id: string;
    alt: string;
    accent: 'violet' | 'blue' | 'rose';
  }>;
}

export function MilkyWayPhotoGrid({ photos }: MilkyWayPhotoGridProps) {
  const gridClassName =
    photos.length === 1 ? 'milky-way-photo-grid is-single' : 'milky-way-photo-grid is-multi';

  return (
    <div className={gridClassName}>
      {photos.map((photo) => (
        <div key={photo.id} aria-label={photo.alt} className={`milky-way-photo-card is-${photo.accent}`} />
      ))}
    </div>
  );
}
```

```tsx
import type { MilkyWaySectionModel } from '@/types/milky-way';
import { MilkyWayEntry } from '@/components/milky-way/MilkyWayEntry';

interface MilkyWayFeedProps {
  sections: MilkyWaySectionModel[];
}

export function MilkyWayFeed({ sections }: MilkyWayFeedProps) {
  return (
    <div className="milky-way-feed">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="milky-way-month-section">
          <h2 className="milky-way-month-title">{section.monthLabel}</h2>
          <div className="milky-way-entry-list">
            {section.entries.map((entry) => (
              <MilkyWayEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

```tsx
<div className="milky-way-feed-region">
  <MilkyWayUploadTile model={model.uploadTile} />
  <MilkyWayUploadPanel model={model.uploadTile} />
  <MilkyWayFeed sections={model.sections} />
</div>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/milky-way/MilkyWayEntry.test.tsx src/components/milky-way/MilkyWayPhotoGrid.test.tsx src/components/milky-way/MilkyWayOverview.test.tsx`
Expected: PASS with all component tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/milky-way/MilkyWayOverview.tsx src/components/milky-way/MilkyWayFeed.tsx src/components/milky-way/MilkyWayEntry.tsx src/components/milky-way/MilkyWayPhotoGrid.tsx src/components/milky-way/MilkyWayEntry.test.tsx src/components/milky-way/MilkyWayPhotoGrid.test.tsx
git commit -m "feat: add milky way feed entries"
```

### Task 5: Add Empty-State Rendering and Final Layout Styling

**Files:**
- Modify: `src/components/milky-way/MilkyWayOverview.tsx`
- Modify: `src/components/milky-way/MilkyWayOverview.test.tsx`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Extend the failing overview test for the empty state**

```tsx
it('renders the empty state copy when the feed has no sections', () => {
  render(<MilkyWayOverview model={buildMilkyWayViewModel({ isEmpty: true })} />);

  expect(screen.getByText('Your Milky Way starts with one photo')).toBeInTheDocument();
  expect(
    screen.getByText('The first upload becomes the opening memory in your timeline.'),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/milky-way/MilkyWayOverview.test.tsx`
Expected: FAIL because the empty-state copy is not yet rendered.

- [ ] **Step 3: Implement the empty-state branch and Milky Way styles**

```tsx
{model.emptyState ? (
  <section className="milky-way-empty-state">
    <h2>{model.emptyState.title}</h2>
    <p>{model.emptyState.description}</p>
  </section>
) : (
  <MilkyWayFeed sections={model.sections} />
)}
```

```css
.milky-way-page {
  display: grid;
  gap: 24px;
}

.milky-way-layout {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.milky-way-sidebar {
  position: sticky;
  top: 128px;
}

.milky-way-timeline-nav {
  border: 1px solid rgba(233, 226, 246, 0.12);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(14, 16, 33, 0.92), rgba(10, 12, 25, 0.88));
}

.milky-way-feed-region,
.milky-way-empty-state,
.milky-way-month-section,
.milky-way-upload-tile,
.milky-way-upload-panel,
.milky-way-entry {
  border: 1px solid rgba(233, 226, 246, 0.12);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(14, 16, 33, 0.92), rgba(10, 12, 25, 0.88));
}

.milky-way-photo-grid {
  display: grid;
  gap: 12px;
}

.milky-way-photo-grid.is-single {
  grid-template-columns: 1fr;
}

.milky-way-photo-grid.is-multi {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.milky-way-photo-card {
  min-height: 160px;
  border-radius: 18px;
}

.milky-way-photo-card.is-violet {
  background: linear-gradient(135deg, rgba(93, 70, 201, 0.96), rgba(61, 74, 144, 0.94));
}
```

- [ ] **Step 4: Run the page tests and lint**

Run: `npm test -- src/server/presenters/milky-way-presenter.test.ts src/components/milky-way/MilkyWayOverview.test.tsx src/components/milky-way/MilkyWayEntry.test.tsx src/components/milky-way/MilkyWayPhotoGrid.test.tsx`
Expected: PASS with all Milky Way tests green.

Run: `npm run lint`
Expected: PASS with no new ESLint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/milky-way/MilkyWayOverview.tsx src/components/milky-way/MilkyWayOverview.test.tsx src/styles/globals.css
git commit -m "feat: style milky way page layout"
```

### Task 6: Full Verification and Branch Checkpoint

**Files:**
- Modify: none
- Test: entire touched surface

- [ ] **Step 1: Run targeted Milky Way test suite**

Run: `npm test -- src/server/presenters/milky-way-presenter.test.ts src/components/milky-way/MilkyWayOverview.test.tsx src/components/milky-way/MilkyWayEntry.test.tsx src/components/milky-way/MilkyWayPhotoGrid.test.tsx`
Expected: PASS with all Milky Way tests green.

- [ ] **Step 2: Run repo verification commands**

Run: `npm run lint`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Review working tree state**

Run: `git status --short`
Expected: no modified files.

- [ ] **Step 4: Create final checkpoint commit if needed**

```bash
git commit --allow-empty -m "chore: verify milky way page implementation"
```

- [ ] **Step 5: Prepare for integration review**

```bash
git log --oneline -5
```

Expected: shows the Milky Way presenter, overview, feed, styling, and verification commits in order.

---

## Self-Review

### Spec coverage

- Layout model: covered by Tasks 2, 3, and 5.
- Upload tile and upload panel skeleton: covered by Task 3.
- Hybrid timeline organization and newest-first month sections: covered by Task 1 and Task 4.
- Feed entries with optional note and photo grid variants: covered by Task 4.
- Empty and populated states: covered by Tasks 1 and 5.
- Mock-data-only implementation: enforced by Task 1 presenter structure.

No spec gaps remain.

### Placeholder scan

- No `TODO`, `TBD`, or deferred implementation placeholders remain in the plan steps.
- Commands, files, and code snippets are concrete.

### Type consistency

- `MilkyWayPageModel`, `MilkyWaySectionModel`, `MilkyWayEntryModel`, and `MilkyWayUploadTileModel` are introduced in Task 1 and reused consistently in Tasks 2-5.
- `buildMilkyWayViewModel` is the only presenter entry point referenced throughout the plan.
