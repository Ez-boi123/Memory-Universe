'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AccountSecurityCardViewModel } from '@/types/account';

interface AccountSecurityCardProps {
  security: AccountSecurityCardViewModel;
}

export function AccountSecurityCard({ security }: AccountSecurityCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');
  };

  const dialog =
    isDialogOpen && typeof document !== 'undefined'
      ? createPortal(
          <div className="account-password-dialog-backdrop">
            <div
              aria-labelledby="account-password-dialog-title"
              aria-modal="true"
              className="account-password-dialog"
              role="dialog"
            >
              <h3 className="account-password-dialog-title" id="account-password-dialog-title">
                Update Password
              </h3>
              <div className="account-password-dialog-fields">
                <label className="account-password-field">
                  <span>New Password</span>
                  <input
                    aria-label="New Password"
                    onChange={(event) => setNewPassword(event.target.value)}
                    type="password"
                    value={newPassword}
                  />
                </label>
                <label className="account-password-field">
                  <span>Confirm New Password</span>
                  <input
                    aria-label="Confirm New Password"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type="password"
                    value={confirmPassword}
                  />
                </label>
              </div>
              {errorMessage ? <p className="account-password-dialog-error">{errorMessage}</p> : null}
              <div className="account-password-dialog-actions">
                <button onClick={closeDialog} type="button">
                  Cancel
                </button>
                <button className="account-password-dialog-confirm" onClick={handleSubmit} type="button">
                  Update Password
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <section
        className="account-section account-section--security"
        aria-labelledby="account-security-title"
      >
        <h2 className="account-section-title" id="account-security-title">
          <span className="account-section-title-row">
            <span className="account-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3.75 5.25 6.75v4.5c0 4.14 2.88 7.97 6.75 8.96 3.87-.99 6.75-4.82 6.75-8.96v-4.5L12 3.75Z" />
                <path d="M9.75 11.75 11.25 13.25 14.75 9.75" />
              </svg>
            </span>
            <span>{security.title}</span>
          </span>
        </h2>
        {security.description ? (
          <p className="account-section-description">{security.description}</p>
        ) : null}
        <div className="account-inline-actions">
          <button onClick={() => setIsDialogOpen(true)} type="button">
            {security.actionLabel}
          </button>
        </div>
        {security.helperText ? <p className="account-inline-hint">{security.helperText}</p> : null}
        <div className="account-security-illustration" aria-hidden="true">
          <div className="account-security-illustration__halo" />
          <div className="account-security-illustration__ring account-security-illustration__ring--outer" />
          <div className="account-security-illustration__ring account-security-illustration__ring--inner" />
          <div className="account-security-illustration__shield" />
          <div className="account-security-illustration__spark account-security-illustration__spark--one" />
          <div className="account-security-illustration__spark account-security-illustration__spark--two" />
          <div className="account-security-illustration__spark account-security-illustration__spark--three" />
        </div>
      </section>
      {dialog}
    </>
  );
}
