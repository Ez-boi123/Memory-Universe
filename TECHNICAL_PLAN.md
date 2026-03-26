# Memory Universe Technical Plan

## 1. Document Purpose

This document defines the MVP technical implementation strategy for `Memory Universe`.

It is based on:

- [SPEC.md](/Users/tanlidou/Desktop/Memory%20Universe/SPEC.md)
- [PRD.md](/Users/tanlidou/Desktop/Memory%20Universe/PRD.md)

It focuses on:

- architecture decisions
- data model direction
- service boundaries
- storage and auth strategy
- delivery phases

## 2. Technical Goals

- keep frontend and backend in one coherent Next.js codebase
- support secure account/password authentication
- model relationship-centered shared content clearly
- support reliable photo upload and archive flow
- support collaborative event editing without realtime complexity
- preserve room for future expansion without rebuilding core schema

## 3. Recommended Stack

### 3.1 Application

- Next.js
- React
- TypeScript

Recommended app structure:

- App Router
- server-rendered page shells where useful
- server actions and route handlers for mutations depending on ergonomics

### 3.2 Database

- PostgreSQL
- Prisma ORM

### 3.3 Authentication

- Auth.js / NextAuth
- Credentials provider
- secure password hashing
- database-backed session strategy

### 3.4 Media Storage

- object storage for photo files

Stored variants:

- original
- display
- thumbnail

### 3.5 Deployment

- Vercel for web application
- managed PostgreSQL
- managed object storage

## 4. High-Level Architecture

## 4.1 System Shape

Single web application with:

- Next.js frontend
- server-side application layer in the same repo
- PostgreSQL relational database
- object storage for media

## 4.2 Architecture Principles

- avoid premature microservices
- keep domain logic in app-layer modules, not inside pages
- separate persistence concerns from UI concerns
- keep auth, permissions, and relationship checks centralized

## 5. Suggested Repository Structure

```text
src/
  app/
    (public)/
    (auth)/
    (app)/
    api/
  components/
    ui/
    universe/
    planet/
    milky-way/
    constellation/
  lib/
    auth/
    db/
    storage/
    permissions/
    validation/
    utils/
  server/
    services/
    repositories/
    presenters/
  types/
  styles/
prisma/
  schema.prisma
```

## 6. Core Domain Model

## 6.1 Main Entities

- `User`
- `Relationship`
- `RelationshipMember`
- `Invite`
- `MemoryEvent`
- `MemoryEventVersion`
- `Photo`
- `EventPhoto`
- `Message`

## 6.2 Domain Rules

### 6.2.1 User

- unique account identity
- authenticated via email + password

### 6.2.2 Relationship

- one shared space for two members in MVP
- status:
  - `pending`
  - `active`
  - `frozen`

### 6.2.3 RelationshipMember

- associates user to relationship
- enables future role expansion without changing relationship table semantics

### 6.2.4 Invite

- supports invite link or invite code acceptance
- should support expiration and one-time acceptance

### 6.2.5 MemoryEvent

- shared event entity editable by both members
- current canonical version stored on event table
- version snapshots stored separately

### 6.2.6 MemoryEventVersion

- immutable snapshot of event content at save time
- supports restore behavior

### 6.2.7 Photo

- asset metadata record
- separate from event entity
- may exist before being fully archived

### 6.2.8 EventPhoto

- join table between events and photos
- keeps relation flexible for future many-to-many evolution

### 6.2.9 Message

- lightweight standalone message on relationship wall

## 7. Suggested Prisma Schema Direction

This is not final code, but the implementation should roughly follow these structures.

### 7.1 User

Core columns:

- `id`
- `email`
- `passwordHash`
- `displayName`
- `avatarUrl`
- `createdAt`
- `updatedAt`

Constraints:

- unique email

### 7.2 Relationship

Core columns:

- `id`
- `status`
- `createdBy`
- `createdAt`
- `updatedAt`

Constraints:

- status enum

### 7.3 RelationshipMember

Core columns:

- `id`
- `relationshipId`
- `userId`
- `role`
- `joinedAt`

Constraints:

- unique `(relationshipId, userId)`
- in MVP, business logic enforces max two members

### 7.4 Invite

Core columns:

