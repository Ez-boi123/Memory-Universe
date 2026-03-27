import React from 'react';

import type { ConstellationComposerViewModel } from '@/types/constellation';

interface ConstellationComposerProps {
  composer: ConstellationComposerViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export function ConstellationComposer({ composer, isOpen, onClose }: ConstellationComposerProps) {
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
        role="dialog"
      >
        <h2>{composer.title}</h2>
        <p>{composer.helperText}</p>
        <textarea maxLength={composer.maxLength} placeholder={composer.placeholder} />
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
