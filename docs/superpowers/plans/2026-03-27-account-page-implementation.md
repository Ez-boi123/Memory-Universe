# Account Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the desktop-only authenticated `Account / Profile` page with an editorial identity header, associated relationship cards, relation code surface, security card, and danger zone, replacing the current account placeholder.

**Architecture:** Follow the existing authenticated app pattern: presenter-owned view models in `src/server/presenters`, typed page models in `src/types`, focused React components in `src/components/universe`, and a thin route in `src/app/(app)/settings/account/page.tsx`. Keep all first-version behavior local to the page: inline edit-state UI for account identity and relationship presentation fields, explicit placeholder actions for unfinished flows, and no deep relationship-management backend.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, Testing Library, existing global CSS in `src/styles/globals.css`

---

## File Map

### New files

- `src/types/account.ts`
  - Account page view-model types for hero, relationship cards, relation code card, security card, and danger zone
- `src/server/presenters/account-presenter.ts`
  - Builds `AccountPageViewModel` from placeholder/session/relationship data
- `src/server/presenters/account-presenter.test.ts`
  - Presenter coverage for normal, empty, and placeholder states
- `src/components/universe/AccountHero.tsx`
  - Identity header with display/edit modes
- `src/components/universe/AccountHero.test.tsx`
  - Tests hero display/edit toggle and field rendering
- `src/components/universe/AccountRelationshipsSection.tsx`
  - Renders relationships section framing plus empty state
- `src/components/universe/AccountRelationshipCard.tsx`
  - Renders one relationship card with inline edit state
- `src/components/universe/RelationCodeCard.tsx`
  - Renders relation code display and copy/bind actions
- `src/components/universe/AccountSecurityCard.tsx`
  - Renders password/security card
- `src/components/universe/AccountDangerZone.tsx`
  - Renders sign out and delete-account placeholder area
- `src/components/universe/AccountPage.tsx`
  - Composes all account page sections into one vertical editorial page

### Modified files

- `src/app/(app)/settings/account/page.tsx`
  - Replace `SettingsPlaceholder` with the new presenter + `AccountPage`
- `src/styles/globals.css`
  - Add desktop-only account page styles aligned with current authenticated shell

---

### Task 1: Define Account View Models

**Files:**
- Create: `src/types/account.ts`
- Test: `src/server/presenters/account-presenter.test.ts`

- [ ] **Step 1: Write the failing presenter test skeleton**

```ts
import { describe, expect, it } from 'vitest';
import { buildAccountPageViewModel } from './account-presenter';

describe('buildAccountPageViewModel', () => {
  it('builds the desktop account page model for a user with relationships', () => {
    const model = buildAccountPageViewModel();

    expect(model.hero.displayName).toBe('Member One');
    expect(model.relationships.items).toHaveLength(2);
    expect(model.relationCode.code).toBe('MU-REL-2048');
    expect(model.security.actionLabel).toBe('Change Password');
    expect(model.dangerZone.signOutLabel).toBe('Sign Out');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/server/presenters/account-presenter.test.ts
```

Expected:

- FAIL because `account-presenter.ts` and `account.ts` do not exist yet

- [ ] **Step 3: Create the account page types**

```ts
export interface AccountHeroViewModel {
  eyebrow: string;
  displayName: string;
  email: string;
  identityLine: string;
  avatarLabel: string;
  summaryLabel: string;
  summaryValue: string;
  relationshipCountLabel: string;
  relationshipCountValue: string;
}

export interface AccountRelationshipCardViewModel {
  id: string;
  title: string;
  memberSummary: string;
  statusLabel: string;
  emotionalNote: string;
  href: string;
  editLabel: string;
  enterLabel: string;
}

export interface AccountRelationshipsSectionViewModel {
  title: string;
  description: string;
  emptyTitle: string;
  emptyBody: string;
  items: AccountRelationshipCardViewModel[];
}

export interface RelationCodeCardViewModel {
  title: string;
  description: string;
  code: string;
  copyLabel: string;
  bindLabel: string;
  bindHint: string;
}

export interface AccountSecurityCardViewModel {
  title: string;
  description: string;
  actionLabel: string;
  helperText: string;
}

export interface AccountDangerZoneViewModel {
  title: string;
  description: string;
  signOutLabel: string;
  deleteLabel: string;
  deleteHint: string;
}

export interface AccountPageViewModel {
  hero: AccountHeroViewModel;
  relationships: AccountRelationshipsSectionViewModel;
  relationCode: RelationCodeCardViewModel;
  security: AccountSecurityCardViewModel;
  dangerZone: AccountDangerZoneViewModel;
}
```

