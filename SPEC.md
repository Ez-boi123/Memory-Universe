# Memory Universe SPEC

## 1. Project Overview

### 1.1 Product Positioning

`Memory Universe` is a private relationship-centered memory website for recording and revisiting shared memories between two people.

The product is not a public social network. It is a private, emotional, archive-like web experience centered on one shared relationship space.

### 1.2 Product Goal

Help two connected users:

- co-own a private memory space
- record memory events in a collaborative way
- archive uploaded photos along a meaningful timeline
- leave lightweight daily messages for each other
- preserve memories even after the relationship is unbound

### 1.3 MVP Scope

MVP focuses on:

- PC web only
- one relationship space per user
- one-to-one private relationship space
- four core modules:
  - `Memory Universe`: overall relationship space
  - `Memory Planet`: memory events
  - `Memory Milky Way`: photo timeline
  - `Memory Constellation`: message board

Not included in MVP:

- mobile-first experience
- multi-space relationships
- realtime collaborative editing
- rich text editor
- advanced recommendation/operation system
- annual recap / anniversary recap features
- public social graph

## 2. Core Product Decisions

### 2.1 Relationship Model

- Product model: `private shared universe`
- Each relationship is a semi-closed private space
- All content inside the space is visible to both members by default
- A user can own only one relationship space in MVP
- Relationship binding uses `invite link / invite code`

### 2.2 Relationship Lifecycle

When a relationship is unbound:

- the shared space is preserved
- the space enters a `frozen` state
- previous memories remain viewable
- no further collaborative editing is allowed
- data is not automatically split or deleted

### 2.3 Content Ownership

For all event, photo, and message content:

- ownership belongs to the creator/uploader
- content is displayed inside the shared relationship space
- ownership is clear for traceability and future export logic

### 2.4 Shared Editing Policy

For `Memory Planet` events:

- members can collaboratively edit title, body, date, and location
- conflict policy: `last write wins`
- event version history must be preserved
- first version of MVP is `non-realtime collaboration`

### 2.5 Privacy Policy

Inside a relationship space:

- no intra-space privacy layers in MVP
- no private draft visible only to self
- once content is created in the space, it is shared with both members

### 2.6 Delete Policy

- delete behavior is `immediate delete + confirmation`
- no recycle bin in MVP
- version history exists only for memory events
- photos and messages do not support post-delete recovery in MVP

## 3. Brand And Experience Direction

### 3.1 Experience Tone

Core tone:

- quiet
- intimate
- restrained
- archival
- emotional but not overly theatrical

### 3.2 Visual Direction

Primary direction:

- `quiet cosmic archive`

Secondary accent:

- homepage first screen may contain a subtle dreamy, starry atmosphere
- once users enter product content, the interface quickly becomes calmer and more structured

### 3.3 Design Principles

- make memory the protagonist, not visual effects
- dreaminess belongs to entry points and highlights, not every page
- avoid over-decoration that harms readability
- prioritize typography, spacing, light, layering, and atmosphere
- maintain a premium desktop web reading experience

## 4. Platform And Delivery

### 4.1 Supported Platform

- MVP platform: `PC Web`
- responsive support is allowed, but not the primary design target

### 4.2 Homepage Strategy

- homepage is the product entry
- logged-in users land directly into product context
- logged-out users see a lightweight branded entrance, not a long marketing site

## 5. Information Architecture

## 5.1 Top-Level Modules

1. `Universe`
Relationship-level home / overview

2. `Planet`
Memory event records

3. `Milky Way`
Photo timeline and pending archive flow

4. `Constellation`
Daily message board

### 5.2 Proposed Global Navigation

Desktop primary navigation:

- Universe
- Planet
- Milky Way
- Constellation
- Search
- Upload Memory
- Account / Relationship Settings

## 6. Module Specifications

### 6.1 Memory Universe

Role:

- the shared relationship space homepage
- the emotional and navigational center of the product

Homepage first-screen priority:

- dreamy hero mood for first impression
- then quickly transition into practical product navigation

Homepage content priority:

- relationship visual header
- quick entry cards to Planet / Milky Way / Constellation
- recent highlights or latest memory snippets

MVP homepage should emphasize:

- emotional identity of the space
- fast access to core modules

MVP homepage should not yet include:

- annual recap
- anniversary engines
- algorithmic recommendation flows

### 6.2 Memory Planet

Role:

- structured memory event recording module

Event fields in MVP:

- `id`
- `relationshipId`
- `title`
- `body` (plain text)
- `memoryDate`
- `locationText` (optional)
- `eventType` (system-defined light category)
- `createdBy`
- `updatedBy`
- `createdAt`
- `updatedAt`
- `deletedAt` (logical or hard-delete strategy can be decided in implementation, but user-facing behavior is immediate delete)

Editing model:

