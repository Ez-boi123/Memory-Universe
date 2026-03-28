'use client';

import React, { useEffect, useState } from 'react';
import type { AccountHeroViewModel } from '@/types/account';

interface AccountHeroProps {
  hero: AccountHeroViewModel;
}

function buildAvatarLabel(displayName: string, fallbackLabel: string) {
  const parts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return fallbackLabel;
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function AccountHero({ hero }: AccountHeroProps) {
  const [currentHero, setCurrentHero] = useState(hero);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    displayName: hero.displayName,
    email: hero.email,
    identityLine: hero.identityLine,
  });

  useEffect(() => {
    setCurrentHero(hero);
    setDraft({
      displayName: hero.displayName,
      email: hero.email,
      identityLine: hero.identityLine,
    });
    setIsEditing(false);
    setStatusMessage(null);
  }, [hero]);

  const resetDraft = () => {
    setDraft({
      displayName: currentHero.displayName,
      email: currentHero.email,
      identityLine: currentHero.identityLine,
    });
  };

  const handleSave = () => {
    setCurrentHero((current) => ({
      ...current,
      displayName: draft.displayName,
      email: draft.email,
      identityLine: draft.identityLine,
    }));
    setIsEditing(false);
    setStatusMessage(null);
  };

  const handleCancel = () => {
    resetDraft();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <section className="account-hero" aria-labelledby="account-hero-title">
        <div className="account-hero-copy">
          <p className="universe-kicker">{hero.eyebrow}</p>
          <h1 className="account-hero-title" id="account-hero-title">
            Edit Profile
          </h1>
          <label className="account-form-field">
            <span>Display Name</span>
            <input
              aria-label="Display Name"
              type="text"
              value={draft.displayName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, displayName: event.target.value }))
              }
            />
          </label>
          <label className="account-form-field">
            <span>Email</span>
            <input
              aria-label="Email"
              type="email"
              value={draft.email}
              onChange={(event) =>
                setDraft((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>
          <label className="account-form-field">
            <span>Profile</span>
            <textarea
              aria-label="Profile"
              value={draft.identityLine}
              onChange={(event) =>
                setDraft((current) => ({ ...current, identityLine: event.target.value }))
              }
            />
          </label>
          <div className="account-inline-actions">
            <button type="button" onClick={handleSave}>
              Save Profile
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="account-hero" aria-labelledby="account-hero-title">
      <div className="account-hero-copy">
        <p className="universe-kicker">{hero.eyebrow}</p>
        <div className="account-hero-identity">
          <div className="account-avatar" aria-hidden="true">
            {buildAvatarLabel(currentHero.displayName, currentHero.avatarLabel)}
          </div>
          <div className="account-hero-identity-copy">
            <h1 className="account-hero-title" id="account-hero-title">
              {currentHero.displayName}
            </h1>
            <p className="account-hero-email">{currentHero.email}</p>
            <p className="account-hero-description">{currentHero.identityLine}</p>
          </div>
        </div>
        {statusMessage ? <p className="account-inline-hint">{statusMessage}</p> : null}
        <button type="button" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      </div>

      <aside className="account-hero-aside" aria-label="Account summary">
        <p className="account-summary-label">{currentHero.summaryLabel}</p>
        <strong className="account-summary-value">{currentHero.summaryValue}</strong>
        <p className="account-summary-label">{currentHero.relationshipCountLabel}</p>
        <strong className="account-summary-value">{currentHero.relationshipCountValue}</strong>
      </aside>
    </section>
  );
}
