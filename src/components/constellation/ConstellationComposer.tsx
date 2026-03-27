'use client';

import React, { useEffect, useRef } from 'react';

import type { ConstellationComposerViewModel } from '@/types/constellation';

interface ConstellationComposerProps {
  composer: ConstellationComposerViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export function ConstellationComposer({ composer, isOpen, onClose }: ConstellationComposerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
    } else {
      dialog.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const interactiveElements = dialog.querySelectorAll<HTMLElement>(
        'button, textarea, input, select, a[href], [tabindex]:not([tabindex="-1"])'
      );

      if (interactiveElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = interactiveElements[0];
      const lastElement = interactiveElements[interactiveElements.length - 1];
      const activeElement = document.activeElement;

      if (!event.shiftKey && activeElement === dialog) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && (activeElement === firstElement || activeElement === dialog)) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="constellation-composer-backdrop" onClick={onClose}>
      <div
        aria-label={composer.title}
        aria-modal="true"
        className="constellation-composer"
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <h2>{composer.title}</h2>
        <p>{composer.helperText}</p>
        <textarea
          maxLength={composer.maxLength}
          placeholder={composer.placeholder}
          ref={textareaRef}
        />
        <div className="constellation-composer-actions">
          <button onClick={onClose} type="button">
            {composer.cancelLabel}
          </button>
          <button type="button">{composer.submitLabel}</button>
        </div>
      </div>
    </div>
  );
}