- both members can edit the same event
- not realtime
- last save wins
- preserve version history

Version history requirements:

- each save creates a version snapshot
- user can inspect edit history
- user can restore an older version
- UI should clearly show `last edited by` and `last edited at`

Editor scope:

- plain text only
- no rich text toolbar in MVP
- structured metadata lives outside body text

Event categorization:

- no custom tag system in MVP
- only light system categories such as:
  - anniversary
  - travel
  - daily
  - festival

Event-photo relation:

- events and photos are independent entities
- an event may have zero or more related photos
- a photo may exist without being attached to an event

### 6.3 Memory Milky Way

Role:

- photo archive timeline
- not just a gallery, but a memory-time organization layer

Timeline strategy:

- main experience is `vertical timeline`
- home highlights and annual recap may use star-map visualizations later

Photo time policy:

- timeline order is based on `user-confirmed memory time`
- not purely EXIF time
- not purely upload time

Upload flow:

- users upload photos first
- photos go into a `pending archive` area
- users later confirm memory time and optional metadata

MVP photo states:

- pending archive
- archived
- linked to event (optional relation, not required)

Photo metadata in MVP:

- `id`
- `relationshipId`
- `uploadedBy`
- `originalUrl`
- `thumbnailUrl`
- `displayUrl`
- `memoryDate` (nullable before archive)
- `capturedAt` (optional extracted metadata)
- `uploadedAt`
- `archiveStatus`
- `relatedEventId` (nullable)

Upload entry:

- one clear global upload entry in desktop web
- upload action should direct users into the pending archive flow

Image handling:

- store original image
- generate compressed display size
- generate thumbnail
- support lazy loading

### 6.4 Memory Constellation

Role:

- lightweight daily message wall between relationship members
- not an event comment replacement

Target message types:

- greetings
- lightweight affection
- short daily notes
- immediate emotional expression

Sorting:

- newest first

Message fields in MVP:

- `id`
- `relationshipId`
- `authorId`
- `content`
- `createdAt`
- `updatedAt`

Message constraints:

- simple lightweight text
- no anonymous mode
- no task/reminder hybrid behavior
- no rich reaction system in MVP

## 7. Search And Discovery

### 7.1 Search Scope

MVP supports basic search across:

- event title
- event body
- message content
- date range

### 7.2 Search Out Of Scope

Not included in MVP:

- advanced faceted search
- custom tag search
- AI semantic retrieval
- anniversary / yearly revisit engine

## 8. User Flows

### 8.1 Registration And Login

Auth strategy:

- account + password
- forgot password included in MVP
- no magic link as primary login path

Recommended screens:

- sign up
- sign in
- forgot password
- reset password

### 8.2 Relationship Binding

Flow:

1. user signs up and enters product
2. user creates a relationship space
3. system generates invite link or invite code
4. second user accepts invite
5. relationship space becomes active

### 8.3 Create Memory Event

Flow:

1. user enters `Memory Planet`
2. user creates event
3. fills title, body, date, optional location and type
4. saves event
5. both members can later edit
6. version snapshots are stored on each save

### 8.4 Upload Photos

Flow:

1. user clicks global `Upload Memory`
2. uploads one or more photos
3. system stores original and generated sizes
4. photos enter `pending archive`
5. user later confirms memory date
6. user optionally links photos to an event
7. archived photos appear in `Memory Milky Way`

### 8.5 Leave Message

Flow:

1. user enters `Memory Constellation`
2. writes a short message
3. message appears at top of wall

## 9. Notifications Strategy

Notification tone:

- restrained
- low-pressure
- no aggressive engagement loops

MVP should only notify for important events such as:

- invitation accepted
- new message
- shared event updated
- important account/security actions

Not included in MVP:

- “you haven’t recorded memories recently”
- aggressive archive reminders
- behavioral growth nudges

## 10. Empty States And UX Risks

### 10.1 Empty States

Because this is a memory product, empty states must feel warm but not childish.

Key empty states:

- no relationship bound yet
- no memory events yet
- no archived photos yet
- no messages yet
- pending archive is empty

Design guideline:

- communicate calm invitation, not productivity pressure
- use restrained cosmic metaphors
- avoid noisy illustrations and cliché “start now” patterns

### 10.2 Key UX Risks

1. Collaborative overwrite risk
Because event editing is shared and non-realtime, users may overwrite each other’s text.

Mitigation:

- visible last-edited metadata
- version history and restore
- optional editing presence hint in later phase

2. Photo archive friction
User-confirmed memory time is meaningful but increases friction.

Mitigation:

- introduce clear pending archive area
- keep upload fast
- separate upload from later organization

3. Emotional mismatch
Overly dreamy interface could become tiring during real use.

Mitigation:

- dreamy homepage hero only
- content pages become cleaner and calmer

