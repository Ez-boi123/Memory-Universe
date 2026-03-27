# Milky Way Page Design

## 1. Scope

This spec defines the authenticated `Milky Way` page for Memory Universe MVP.

It covers:

- page layout
- information hierarchy
- upload entry UI
- left-side galaxy timeline navigation
- right-side time-feed album presentation
- mock-data-driven page structure

It does not cover:

- real file upload
- storage integration
- real database persistence
- search
- batch management
- advanced filters
- real event selection logic

## 2. Product Intent

`Milky Way` is the photo memory module inside the shared relationship space.

The page should feel like:

- a calm shared album
- a time-based memory surface
- a premium editorial view of photos

It should not feel like:

- a media asset manager
- a generic gallery grid
- a backend control panel

The core experience is:

1. upload a photo into the shared archive
2. assign a required memory time during upload
3. optionally associate the photo with a `Planet` event
4. revisit photo memories through a timeline-driven album

## 3. Layout Model

The page uses a two-region editorial layout.

### 3.1 Left Region: Milky Way Timeline

The left side is a persistent vertical galaxy-inspired timeline.

Its role is navigation, not content display.

It shows:

- year/month timeline nodes
- current active month highlight
- click targets that scroll the right-side feed to the matching month section

Visual guidance:

- quiet glowing rail
- restrained cosmic treatment
- current section highlight stronger than inactive states
- decorative, but secondary to content

### 3.2 Right Region: Time-Feed Album

The right side is the primary content canvas.

It is not a masonry gallery and not a freeform collage.

It is a continuous vertical feed inspired by WeChat Moments:

- entries are organized in chronological flow
- month sections act like chapter dividers
- each entry represents a specific date
- each entry contains one or more photos and an optional short note

The right side must feel like a readable album, not a file browser.

## 4. Upload Model

### 4.1 Upload Entry

The first item at the top of the right-side feed is a dedicated `Upload tile`.

This tile behaves like a special photo slot instead of a utility button.

It should visually belong to the same system as the album cards while still being clearly actionable.

### 4.2 Upload Interaction

Clicking the tile opens a lightweight upload panel or modal.

The MVP UI skeleton includes these fields:

- photo file input
- memory time
- optional event association
- optional short note

Rules:

- memory time is required
- memory time defaults to the current time
- user may edit the time
- event association is optional
- note is optional

There is no explicit `pending archive` area on this page design.

After successful upload, photos conceptually enter the formal timeline directly.

## 5. Timeline Structure

The page uses hybrid time organization.

### 5.1 Macro Structure

The left timeline and right feed are grouped by `year / month`.

Each month acts as a chapter in the album.

### 5.2 Micro Structure

Within each chapter, entries are rendered by exact date.

Each entry shows:

- exact date
- photo content
- optional note

This preserves both:

- broad time navigation
- specific memory context

## 6. Feed Entry Design

Each feed entry corresponds to one date-level memory group.

### 6.1 Entry Contents

An entry contains:

- a date label
- a photo block
- an optional note block

If the user did not provide a note, the note block is omitted.

Event association metadata may exist in the underlying model, but it is not a prominent default display element in this version of the page.

### 6.2 Photo Presentation

Photo presentation follows a moments-like pattern:

- single image entries emphasize the image
- multi-image entries use a stable grid
- images are grouped so they read as one memory cluster for that date

The default reading order is:

1. image
2. date
3. note

This is required to preserve the album feel.

## 7. Density And Visual Style

The feed uses a `dense album` reading density with a stable editorial structure.

Design goals:

- high enough content density to feel like an active album
- enough spacing to remain calm and premium
- strong visual hierarchy without turning into a dashboard

Visual direction:

- calmer than the public landing page
- still consistent with the authenticated shell
- restrained cosmic accents
- content-first surfaces

The left timeline may carry more of the galaxy identity, while the right content area should prioritize readability and image focus.

## 8. States

### 8.1 Empty State

If there are no photos:

- the upload tile remains visible
- the feed shows a quiet first-use empty state
- the timeline remains present but minimal

The empty state should invite first upload without feeling like an error screen.

### 8.2 Populated State

If photos exist:

- the upload tile remains at the top
- month sections appear in descending time order, newest first
- active month syncs with the left timeline

### 8.3 Long Archive State

If there are many sections:

- left timeline remains the quick navigation mechanism
- right feed remains vertically scrollable
- interaction stays focused on browsing, not filtering

## 9. Component Boundaries

Suggested component split:

- `src/app/(app)/milky-way/page.tsx`
- `src/components/milky-way/MilkyWayOverview.tsx`
- `src/components/milky-way/MilkyWayTimelineNav.tsx`
- `src/components/milky-way/MilkyWayUploadTile.tsx`
- `src/components/milky-way/MilkyWayUploadPanel.tsx`
- `src/components/milky-way/MilkyWayFeed.tsx`
- `src/components/milky-way/MilkyWayEntry.tsx`
- `src/components/milky-way/MilkyWayPhotoGrid.tsx`
- `src/types/milky-way.ts`
- `src/server/presenters/milky-way-presenter.ts`

Responsibilities:

- presenter builds mock page view model
- overview assembles page regions
- timeline nav handles month navigation display
- upload tile and panel own upload-entry skeleton UI
- feed renders chronological sections
- entry renders date-grouped content
- photo grid renders single/multi-photo layouts consistently

## 10. Data And Mock Model

Implementation should use a presenter-driven mock model, not direct data fetching.

Suggested page model shape:

- page title / intro metadata
- upload tile state
- timeline month nodes
- month sections
- per-date entries
- per-entry image list
- optional note text

This keeps rendering deterministic and easy to test before real persistence is introduced.

## 11. Testing Focus

This design expects lightweight component and presenter coverage.

Priority test areas:

- presenter returns expected month/entry structure
- upload tile renders
- empty state renders
- month navigation renders correctly
- entry hides note block when note is absent
- photo grid handles single and multi-image variants

This phase does not require testing real upload transport or backend persistence.

## 12. Non-Goals

The following are explicitly out of scope for this Milky Way page implementation:

- real upload processing
- real image previews from storage
- drag-and-drop asset manager behavior
- search
- bulk select/delete flows
- timeline filters
- advanced event linking UI
- full mobile-first treatment