- `id`
- `relationshipId`
- `token`
- `code`
- `status`
- `createdBy`
- `expiresAt`
- `acceptedBy`
- `acceptedAt`
- `createdAt`

Constraints:

- unique token
- unique code if code flow is enabled

### 7.5 MemoryEvent

Core columns:

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

Indexes:

- `(relationshipId, memoryDate desc)`
- full-text-oriented index strategy can be added later depending on search implementation

### 7.6 MemoryEventVersion

Core columns:

- `id`
- `eventId`
- `title`
- `body`
- `memoryDate`
- `locationText`
- `eventType`
- `editedBy`
- `versionCreatedAt`

Indexes:

- `(eventId, versionCreatedAt desc)`

### 7.7 Photo

Core columns:

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
- `createdAt`
- `updatedAt`

Indexes:

- `(relationshipId, memoryDate desc)`
- `(relationshipId, archiveStatus)`

### 7.8 EventPhoto

Core columns:

- `id`
- `eventId`
- `photoId`

Constraints:

- unique `(eventId, photoId)`

### 7.9 Message

Core columns:

- `id`
- `relationshipId`
- `authorId`
- `content`
- `createdAt`
- `updatedAt`

Indexes:

- `(relationshipId, createdAt desc)`

## 8. Authentication Design

## 8.1 Auth Flow

Recommended flow:

1. user registers with email/password
2. password is hashed before persistence
3. Auth.js issues authenticated session
4. protected app routes require active session

## 8.2 Password Handling

Requirements:

- use a secure one-way hashing algorithm supported by current ecosystem best practice
- never store plaintext password
- validate password strength on registration

## 8.3 Session Strategy

Recommended:

- database-backed sessions for stronger control and revocation

## 8.4 Password Reset

Needs:

- reset token table or equivalent secure token mechanism
- expiration window
- single-use enforcement

## 9. Authorization And Permission Model

## 9.1 Core Checks

Every relationship-scoped mutation should verify:

- user is authenticated
- user belongs to target relationship
- relationship status allows operation

## 9.2 Frozen Relationship Rules

When relationship status is `frozen`:

- read access remains
- write access to shared content is blocked
- settings may expose informational frozen state

## 9.3 Ownership Semantics

Ownership is stored for traceability, but shared visibility remains relationship-wide.

This means:

- do not overuse ownership for permission denial in MVP
- use relationship membership as the main access gate

## 10. Service Layer Design

Recommended service modules:

- `auth-service`
- `relationship-service`
- `invite-service`
- `event-service`
- `event-version-service`
- `photo-service`
- `archive-service`
- `message-service`
- `search-service`

Recommended repository separation:

- one repository per major entity or bounded domain
- services orchestrate permission checks and multi-entity transactions

## 11. API And Mutation Strategy

## 11.1 General Guidance

Use a hybrid of:

- server actions for close-to-UI mutations
- route handlers for upload flows, auth-adjacent integrations, and endpoints needing explicit HTTP contracts

## 11.2 Suggested Capability Endpoints

### 11.2.1 Auth

- register
- sign in
- forgot password
- reset password

### 11.2.2 Relationship

- create relationship
- generate invite
- accept invite
- get current relationship summary

### 11.2.3 Events

- create event
- update event
- delete event
- list events
- get event detail
- list versions
- restore version

### 11.2.4 Photos

- upload photo
- list pending archive photos
- archive photo metadata
- list timeline photos
- attach photo to event
- detach photo from event

### 11.2.5 Messages

- create message
- list messages
- delete message if needed in MVP scope

### 11.2.6 Search

- search events and messages

## 12. Photo Upload Pipeline

## 12.1 Flow

1. user uploads image from web UI
2. application validates file type and size
3. application stores original file in object storage
4. application generates display and thumbnail variants
5. photo record is created with `pending archive` state
6. user later confirms memory date and optional event relation
7. photo becomes timeline-visible

## 12.2 Technical Considerations

- validate mime type and extension
- establish upload size limits
- normalize filenames/keys
- store metadata needed for rendering and cleanup
- fail safely if derivative generation fails

## 12.3 Storage Layout Suggestion

Example object key pattern:

```text
relationships/{relationshipId}/photos/{photoId}/original
relationships/{relationshipId}/photos/{photoId}/display
relationships/{relationshipId}/photos/{photoId}/thumbnail
```

