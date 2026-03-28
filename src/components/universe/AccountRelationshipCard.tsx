'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AccountRelationshipCardViewModel } from '@/types/account';

interface AccountRelationshipCardProps {
  item: AccountRelationshipCardViewModel;
}

export function AccountRelationshipCard({ item }: AccountRelationshipCardProps) {
  const [currentItem, setCurrentItem] = useState(item);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: item.title,
    emotionalNote: item.emotionalNote,
  });

  useEffect(() => {
    setCurrentItem(item);
    setDraft({
      title: item.title,
      emotionalNote: item.emotionalNote,
    });
    setIsEditing(false);
    setStatusMessage(null);
  }, [item]);

  const resetDraft = () => {
    setDraft({
      title: currentItem.title,
      emotionalNote: currentItem.emotionalNote,
    });
  };

  const handleSave = () => {
    setCurrentItem((current) => ({
      ...current,
      title: draft.title,
      emotionalNote: draft.emotionalNote,
    }));
    setIsEditing(false);
    setStatusMessage(null);
  };

  const handleCancel = () => {
    resetDraft();
    setIsEditing(false);
  };

  return (
    <article className="account-relationship-card">
      {isEditing ? (
        <>
          <label className="account-form-field">
            <span>Relationship Title</span>
            <input
              aria-label="Relationship Title"
              type="text"
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
            />
          </label>
          <label className="account-form-field">
            <span>Emotional Note</span>
            <textarea
              aria-label="Emotional Note"
              value={draft.emotionalNote}
              onChange={(event) =>
                setDraft((current) => ({ ...current, emotionalNote: event.target.value }))
              }
            />
          </label>
          <div className="account-inline-actions">
            <button type="button" onClick={handleSave}>
              Save Relationship
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="account-relationship-status">{currentItem.statusLabel}</p>
          <h3 className="account-relationship-title">{currentItem.title}</h3>
          <p className="account-relationship-members">{currentItem.memberSummary}</p>
          <p className="account-relationship-note">{currentItem.emotionalNote}</p>
          {statusMessage ? <p className="account-inline-hint">{statusMessage}</p> : null}
          <div className="account-inline-actions">
            <Link href={currentItem.href}>{currentItem.enterLabel}</Link>
            <button type="button" onClick={() => setIsEditing(true)}>
              {currentItem.editLabel}
            </button>
          </div>
        </>
      )}
    </article>
  );
}
