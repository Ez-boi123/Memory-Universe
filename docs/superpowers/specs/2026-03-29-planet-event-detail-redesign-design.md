# Planet Event Detail Redesign Design

Date: 2026-03-29

## Summary

Redesign the expanded `Planet` event detail experience from a plain reading modal into an immersive memory chamber. The detail remains a modal layered above the page, but the internal composition shifts to a two-column layout:

- left: a `Planet Interior Stage` for event imagery
- right: an editorial reading surface for metadata and body content

The goal is to make opening an event feel like entering the inside of that event's planet while keeping the content readable and emotionally grounded.

## Goals

- Make event detail feel like entering a memory space, not reading a default modal.
- Keep the event detail as an overlay modal above the page.
- Lead with imagery, but preserve strong reading flow.
- Present event photos as layered film frames inside a memory chamber on the left.
- Present event content as a designed editorial reading surface on the right.
- Support click-to-enlarge for event photos.

## Non-Goals

- No carousel or full gallery browsing mode.
- No image upload from the detail modal in this pass.
- No rich text body editor.
- No version history, restore flow, or comments.
- No advanced motion-heavy 3D scene work.

## User Experience

### Opening context

Users arrive from the `Planet` archive list after clicking an event sphere. The detail view must feel like a deeper layer of the same object, but once open, the modal should read as a stable, focused interior chamber.

### Overall layout

The detail view remains a centered modal above the dimmed page backdrop. Inside, the first screen is split into two columns:

- left column: immersive image stage
- right column: editorial content column

This avoids a generic stacked layout and creates a deliberate “image first, then read” entry sequence.

## Left Column: Planet Interior Stage

The left side acts as the visual heart of the modal.

### Composition

- Use a dark, atmospheric chamber background with subtle glow and depth.
- Present event photos as `layered film frames`.
- The largest image frame anchors the composition.
- Supporting images sit behind or slightly offset from the primary frame.
- The arrangement should feel curated and precious, not like a utility thumbnail strip.

### Visual language

- Maintain continuity with the event sphere system: deep cosmic tones, soft glow, slight haze, quiet premium contrast.
- Avoid loud particle effects or exaggerated sci-fi ornament.
- The chamber should feel intimate and dreamlike, not gamified.

### Empty-image state

If an event has no images, preserve the chamber structure with an abstract memory placeholder:

- soft glow field
- restrained atmospheric shapes
- no blank empty rectangle

This keeps the modal spatially coherent even without media.

## Right Column: Editorial Reading Surface

The right side is a designed reading panel, not a settings sheet.

### Content order

1. metadata row
2. title
3. body copy

### Metadata

The metadata area should include:

- memory date
- event type
- location when available

It must remain visually light and not dominate the first screen.

### Title

The title should be prominent but subordinate to the image stage as the first emotional entry point.

### Body

The body is the primary reading surface:

- comfortable line length
- editorial spacing
- calm typography
- no “field label + value” feel

The user should feel they are reading a preserved memory, not inspecting stored data.

## Modal Chrome and Material

The outer modal should feel like a chamber, not a generic dialog card.

### Material direction

- deep dark surface
- subtle glass softness
- quiet edge glow
- layered shadow depth

### Relationship to list view

The event sphere list is the exterior archive surface. The modal is the inside of one selected memory planet. The color and lighting language should remain related, but the modal should feel expanded into a room-like interior rather than repeating the list card.

## Image Enlargement

Clicking an image in the left chamber should open a lightweight image enlargement layer.

### Interaction model

- The event detail modal remains open underneath.
- A secondary `lightbox modal` appears above it.
- The lightbox focuses on the selected image only.

### Scope

This first version supports:

- click image to enlarge
- close enlarged view

This first version does not support:

- next/previous image navigation
- gallery mode
- slideshow behavior

The intent is to keep the enlargement elegant and focused instead of expanding scope into a full media browser.

## Actions

Event management actions such as `Edit` and `Delete` should remain secondary in this redesign. They may stay present, but they must not interrupt the first reading flow or compete with the image chamber and body copy.

## Motion Principles

- Motion should be soft and premium.
- Opening the event detail should already be handled by the existing list-to-modal interaction.
- Inside the detail modal, imagery and panels should feel stable rather than over-animated.
- Image enlargement may use a restrained fade/scale treatment.

## Accessibility

- The event detail remains a semantic modal dialog.
- The image enlargement layer must also behave as a dialog above the detail modal.
- Focus should move predictably into the topmost layer.
- Close controls must remain obvious and keyboard reachable.

## Implementation Boundaries

This redesign should be implemented within the existing `Planet` event detail surface without changing unrelated product flows.

Primary files likely affected:

- `src/components/planet/PlanetPage.tsx`
- `src/components/planet/PlanetPage.test.tsx`
- `src/styles/globals.css`

Additional focused detail components may be introduced if needed, but they should stay within the `planet` feature boundary.

## Testing Expectations

Add or update tests for:

- redesigned detail modal content structure
- image chamber rendering with images
- empty-image detail state
- click-to-enlarge image flow
- close behavior for the image lightbox

## Final Direction

The redesigned event detail should feel like entering the interior of a memory planet:

- image-led on the left
- editorial reading on the right
- emotionally immersive but readable
- premium and quiet rather than flashy
- enlarged image viewing available without turning the modal into a gallery product
