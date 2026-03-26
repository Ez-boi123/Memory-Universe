# Memory Universe PRD

## 1. Document Purpose

This document translates the product decisions in [SPEC.md](/Users/tanlidou/Desktop/Memory%20Universe/SPEC.md) into implementation-oriented product requirements for MVP.

It focuses on:

- user value
- product scope
- page/module behavior
- key interaction rules
- acceptance criteria

## 2. Product Summary

`Memory Universe` is a private PC web product for two people to co-maintain a shared memory space.

It is built around one relationship space and four core modules:

- `Memory Universe`: shared home and entry
- `Memory Planet`: collaborative memory events
- `Memory Milky Way`: photo timeline and pending archive flow
- `Memory Constellation`: lightweight message wall

The MVP is intentionally restrained:

- PC web only
- one relationship space per user
- two-person private shared space
- no realtime collaboration
- no recycle bin
- no annual recap features in first release

## 3. Product Goals

### 3.1 Primary Goals

- Enable two users to build a private shared memory space
- Lower the cost of recording memories without turning the product into a social feed
- Make photos and events easy to revisit over time
- Keep the emotional tone warm, calm, and archival

### 3.2 Success Signals

The MVP should help users complete these loops:

- register and successfully bind a relationship space
- create at least one event
- upload and archive photos into timeline
- leave lightweight messages
- revisit previously recorded content without friction

## 4. Target Users

### 4.1 Primary Users

Two people in a close relationship who want a shared place to preserve memories.

MVP assumes:

- a one-to-one relationship space
- emotionally motivated usage rather than public sharing
- PC web browsing and editing as primary use case

### 4.2 User Motivations

- “We want a place that belongs to us.”
- “We want to keep shared memories organized.”
- “We want something more personal than generic chat history.”
- “We want a calm place to revisit moments.”

## 5. Product Principles

- Private by default
- Shared inside the relationship space
- Calm instead of attention-seeking
- Structured enough to revisit, but not heavy to use
- Emotional at the surface, disciplined underneath

## 6. MVP Scope

### 6.1 In Scope

- user registration and login
- forgot password / reset password
- one relationship space per user
- invite link / invite code relationship binding
- relationship homepage
- memory event CRUD
- collaborative event editing
- event version history and restore
- photo upload
- pending archive flow
- user-confirmed memory date
- vertical photo timeline
- photo-event relation
- daily message board
- basic search

### 6.2 Out Of Scope

- mobile-first optimization
- multiple relationship spaces
- public profiles
- public feeds
- realtime collaborative editing
- recycle bin
- custom user-defined tags
- AI organization
- anniversary and annual recap pages
- advanced analytics or engagement loops

## 7. Core Product Rules

### 7.1 Relationship Rules

- A user can belong to only one relationship space in MVP
- Relationship binding is established via invite link or invite code
- The active relationship space is the main product context

### 7.2 Visibility Rules

- All content created in the relationship space is visible to both members
- There is no private-within-shared content in MVP
- No draft mode that is only visible to the author

### 7.3 Ownership Rules

- Events, photos, and messages each have a creator/uploader
- Ownership metadata is retained even though content is shared inside the space

### 7.4 Relationship Unbind Rules

- When the relationship is unbound, the space is preserved
- The space becomes frozen
- Existing content remains viewable
- New collaborative editing is disabled

### 7.5 Delete Rules

- Delete is immediate from the user’s perspective
- Destructive actions require confirmation
- Event version history is retained
- Deleted photos and messages are not recoverable in MVP

## 8. User Stories

### 8.1 Account And Access

- As a new user, I want to create an account so I can enter the product
- As a returning user, I want to log in securely with email and password
- As a user, I want to reset my password if I forget it

### 8.2 Relationship Setup

- As a user, I want to create a relationship space so I can start building our shared universe
- As a user, I want to invite the other person by link or code so they can join the same space
- As an invited user, I want to accept an invite and enter the shared space

### 8.3 Memory Planet

- As a user, I want to create a memory event with title, text, and date
- As a member, I want to edit shared events together
- As a member, I want to see who edited an event last
- As a member, I want to restore an earlier version if an event was overwritten

### 8.4 Memory Milky Way

- As a user, I want to upload photos quickly without filling everything immediately
- As a user, I want uploaded photos to go into a pending archive area
- As a user, I want to confirm the memory date later
- As a member, I want archived photos to appear in a vertical timeline
- As a member, I want to optionally attach a photo to an event

### 8.5 Memory Constellation

- As a user, I want to leave a short message for the other person
- As a member, I want the newest messages to appear first

### 8.6 Search

- As a member, I want to search memory events and messages by keyword
- As a member, I want to narrow by date range when needed

## 9. Functional Requirements

## 9.1 Authentication

### 9.1.1 Registration

Requirements:

- user can register with email and password
- password must be securely stored
- duplicate emails are not allowed

Acceptance criteria:

- registration succeeds with valid email and password
- invalid input returns clear error message
- newly registered user can enter the product

### 9.1.2 Login

Requirements:

- user can log in with email and password
- authenticated session persists across protected routes

Acceptance criteria:

- valid credentials allow login
- invalid credentials show clear failure state
- unauthorized access redirects to sign-in

### 9.1.3 Forgot Password

Requirements:

- user can request password reset
- user can set a new password through secure reset flow

Acceptance criteria:

- valid reset request issues reset token
- expired or invalid token cannot reset password
- successful reset enables new login

## 9.2 Relationship Binding

### 9.2.1 Create Relationship Space