- [ ] **Step 4: Create the minimal presenter to satisfy the first test**

```ts
import type { AccountPageViewModel } from '@/types/account';

export function buildAccountPageViewModel(): AccountPageViewModel {
  return {
    hero: {
      eyebrow: 'Profile',
      displayName: 'Member One',
      email: 'member.one@example.com',
      identityLine: 'A personal archive keeper shaping shared universes with care.',
      avatarLabel: 'MO',
      summaryLabel: 'Account Status',
      summaryValue: 'Active Account',
      relationshipCountLabel: 'Associated Relationships',
      relationshipCountValue: '2 spaces',
    },
    relationships: {
      title: 'Associated Relationships',
      description: 'The shared memory spaces currently tied to this account.',
      emptyTitle: 'No relationships connected yet',
      emptyBody: 'Use your relation code to bind this account to a shared memory universe.',
      items: [
        {
          id: 'relationship-1',
          title: 'J & M Universe',
          memberSummary: 'Member One · Member Two',
          statusLabel: 'Active Universe',
          emotionalNote: 'A shared archive for moments worth returning to slowly.',
          href: '/universe',
          editLabel: 'Edit Relationship',
          enterLabel: 'Enter Universe',
        },
        {
          id: 'relationship-2',
          title: 'Family Memory Orbit',
          memberSummary: 'Member One · Family',
          statusLabel: 'Setup In Progress',
          emotionalNote: 'A space gathering the memories still finding their shape.',
          href: '/universe',
          editLabel: 'Edit Relationship',
          enterLabel: 'Enter Universe',
        },
      ],
    },
    relationCode: {
      title: 'Relation Code',
      description: 'Use this code to bind a relationship to your account.',
      code: 'MU-REL-2048',
      copyLabel: 'Copy Code',
      bindLabel: 'Bind Relationship',
      bindHint: 'Binding flow will be connected in a later implementation step.',
    },
    security: {
      title: 'Security',
      description: 'Password and account protection settings stay here.',
      actionLabel: 'Change Password',
      helperText: 'Password update flow is still a placeholder in this version.',
    },
    dangerZone: {
      title: 'Danger Zone',
      description: 'Sensitive account actions are isolated here.',
      signOutLabel: 'Sign Out',
      deleteLabel: 'Delete Account',
      deleteHint: 'Account deletion remains unavailable in this version.',
    },
  };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
npm test -- src/server/presenters/account-presenter.test.ts
```

Expected:

- PASS for the new presenter test

- [ ] **Step 6: Commit**

```bash
git add src/types/account.ts src/server/presenters/account-presenter.ts src/server/presenters/account-presenter.test.ts
git commit -m "feat: add account page view models"
```

---

### Task 2: Expand Presenter Coverage For Spec States

**Files:**
- Modify: `src/server/presenters/account-presenter.ts`
- Modify: `src/server/presenters/account-presenter.test.ts`

- [ ] **Step 1: Add failing tests for empty and placeholder states**

```ts
it('builds an empty relationships state when no relationships are connected', () => {
  const model = buildAccountPageViewModel({ relationships: [] });

  expect(model.relationships.items).toEqual([]);
  expect(model.relationships.emptyTitle).toContain('No relationships');
});

it('preserves placeholder messaging for bind, security, and delete actions', () => {
  const model = buildAccountPageViewModel();

  expect(model.relationCode.bindHint).toContain('later implementation');
  expect(model.security.helperText).toContain('placeholder');
  expect(model.dangerZone.deleteHint).toContain('unavailable');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/server/presenters/account-presenter.test.ts
```

Expected:

