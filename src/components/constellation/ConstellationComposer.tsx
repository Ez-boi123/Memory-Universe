'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { ConstellationComposerViewModel } from '@/types/constellation';

interface ConstellationComposerProps {
  composer: ConstellationComposerViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export function ConstellationComposer({ composer, isOpen, onClose }: ConstellationComposerProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/messages', {
        body: JSON.stringify({ content }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const payload = (await response.json()) as {
        errors?: string[];
        message?: { id: string };
        ok: boolean;
      };

      if (!response.ok || !payload.ok) {
        setErrorMessage(payload.errors?.[0] ?? 'Unable to add this note right now.');
        return;
      }

      setContent('');
      onClose();
      router.refresh();
    } catch {
      setErrorMessage('Unable to add this note right now.');
    } finally {
      setIsSubmitting(false);
    }
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
        <form onSubmit={handleSubmit}>
          <textarea
            maxLength={composer.maxLength}
            onChange={(event) => setContent(event.target.value)}
            placeholder={composer.placeholder}
            ref={textareaRef}
            value={content}
          />
          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
          <div className="constellation-composer-actions">
            <button onClick={onClose} type="button">
              {composer.cancelLabel}
            </button>
            <button disabled={isSubmitting || content.trim().length === 0} type="submit">
              {isSubmitting ? 'Sending...' : composer.submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