4. Destructive delete regret
Immediate delete can be risky.

Mitigation:

- clear confirmation modal
- careful destructive-action wording
- event history only softens part of this risk

## 11. Technical Architecture

### 11.1 Frontend

- `Next.js`
- `React`
- TypeScript

Reasons:

- app and marketing entry can stay in one framework
- server rendering and routing are mature
- auth and image tooling integrate well
- good deployment fit for Vercel

### 11.2 Backend

Backend should stay as close as possible to the Next.js stack:

- Next.js Route Handlers / Server Actions where appropriate
- shared TypeScript types between frontend and backend
- avoid premature split into separate backend service in MVP

### 11.3 Database

- PostgreSQL
- Prisma ORM

Reasons:

- relationship-centered data is strongly relational
- version history and linkage are clearer in relational schema
- future querying needs are easier than document-first solutions

### 11.4 Storage

- object storage for photo assets

Stored assets:

- original image
- display size image
- thumbnail image

### 11.5 Authentication

- Auth.js / NextAuth
- Credentials provider
- password hashing
- session-based auth

MVP auth features:

- sign up
- sign in
- forgot password
- reset password
- protected routes

### 11.6 Collaboration Strategy

- no realtime text collaboration in MVP
- no CRDT / websocket stack in MVP
- persistence is request-response based
- conflict resolution is `last write wins`

### 11.7 Deployment

- Vercel for web app
- managed PostgreSQL and object storage

## 12. Suggested Data Model

### 12.1 User

- `id`
- `email`
- `passwordHash`
- `displayName`
- `avatarUrl`
- `createdAt`
- `updatedAt`

### 12.2 Relationship

- `id`
- `status` (`pending`, `active`, `frozen`)
- `createdBy`
- `createdAt`
- `updatedAt`

### 12.3 RelationshipMember

- `id`
- `relationshipId`
- `userId`
- `role`
- `joinedAt`

### 12.4 Invite

- `id`
- `relationshipId`
- `token`
- `code`
- `createdBy`
- `expiresAt`
- `acceptedBy`
- `acceptedAt`
- `status`

### 12.5 MemoryEvent

- `id`
- `relationshipId`
- `title`
- `body`
- `memoryDate`
- `locationText`
- `eventType`
- `createdBy`
- `updatedBy`
- `createdAt`
- `updatedAt`

### 12.6 MemoryEventVersion

- `id`
- `eventId`
- `title`
- `body`
- `memoryDate`
- `locationText`
- `eventType`
- `editedBy`
- `versionCreatedAt`

### 12.7 Photo

- `id`
- `relationshipId`
- `uploadedBy`
- `originalUrl`
- `displayUrl`
- `thumbnailUrl`
- `memoryDate`
- `capturedAt`
- `uploadedAt`
- `archiveStatus`

### 12.8 EventPhoto

- `id`
- `eventId`
- `photoId`

### 12.9 Message

- `id`
- `relationshipId`
- `authorId`
- `content`
- `createdAt`
- `updatedAt`

## 13. Page-Level Scope

### 13.1 Public / Auth Pages

- landing / entry page
- sign in
- sign up
- forgot password
- reset password
- accept invite

### 13.2 App Pages

- universe home
- planet list
- planet detail / editor
- milky way timeline
- pending archive page
- constellation message board
- search results
- relationship settings
- account settings

## 14. MVP Functional Checklist

### 14.1 Must Have

- user registration and login
- forgot password
- create one relationship space
- invite second member by link/code
- one active shared space per user
- create/edit/delete events
- event version history and restore
- upload photos
- pending archive flow
- confirm memory date for photos
- vertical photo timeline
- relate photos to events
- post messages on message board
- basic search

### 14.2 Should Have

- calm empty states
- clear destructive confirmations
- visible last edited metadata
- lightweight relationship homepage
- desktop-optimized navigation

### 14.3 Not In MVP

- mobile-first productization
- multiple relationship spaces per user
- realtime collaboration
- recycle bin
- custom user tags
- annual recap
- anniversary system
- advanced filters
- AI features

## 15. Post-MVP Expansion Directions

- multiple relationship spaces per user
- partial personal draft flow
- editing presence indicator
- better photo archive assistance
- yearly recap / anniversary pages
- star-map visualized retrospectives
- richer reactions and message pinning
- finer event categorization
- better search filters

## 16. Implementation Priorities

Recommended build order:

1. auth and user system
2. relationship creation and invite flow
3. universe home shell and app layout
4. memory event CRUD + version history
5. photo upload + pending archive + timeline
6. message board
7. search
8. visual polish and homepage atmosphere

## 17. Final Product Summary

`Memory Universe` should feel like a private cosmos built for two people: emotionally warm at the entrance, calm and archival in daily use, structurally simple in MVP, and technically grounded enough to expand later without rewriting the foundations.
