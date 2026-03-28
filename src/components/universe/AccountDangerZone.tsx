'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AccountDangerZoneViewModel } from '@/types/account';
import { SignOutForm } from '@/components/auth/SignOutForm';

interface AccountDangerZoneProps {
  dangerZone: AccountDangerZoneViewModel;
}

export function AccountDangerZone({ dangerZone }: AccountDangerZoneProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const confirmationDialog =
    isConfirmOpen && typeof document !== 'undefined'
      ? createPortal(
          <div className="account-danger-zone-dialog-backdrop">
            <div
              aria-labelledby="account-delete-dialog-title"
              aria-modal="true"
            className="account-danger-zone-dialog"
            role="dialog"
          >
            <h3 className="account-danger-zone-dialog-title" id="account-delete-dialog-title">
              <span aria-hidden="true" className="account-danger-zone-dialog-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.85"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8.6v4.6" />
                  <path d="M12 16.8h.01" />
                  <path d="M10.72 4.8 3.08 18.06A1.48 1.48 0 0 0 4.36 20.3h15.28a1.48 1.48 0 0 0 1.28-2.24L13.28 4.8a1.48 1.48 0 0 0-2.56 0Z" />
                </svg>
              </span>
              Confirm Account Deletion
            </h3>
              <p className="account-danger-zone-dialog-copy">
                Deleting your account will permanently remove all records and they cannot be recovered.
              </p>
              <div className="account-danger-zone-dialog-actions">
                <button onClick={() => setIsConfirmOpen(false)} type="button">
                  Cancel
                </button>
                <button className="account-danger-zone-confirm" type="button">
                  Confirm
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <section className="account-danger-zone account-danger-zone--decorated">
        {dangerZone.description ? (
          <p className="account-section-description">{dangerZone.description}</p>
        ) : null}
        <div className="account-inline-actions">
          <button
            className="account-danger-zone-delete"
            onClick={() => setIsConfirmOpen(true)}
            type="button"
          >
            {dangerZone.deleteLabel}
          </button>
          <SignOutForm
            buttonClassName="account-danger-zone-signout-button"
            className="account-danger-zone-signout"
            label={dangerZone.signOutLabel}
          />
        </div>
        {dangerZone.deleteHint ? <p className="account-inline-hint">{dangerZone.deleteHint}</p> : null}
      </section>
      {confirmationDialog}
    </>
  );
}