- FAIL because `buildAccountPageViewModel` does not yet accept override input

- [ ] **Step 3: Add simple presenter input support**

```ts
interface BuildAccountPageViewModelArgs {
  relationships?: AccountPageViewModel['relationships']['items'];
}

export function buildAccountPageViewModel(
  args: BuildAccountPageViewModelArgs = {},
): AccountPageViewModel {
  const relationshipItems = args.relationships ?? defaultRelationshipItems;

  return {
    ...baseModel,
    relationships: {
      ...baseModel.relationships,
      items: relationshipItems,
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm test -- src/server/presenters/account-presenter.test.ts
```

Expected:

- PASS with normal and empty state coverage

- [ ] **Step 5: Commit**

```bash
git add src/server/presenters/account-presenter.ts src/server/presenters/account-presenter.test.ts
git commit -m "test: cover account presenter states"
```

---

### Task 3: Build The Account Hero And Relationship Components

**Files:**
- Create: `src/components/universe/AccountHero.tsx`
- Create: `src/components/universe/AccountHero.test.tsx`
- Create: `src/components/universe/AccountRelationshipsSection.tsx`
- Create: `src/components/universe/AccountRelationshipCard.tsx`
- Modify: `src/types/account.ts`

- [ ] **Step 1: Write failing component tests for the hero**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AccountHero } from './AccountHero';

