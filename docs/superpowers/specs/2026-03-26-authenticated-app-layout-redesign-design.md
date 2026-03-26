# Authenticated App Layout Redesign

## Goal

Redesign the logged-in Memory Universe experience from the current admin-style two-column shell into an editorial, gallery-light product layout with a strong relationship-first hero, top navigation, and calmer content pages for each module.

This redesign applies only to the authenticated product area.

It does not change:

- landing page
- sign-in / sign-up UI
- auth logic
- database schema
- upload implementation
- search
- invite flow
- event, photo, or message business logic

## Product Context

Based on `SPEC.md` and `PRD.md`, the logged-in product should feel like a private, emotional archive rather than a dashboard. The first screen should emphasize relationship identity and mood, then guide the user into the core modules:

- `Universe`
- `Planet`
- `Milky Way`
- `Constellation`

The experience should stay dreamy and cosmic, but memory content remains the protagonist. Visual effects support the product instead of overwhelming it.

## Chosen Direction

The approved direction is:

- layout style: `Editorial`
- information density: `Gallery-light`
- first-screen priority: `Relationship hero`
- navigation pattern: `Top nav`
- visual tone: `Strong carry-over` from the landing page

This means the logged-in experience should feel immersive and premium, with large visual areas, strong page rhythm, generous spacing, and minimal dashboard chrome.

## Design Principles

### 1. Relationship first

The first screen of the authenticated experience should communicate:

- whose shared space this is
- what emotional tone the space carries
- what state the relationship space is in

The user should feel they entered a meaningful private space, not a utility console.

### 2. Navigation is global, actions are local

Global navigation should only answer “where am I in the product?”

Page-specific actions should live inside each module page, not in the global header.

Examples:

- `Profile` belongs in the top nav
- `New Event` belongs in `Planet`
- `Upload` belongs in `Milky Way`
- `Write Message` belongs in `Constellation`

### 3. Homepage is emotional, module pages are calmer

`Universe` is the most expressive page. It should carry the strongest emotional identity and visual atmosphere.

Once the user enters `Planet`, `Milky Way`, `Constellation`, or `Account`, the interface should become more restrained and content-led while still remaining inside the same visual system.

### 4. No dashboard patterns

Avoid:

- left sidebar admin layouts
- dense utility panels
- metric cards
- notification-center composition
- multi-column control-console grids

The product should read like an archival editorial website, not a SaaS backend.

## Information Architecture

## Global Navigation

The authenticated shell uses a fixed top navigation bar.

Navigation items:

- `Universe`
- `Planet`
- `Milky Way`
- `Constellation`

Right-side action:

- `Profile` → routes to the account page

The top navigation does not include:

- search
- global upload button
- secondary settings clusters

## Search

Search is intentionally removed from this redesign scope.

There should be:

- no search page
- no search bar under the navigation
- no global search control in the app shell

This keeps the logged-in structure focused and aligned with the chosen editorial direction.

## Page Model

All authenticated pages share a common high-level shell:

1. fixed top navigation
2. single main content canvas
3. large-width desktop layout
4. no persistent sidebar

Within that shell, pages separate into two types:

- `Universe`: hero-led homepage
- module pages: calmer content pages with module-specific headers

## Universe Page

## Purpose

The `Universe` page is the emotional and navigational center of the product.

It should:

- establish relationship identity
- provide large module entry points
- preview recent memory content
- quietly expose relationship state

## Page Structure

### Section 1: Relationship Hero

This is the first screen and the most visually expressive area in the logged-in product.

Required content:

- relationship title
- short emotional description
- member summary
- relationship status

Layout:

- left side: title, description, members, status
- right side: large cosmic visual composition

This section may include primary entry actions for the core modules, but it should not include utility-heavy controls.

### Section 2: Module Entry Gallery

Directly below the hero, show three large editorial entry cards:

- `Memory Planet`
- `Memory Milky Way`
- `Memory Constellation`

Each card should include:

- a prominent visual area
- module title
- one short descriptive line

These cards are meant to feel like portals into the module, not feature checklists.

### Section 3: Recent Memory Preview

This section gives the homepage content presence without turning it into a feed.