Requirements:

- logged-in user can create one relationship space if none exists
- relationship is initialized in pending state until second member joins

Acceptance criteria:

- user can create relationship successfully
- system prevents creating a second space in MVP

### 9.2.2 Invite Flow

Requirements:

- creator can generate invite link or invite code
- invite can be accepted by another registered or newly registered user

Acceptance criteria:

- accepted invite activates relationship
- invalid or expired invite is rejected gracefully

## 9.3 Memory Universe Home

### 9.3.1 Purpose

Serve as the shared home and fastest path into all modules.

### 9.3.2 Requirements

- display relationship identity/header
- provide quick navigation to Planet, Milky Way, and Constellation
- show recent highlights or recent activity summary
- maintain emotional hero feeling on first screen, then transition into functional layout

Acceptance criteria:

- user can understand current relationship context immediately
- user can reach every primary module within one click

## 9.4 Memory Planet

### 9.4.1 Event Creation

Requirements:

- create event with:
  - title
  - plain text body
  - memory date
  - optional location
  - optional system category

Acceptance criteria:

- event appears in event list after save
- required fields are validated

### 9.4.2 Event Editing

Requirements:

- both members can edit the same event
- system uses non-realtime editing
- save result follows last-write-wins behavior
- interface shows last edited user and time

Acceptance criteria:

- edits persist correctly
- latest saved version becomes current version
- metadata is visible on detail page

### 9.4.3 Event History

Requirements:

- each save creates a version snapshot
- user can open version history
- user can restore an older version

Acceptance criteria:

- version list shows edit time and editor
- restored version becomes current event content

### 9.4.4 Event Delete

Requirements:

- delete action requires confirmation
- deleted event no longer appears in active lists

Acceptance criteria:

- confirmation prevents accidental one-click delete
- deleted event cannot be opened from main list

## 9.5 Memory Milky Way

### 9.5.1 Photo Upload

Requirements:

- global upload entry is visible in main app shell
- user can upload one or multiple photos
- system stores original file and generated display assets

Acceptance criteria:

- uploaded files complete successfully
- uploaded photos appear in pending archive area

### 9.5.2 Pending Archive

Requirements:

- uploaded photos are first placed in pending archive
- user can confirm memory date later
- user can optionally link photo to event

Acceptance criteria:

- pending photos are visually separated from archived timeline
- photo cannot enter timeline until archive info is completed

### 9.5.3 Timeline

Requirements:

- timeline is vertical
- photos are ordered by user-confirmed memory date
- photos can exist without attached events

Acceptance criteria:

- archived photos appear in date order
- photo detail view exposes relation to event if linked

## 9.6 Memory Constellation

### 9.6.1 Message Posting

Requirements:

- members can post short messages
- message board is independent from event comments
- newest messages appear first

Acceptance criteria:

- submitted message appears at top of list
- author and created time are visible

## 9.7 Search

### 9.7.1 Basic Search

Requirements:

- search event title
- search event body
- search message content
- filter by date range

Acceptance criteria:

- keyword returns matching events and/or messages
- date range limits visible result set

## 10. Page Requirements

### 10.1 Public Pages

- landing / entry page
- sign up
- sign in
- forgot password
- reset password
- invite accept page

### 10.2 App Pages

- universe home
- event list page
- event detail / edit page
- photo timeline page
- pending archive page
- message board page
- search page
- relationship settings page
- account settings page

## 11. Interaction And UX Requirements

### 11.1 Tone

- calm
- intimate
- premium
- not playful in a childish way

### 11.2 Visual Hierarchy

- homepage first screen may be dreamy and atmospheric
- content pages must rapidly become quieter and more readable
- avoid excessive effects in event and timeline pages

### 11.3 Empty State Requirements

Need tailored empty states for:

- no relationship yet
- no events yet
- no archived photos yet
- no pending photos
- no messages yet

Empty states should:

- feel warm
- feel intentional
- gently invite first action
- avoid pressure-heavy productivity language

### 11.4 Destructive Action UX

- all delete actions require confirmation
- copy should clearly explain irreversibility where applicable
- event history should be presented as safety for edits, not as a recycle bin substitute

## 12. Notification Requirements

MVP notifications should remain minimal.

In scope:

- invite accepted
- new message
- event updated
- security-related account events

Out of scope:

- habit nudges
- “you have not posted recently”
- archive nagging
- growth-oriented engagement loops

## 13. Non-Functional Requirements

- desktop-first usability
- good readability for long-form memory text
- stable image loading performance
- secure authentication
- clear error states
- production-safe handling of uploaded media

## 14. Risks And Constraints

### 14.1 Shared Editing Overwrite

Risk:

- users may overwrite each other’s edits

Mitigation:

- visible edit metadata
- event version history

### 14.2 Archive Friction

Risk:

- requiring user-confirmed memory date may slow photo organization

Mitigation:

- split upload from archive step
- make pending archive a distinct, calm, manageable area

### 14.3 Delete Regret

Risk:

- photo/message deletion is irreversible in MVP

Mitigation:

- strong confirmation wording
- avoid easy accidental click paths

## 15. Release Prioritization

### 15.1 MVP Release Order

1. account system
2. relationship creation and invite flow
3. universe shell and app layout
4. memory event CRUD and history
5. photo upload and archive flow
6. message board
7. search
8. visual polish

## 16. Open Post-MVP Opportunities

- multiple relationship spaces
- annual recap
- star-map retrospective view
- stronger archive assistance
- editing presence hint
- finer filtering and classification

