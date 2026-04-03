# Planet Page Design

Date: 2026-03-28

## 1. Scope

This spec defines the first real `Planet` module experience inside the authenticated app shell.

The goal is to replace the current placeholder page with a usable memory-event browsing and editing flow that matches the editorial cosmic direction already established in the authenticated layout.

This spec covers:

- the `Planet` list page
- event presentation as star/planet units
- event detail modal
- create event modal
- edit-in-modal flow
- delete confirmation flow
- empty, loading, and error states

This spec does not cover:

- version history
- restore flow
- search
- event-photo linking
- rich text
- realtime collaboration
- custom tags

## 2. Product Intent

`Memory Planet` is the structured memory-event module.

The user should feel like they are browsing a shared field of recorded memory planets rather than a back-office list of content entries. The page must remain readable and usable first, with the planet metaphor supporting comprehension instead of replacing it.

The core interaction model is:

1. enter `Planet`
2. browse events in chronological order
3. click an event planet
4. read the full memory in a centered modal
5. optionally edit or delete without leaving the page

## 3. Page Structure

The page stays inside the existing authenticated shell:

- global top navigation remains unchanged
- `Planet` owns its own module header and main content area

### 3.1 Module Header

The top section of the page contains:

- eyebrow: `Planet`
- title: `Memory Planet`
- short description about recording shared memory events by memory date
- one primary action button: `New Event`

The header should be concise. It introduces the module and provides the single entry point for creating a new event.

### 3.2 Main Content Area

The main content area is an `orbital archive`.

Events are shown in chronological reading order, but the layout is not a plain list. Each event appears as a planet-based unit in an alternating left-right rhythm, producing an orbital reading pattern while preserving sequence clarity.

Default list order:

- newest memory first

## 4. Event List Design

### 4.1 Layout Model

The list uses an `orbital columns` composition:

- event 1: planet visual on one side, text block on the other
- event 2: mirrored arrangement
- repeat downward

The page should feel curated and spatial, but each row still reads as one discrete event unit. The user must never need to guess the reading order.

### 4.2 Event Unit Composition

Each event unit contains two coordinated areas:

- a primary planet visual
- an attached information block

The whole unit is clickable.

### 4.3 Event Information

Each event unit shows:

- memory date
- light system category
- title
- 1 to 3 lines of body preview
- `last edited by`
- optionally `last edited at` if available in the presenter

The text block remains outside the planet visual. Text does not go inside the planet itself.

### 4.4 Planet Visual Rules

Each event is represented by a single distinct planet visual.

Rules:

- the planet must be clearly legible as a clickable object
- variations may come from color, glow, banding, or surface texture
- variations should feel curated, not procedurally noisy
- the visual should support the content, not dominate it

The first implementation may use a small, fixed set of visual variants selected deterministically from event data.

## 5. Event Detail Modal

### 5.1 Interaction Model

Clicking an event opens a centered modal dialog.

The page behind the modal stays visible but dimmed. The user remains in the `Planet` page context throughout the interaction.

No route transition is required for the first version.

### 5.2 Modal Content Structure

The modal includes:

- event date
- event category
- close control
- enlarged planet visual
- title
- full body text
- optional location
- `last edited by`
- optional `last edited at`

The modal does not show:

- `createdAt`
- `updatedAt`

### 5.3 Default Mode

The modal opens in read mode.

The primary purpose of the first view is to read the memory. Editing is a secondary action from inside the modal rather than the default state.

### 5.4 Modal Actions

The modal provides:

- `Edit`
- `Delete`
- `Close`

Version history and restore actions are intentionally omitted from this release.

## 6. Create, Edit, and Delete Flows

### 6.1 Create Event

Clicking `New Event` opens a centered modal using the same visual language as the event detail modal, but in create mode.

Fields:

- `title`
- `memoryDate`
- `eventType`
- `locationText` optional
- `body`

The editor is plain text only.

Actions:

- `Save`
- `Cancel`

### 6.2 Edit Event

From the event detail modal, clicking `Edit` switches the current modal into edit mode.

There is no second nested modal.

On successful save:

- the event data updates
- the modal returns to read mode
- the list reflects the updated event state

### 6.3 Delete Event

Delete is only available from the event detail modal.

Delete must require a lightweight confirmation step before completion.

On successful delete:

- the modal closes
- the event disappears from the page list

## 7. States

### 7.1 Empty State

If no events exist, the page shows a dedicated `empty orbital archive` state.

It includes:

- module header
- a large, quiet cosmic empty visual
- short explanatory copy
- a clear `New Event` call to action

The empty state should feel like unused memory space, not a generic dashboard blank state.

### 7.2 Loading State

While the event list is loading:

- show several skeleton orbital units

While modal content is loading:

- show a stable modal skeleton

Avoid flashy shimmer-heavy loading treatments.

### 7.3 Error State

If list loading fails:

- render an inline module-level error state inside the page body

If modal actions fail:

- show the error inside the modal
- preserve current context
- do not redirect to a global error page

## 8. Data and Presentation Boundaries

The page should be implemented through a presenter/view-model boundary rather than embedding raw server data directly in page components.

Recommended first-version page view model shape:

- module header data
- ordered array of event preview items
- modal event detail shape
- modal form defaults
- empty-state content
- loading/error state labels

The first implementation may start with mock-backed or presenter-backed data, provided the component boundaries match the eventual real service integration.

## 9. Accessibility and Interaction Requirements

The event detail dialog and create/edit dialog behavior must follow normal modal expectations:

- keyboard focus moves into the modal on open
- keyboard focus returns to the previously triggered event unit or button on close
- escape closes the modal when no destructive confirmation is active
- background content is not interactable while modal is open

Clickable event units must preserve keyboard accessibility and visible focus indication.

## 10. Implementation Boundaries

This first `Planet` implementation is complete when all of the following exist:

- real `Planet` module header
- orbital event list layout
- planet-style event units
- centered event detail modal
- create event modal
- in-modal edit flow
- delete confirmation
- empty/loading/error states

This first implementation is not required to include:

- version history
- restore
- search
- photo linkage
- rich text editing
- advanced filtering