It should preview:

- recent events
- recent photo moments
- recent messages

This is not a full list view. It is a curated glimpse into recent shared memory activity.

The tone should feel archival and reflective, not busy.

### Section 4: Relationship Archive Note

This is the quiet closing section of the homepage.

It should handle:

- relationship state explanation
- future frozen / pending messaging
- low-intensity archival notes

If the relationship is `pending` or `frozen`, this section becomes the main explanatory area instead of overloading the hero.

## Module Pages

The following pages should all inherit the same top shell and editorial visual language:

- `Planet`
- `Milky Way`
- `Constellation`
- `Account`

These pages should not repeat the full `Universe` hero. They should use a calmer page header and then move into content.

## Planet

Role:

- structured event archive and editing entry

Layout:

- module header
- page-specific primary action: `New Event`
- event-oriented content area

Tone:

- editorial, calm, text-readable
- less atmospheric than `Universe`

## Milky Way

Role:

- photo timeline and archive surface

Layout:

- module header
- page-specific primary action: `Upload`
- time-based visual content flow

Tone:

- more visual than `Planet`
- still calmer than `Universe`

## Constellation

Role:

- lightweight message wall

Layout:

- module header
- page-specific primary action: `Write Message`
- message stream content area

Tone:

- the quietest module page
- generous spacing and calm reading rhythm

## Account

Role:

- account/profile settings surface reached from `Profile`

Layout:

- restrained settings header
- profile/account sections

Tone:

- least theatrical page in the product
- consistent with the system but clearly utility-oriented

## Visual System

## Atmosphere

The logged-in experience keeps a strong carry-over from the landing page.

Required qualities:

- dark cosmic background
- purple / blue / pink light accents
- soft glow and nebula depth
- glassmorphism where appropriate

But the product content area must remain readable and not become decorative noise.

## Typography

The product should favor elegant, editorial typography with large hero titles and restrained supporting copy.

Hierarchy should be driven by:

- large title scale
- section spacing
- visual grouping

not by heavy UI chrome.

## Spacing And Density

The page should feel gallery-light:

- large horizontal breathing room
- large vertical spacing between sections
- fewer but larger blocks
- minimal clustering of small controls

## Interaction Model

## Global header behavior

- top navigation remains stable across authenticated pages
- active module state should be visually clear
- `Profile` routes to account

## Local action behavior

Each module page owns its main action:

- `Planet` → `New Event`
- `Milky Way` → `Upload`
- `Constellation` → `Write Message`

These actions are not duplicated in the global shell.

## Placeholder Strategy

This redesign is structural and presentational first.

Where real data is not implemented yet, components may use:

- presenter-layer placeholder data
- static preview blocks
- explicit placeholder copy that names the future data source

But the layout itself should be final enough that real content can slot in later without another shell rewrite.

## Implementation Boundaries

## In scope

- refactor authenticated app shell
- replace sidebar navigation with top navigation
- redesign `Universe` homepage layout
- align module pages to the new shell
- add or update presenter/view-model structures needed for the homepage
- add test coverage for new presenter and layout-critical UI

## Out of scope

- landing page redesign
- auth page redesign
- search
- real repository-backed recent content aggregation
- upload logic
- invite logic
- settings business logic
- database changes

## Recommended Build Order

1. Refactor the authenticated shell and top navigation
2. Rebuild the `Universe` page as the canonical editorial homepage
3. Align `Planet`, `Milky Way`, `Constellation`, and `Account` to the new shell
4. Polish section rhythm, visual hierarchy, and responsive desktop behavior

## Acceptance Criteria

The redesign is complete when:

- the logged-in app no longer uses a persistent sidebar layout
- the authenticated shell uses a fixed top navigation
- the top nav contains `Universe`, `Planet`, `Milky Way`, `Constellation`, and `Profile`
- there is no search UI anywhere in the authenticated shell
- the `Universe` page opens with a relationship-first hero
- the `Universe` page includes large module entry cards and recent memory previews
- module pages use the same shell but a calmer header pattern
- page-specific primary actions appear only in their own module pages
- the visual language is clearly connected to the landing page but more restrained in content pages