describe('AccountHero', () => {
  it('shows account identity in display mode by default', () => {
    render(
      <AccountHero
        hero={{
          eyebrow: 'Profile',
          displayName: 'Member One',
          email: 'member.one@example.com',
          identityLine: 'Identity line',
          avatarLabel: 'MO',
          summaryLabel: 'Account Status',
          summaryValue: 'Active Account',
          relationshipCountLabel: 'Associated Relationships',
          relationshipCountValue: '2 spaces',
        }}
      />,
    );

    expect(screen.getByText('Member One')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
  });

  it('switches into inline edit mode', async () => {
    const user = userEvent.setup();

    render(<AccountHero hero={heroModel} />);
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));

    expect(screen.getByLabelText('Display Name')).toHaveValue('Member One');
    expect(screen.getByRole('button', { name: 'Save Profile' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/universe/AccountHero.test.tsx
```

Expected:

- FAIL because `AccountHero.tsx` does not exist

- [ ] **Step 3: Implement `AccountHero` with local edit-state only**

```tsx
export function AccountHero({ hero }: AccountHeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    displayName: hero.displayName,
    email: hero.email,
    identityLine: hero.identityLine,
  });

  if (isEditing) {
    return (
      <section className="account-hero" aria-labelledby="account-hero-title">
        <div className="account-hero-copy">
          <p className="universe-kicker">{hero.eyebrow}</p>
          <h1 className="account-hero-title" id="account-hero-title">Edit Profile</h1>
          <label>
            <span>Display Name</span>
            <input value={draft.displayName} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} />
          </label>
          <label>
            <span>Email</span>
            <input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
          </label>
          <label>
            <span>Profile</span>
            <textarea value={draft.identityLine} onChange={(event) => setDraft({ ...draft, identityLine: event.target.value })} />
          </label>
          <div className="account-hero-actions">
            <button type="button">Save Profile</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-hero" aria-labelledby="account-hero-title">
      <div className="account-hero-copy">
        <p className="universe-kicker">{hero.eyebrow}</p>
        <div className="account-avatar">{hero.avatarLabel}</div>
        <h1 className="account-hero-title" id="account-hero-title">{hero.displayName}</h1>
        <p className="account-hero-email">{hero.email}</p>
        <p className="account-hero-description">{hero.identityLine}</p>
        <button type="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
      </div>
      <aside className="account-hero-aside" aria-label="Account summary">
        <p>{hero.summaryLabel}</p>
        <strong>{hero.summaryValue}</strong>
        <p>{hero.relationshipCountLabel}</p>
        <strong>{hero.relationshipCountValue}</strong>
      </aside>
    </section>
  );
}
```

- [ ] **Step 4: Implement relationships section and card with card-local edit state**

```tsx
export function AccountRelationshipsSection({ relationships }: AccountRelationshipsSectionProps) {
  return (
    <section className="account-section" aria-labelledby="account-relationships-title">
      <p className="universe-kicker">Connected Spaces</p>
      <h2 className="account-section-title" id="account-relationships-title">{relationships.title}</h2>
      <p className="account-section-description">{relationships.description}</p>
      {relationships.items.length === 0 ? (
        <div className="account-empty-state">
          <h3>{relationships.emptyTitle}</h3>
          <p>{relationships.emptyBody}</p>
        </div>
      ) : (
        <div className="account-relationship-list">
          {relationships.items.map((item) => (
            <AccountRelationshipCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run:

```bash
npm test -- src/components/universe/AccountHero.test.tsx
```

Expected:

- PASS for hero display/edit behavior

- [ ] **Step 6: Commit**

```bash
git add src/components/universe/AccountHero.tsx src/components/universe/AccountHero.test.tsx src/components/universe/AccountRelationshipsSection.tsx src/components/universe/AccountRelationshipCard.tsx src/types/account.ts
git commit -m "feat: add account hero and relationship components"
```

---

### Task 4: Build Relation Code, Security, Danger Zone, And Page Composition

**Files:**
- Create: `src/components/universe/RelationCodeCard.tsx`
- Create: `src/components/universe/AccountSecurityCard.tsx`
- Create: `src/components/universe/AccountDangerZone.tsx`
- Create: `src/components/universe/AccountPage.tsx`
- Modify: `src/app/(app)/settings/account/page.tsx`

- [ ] **Step 1: Write a failing route-level render test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountPage } from './AccountPage';

describe('AccountPage', () => {
  it('renders the account page sections in the correct order', () => {
    render(<AccountPage model={model} />);

    expect(screen.getByText('Associated Relationships')).toBeInTheDocument();
    expect(screen.getByText('Relation Code')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/universe/AccountPage.test.tsx
```

Expected:

- FAIL because `AccountPage` and related section components do not exist yet

- [ ] **Step 3: Create the remaining section components**

```tsx
export function RelationCodeCard({ relationCode }: RelationCodeCardProps) {
  return (
    <section className="account-section">
      <p className="universe-kicker">Binding</p>
      <h2 className="account-section-title">{relationCode.title}</h2>
      <p className="account-section-description">{relationCode.description}</p>
      <div className="account-code-chip">{relationCode.code}</div>
      <div className="account-inline-actions">
        <button type="button">{relationCode.copyLabel}</button>
        <button type="button">{relationCode.bindLabel}</button>
      </div>
      <p className="account-inline-hint">{relationCode.bindHint}</p>
    </section>
  );
}
```

- [ ] **Step 4: Compose `AccountPage` and wire the route**

```tsx
export function AccountPage({ model }: AccountPageProps) {
  return (
    <div className="account-page">
      <AccountHero hero={model.hero} />
      <AccountRelationshipsSection relationships={model.relationships} />
      <RelationCodeCard relationCode={model.relationCode} />
      <AccountSecurityCard security={model.security} />
      <AccountDangerZone dangerZone={model.dangerZone} />
    </div>
  );
}
```

```tsx
import { AccountPage } from '@/components/universe/AccountPage';
import { buildAccountPageViewModel } from '@/server/presenters/account-presenter';

export default function AccountSettingsPage() {
  const model = buildAccountPageViewModel();
  return <AccountPage model={model} />;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run:

```bash
npm test -- src/components/universe/AccountPage.test.tsx
```

Expected:

- PASS with the page rendering all major sections

- [ ] **Step 6: Commit**

```bash
git add src/components/universe/RelationCodeCard.tsx src/components/universe/AccountSecurityCard.tsx src/components/universe/AccountDangerZone.tsx src/components/universe/AccountPage.tsx src/app/'(app)'/settings/account/page.tsx src/components/universe/AccountPage.test.tsx
git commit -m "feat: assemble account page sections"
```

---

### Task 5: Add Desktop Account Page Styling

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Write a failing visual smoke assertion**

```tsx
it('applies account page section hooks for hero, relationships, and danger zone', () => {
  render(<AccountPage model={model} />);

  expect(document.querySelector('.account-page')).not.toBeNull();
  expect(document.querySelector('.account-hero')).not.toBeNull();
  expect(document.querySelector('.account-relationship-list')).not.toBeNull();
  expect(document.querySelector('.account-danger-zone')).not.toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/components/universe/AccountPage.test.tsx
```

Expected:

- FAIL until the page and class hooks are fully in place

- [ ] **Step 3: Add desktop-only account styles**

```css
.account-page {
  display: grid;
  gap: 24px;
}

.account-hero,
.account-section,
.account-danger-zone {
  position: relative;
  overflow: clip;
  border: 1px solid rgba(233, 226, 246, 0.12);
  border-radius: 28px;
  background:
    linear-gradient(180deg, rgba(14, 16, 33, 0.92), rgba(10, 12, 25, 0.88)),
    rgba(15, 17, 31, 0.92);
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.24);
}

.account-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  padding: 32px;
}

.account-relationship-list {
  display: grid;
  gap: 18px;
  margin-top: 24px;
}

.account-relationship-card {
  padding: 24px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(233, 226, 246, 0.08);
}

.account-danger-zone {
  padding: 28px 32px;
}
```

- [ ] **Step 4: Run lint and targeted tests**

Run:

```bash
npm test -- src/components/universe/AccountHero.test.tsx src/components/universe/AccountPage.test.tsx
npm run lint
```

Expected:

- PASS for component tests
- PASS for lint

- [ ] **Step 5: Commit**

```bash
git add src/styles/globals.css src/components/universe/AccountHero.tsx src/components/universe/AccountPage.tsx src/components/universe/AccountRelationshipCard.tsx src/components/universe/RelationCodeCard.tsx src/components/universe/AccountSecurityCard.tsx src/components/universe/AccountDangerZone.tsx src/components/universe/AccountPage.test.tsx
git commit -m "feat: style account page for desktop shell"
```

---

### Task 6: Full Verification And Cleanup

**Files:**
- Modify: any files required to fix verification issues discovered in this task

- [ ] **Step 1: Run the full automated checks**

Run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Expected:

- all commands PASS

- [ ] **Step 2: Verify the account route replaced the placeholder**

Run:

```bash
rg -n "SettingsPlaceholder scope=\"account\"" src
```

Expected:

- no remaining account route usage

- [ ] **Step 3: Fix any failures with minimal code changes**

Common fixes to apply if needed:

```ts
// Add missing imports for React hooks or view-model types
import React, { useState } from 'react';
```

```tsx
// Ensure buttons that do not submit parent forms remain inert
<button type="button">Edit Relationship</button>
```

```css
/* Prevent inherited spacing from collapsing the editorial vertical rhythm */
.account-section > * + * {
  margin-top: 16px;
}
```

- [ ] **Step 4: Re-run full verification**

Run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Expected:

- all commands PASS after any fixes

- [ ] **Step 5: Commit final verification fixes**

```bash
git add src/app/'(app)'/settings/account/page.tsx src/components/universe src/server/presenters src/styles/globals.css src/types/account.ts
git commit -m "fix: finalize account page verification"
```

---

## Self-Review

### Spec coverage

- Identity header with inline edit mode: Tasks 1, 3, 5
- Associated relationships before account controls: Tasks 1, 3, 4, 5
- Relation code as its own section: Tasks 1 and 4
- Security and danger zone isolation: Tasks 1, 4, 5
- Empty states, placeholder states, and local error/placeholder framing: Tasks 2 and 4
- Desktop-only delivery: Task 5 styles stay desktop-oriented and do not introduce mobile scope

### Placeholder scan

No `TODO`, `TBD`, or “implement later” plan gaps remain. Placeholder behavior in the plan refers to intentional product-scope placeholder UI required by the approved spec.

### Type consistency

- `AccountPageViewModel` is introduced first in Task 1 and used consistently later
- `hero`, `relationships`, `relationCode`, `security`, and `dangerZone` names remain stable across presenter, page, and component tasks
- component names and file names align with the approved spec