## 13. Event Versioning Strategy

## 13.1 Save Behavior

On each event save:

1. validate membership and relationship status
2. read current event
3. write new canonical event state
4. append version snapshot

## 13.2 Restore Behavior

When restoring:

1. selected version is loaded
2. its content becomes the new current event state
3. restore itself should create a fresh version entry for audit continuity

## 13.3 Conflict Model

MVP intentionally uses:

- non-realtime editing
- last-write-wins persistence
- version history as corrective mechanism

Potential later enhancement:

- lightweight “someone else edited recently” warning

## 14. Search Implementation Strategy

## 14.1 MVP Search

Search target:

- event title
- event body
- message content
- date range filtering

Recommended initial strategy:

- simple SQL `ILIKE` or PostgreSQL text search depending on implementation speed
- keep relationship scope filtering mandatory

## 14.2 Future Search

Possible later upgrades:

- weighted full-text search
- structured filters
- photo metadata search

## 15. Frontend Architecture Notes

## 15.1 App Shell

Shared authenticated shell should provide:

- global navigation
- current relationship context
- fixed upload entry
- account/settings entry

## 15.2 Page Segmentation

Recommended route groups:

- public
- auth
- app

This keeps:

- layout concerns separated
- middleware/auth rules clearer

## 15.3 State Management

Recommended approach:

- server state fetched through Next.js data layer
- local UI state handled per page/component
- avoid introducing heavy global state library unless clearly needed

## 16. Validation Strategy

Use shared validation schemas for:

- auth input
- relationship creation
- invite acceptance
- event create/update payloads
- archive photo payloads
- message create payloads

Goals:

- avoid duplicated validation logic
- keep server boundary authoritative

## 17. Error Handling Strategy

Principles:

- user-facing errors should be calm and understandable
- permission errors should not leak internal detail
- upload failures should preserve clarity about what succeeded and what failed

Key cases to handle:

- invalid invite
- expired invite
- unauthorized relationship access
- frozen relationship write attempt
- upload processing failure
- version restore failure

## 18. Security Considerations

- secure password hashing
- CSRF-safe auth/session defaults through framework tooling
- route protection on all app routes
- strict relationship membership checks on every scoped query/mutation
- validate uploaded file types and size
- avoid exposing raw storage keys unnecessarily

## 19. Performance Considerations

- generate thumbnails for timeline views
- lazy-load images in timeline
- paginate long lists where needed
- index date-based and relationship-based queries
- avoid loading full event history in default event list views

## 20. Delivery Plan

## 20.1 Phase 1: Foundation

- initialize Next.js app
- set up Prisma and PostgreSQL
- set up Auth.js credentials auth
- create base app shell and route groups

## 20.2 Phase 2: Relationship Domain

- relationship schema
- invite generation and acceptance
- active relationship resolution
- frozen-state handling

## 20.3 Phase 3: Memory Planet

- event CRUD
- event list/detail
- version history
- restore flow

## 20.4 Phase 4: Memory Milky Way

- photo upload
- object storage integration
- derivative generation
- pending archive page
- timeline page
- event-photo linking

## 20.5 Phase 5: Memory Constellation And Search

- message board CRUD
- basic search across events/messages

## 20.6 Phase 6: Polish

- empty states
- delete confirmations
- loading and error states
- visual refinement for homepage and module pages

## 21. Technical Risks

### 21.1 Upload Pipeline Complexity

Risk:

- image processing and storage orchestration can slow early delivery

Mitigation:

- keep first version limited to original + two derived sizes
- avoid overengineering media metadata early

### 21.2 Shared Edit Conflicts

Risk:

- overwrite complaints despite versioning

Mitigation:

- make version history easy to access
- surface last edited metadata clearly

### 21.3 Schema Rigidity

Risk:

- future multiple-relationship support may pressure current schema

Mitigation:

- retain separate relationship/member tables from day one
- avoid embedding relationship assumptions directly into user table

## 22. Recommended Next Deliverables

After this document, the next most useful implementation artifacts are:

1. `schema.prisma` draft
2. route map / app router sitemap
3. wireframe-level page blueprint
4. task breakdown for initial build

