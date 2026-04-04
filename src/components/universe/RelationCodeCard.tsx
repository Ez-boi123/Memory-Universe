'use client';

import React, { useEffect, useState } from 'react';
import { bindRelationshipByCodeAction } from '@/app/(app)/settings/relationship/actions';
import type { RelationCodeCardViewModel } from '@/types/account';

interface RelationCodeCardProps {
  relationCode: RelationCodeCardViewModel;
}

export function RelationCodeCard({ relationCode }: RelationCodeCardProps) {
  const [copyLabel, setCopyLabel] = useState(relationCode.copyLabel);

  useEffect(() => {
    setCopyLabel(relationCode.copyLabel);
  }, [relationCode.copyLabel]);

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(relationCode.code);
      setCopyLabel('Copied');
      window.setTimeout(() => {
        setCopyLabel(relationCode.copyLabel);
      }, 1600);
    } catch {
      setCopyLabel('Copy Failed');
      window.setTimeout(() => {
        setCopyLabel(relationCode.copyLabel);
      }, 1600);
    }
  }

  return (
    <section
      className="account-section account-section--relation-code"
      aria-labelledby="account-relation-code-title"
    >
      <h2 className="account-section-title" id="account-relation-code-title">
        <span className="account-section-title-row">
          <span className="account-section-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10.5 13.5 7.75 16.25a3.18 3.18 0 1 1-4.5-4.5L6 9" />
              <path d="m13.5 10.5 2.75-2.75a3.18 3.18 0 0 1 4.5 4.5L18 15" />
              <path d="m8.5 15.5 7-7" />
            </svg>
          </span>
          <span>{relationCode.title}</span>
        </span>
      </h2>
      <div className="account-code-panel">
        <div className="account-code-value">{relationCode.code}</div>
        <button type="button" onClick={handleCopyCode}>
          {copyLabel}
        </button>
      </div>
      {relationCode.bindHint ? <p className="account-inline-hint">{relationCode.bindHint}</p> : null}
      {relationCode.bindError ? <p className="auth-error">{relationCode.bindError}</p> : null}
      {relationCode.bindSuccess ? <p className="auth-message">{relationCode.bindSuccess}</p> : null}
      <form action={bindRelationshipByCodeAction} className="account-bind-inline">
        <input name="returnTo" type="hidden" value="/settings/account" />
        <input
          aria-label="Relationship Code"
          className="account-bind-input account-bind-input--full"
          type="text"
          name="relationCode"
          defaultValue=""
          placeholder="Enter the other user's relation code"
          required
        />
        <button type="submit">{relationCode.bindLabel}</button>
      </form>
      <div className="account-relation-code-illustration" aria-hidden="true">
        <div className="account-relation-code-illustration__halo" />
        <div className="account-relation-code-illustration__orbit account-relation-code-illustration__orbit--one" />
        <div className="account-relation-code-illustration__orbit account-relation-code-illustration__orbit--two" />
        <div className="account-relation-code-illustration__star account-relation-code-illustration__star--one" />
        <div className="account-relation-code-illustration__star account-relation-code-illustration__star--two" />
        <div className="account-relation-code-illustration__star account-relation-code-illustration__star--three" />
        <div className="account-relation-code-illustration__beam" />
      </div>
    </section>
  );
}
