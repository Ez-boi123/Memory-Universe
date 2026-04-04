import React from 'react';

import type { PlanetEventDetailViewModel } from '@/types/planet';

import { PlanetEventDetailContent } from './PlanetEventDetailContent';
import { PlanetEventDetailMediaStage } from './PlanetEventDetailMediaStage';

interface PlanetEventDetailModalProps {
  event: PlanetEventDetailViewModel;
  isEntering: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onImageOpen: (photoId: string) => void;
}

export function PlanetEventDetailModal({
  event,
  isEntering,
  onClose,
  onDelete,
  onEdit,
  onImageOpen,
}: PlanetEventDetailModalProps) {
  return (
    <div className={`planet-modal-backdrop${isEntering ? ' planet-modal-backdrop--soft-enter' : ''}`}>
      <div
        aria-label={event.title}
        aria-modal="true"
        className={`planet-modal planet-modal--detail${isEntering ? ' planet-modal--soft-enter' : ''}`}
        data-testid="planet-detail-modal"
        role="dialog"
      >
        <button aria-label="Close" className="planet-modal-close" onClick={onClose} type="button">
          <span aria-hidden="true" className="planet-modal-close-icon">
            <span />
            <span />
          </span>
        </button>
        <div className="planet-detail-layout">
          <PlanetEventDetailMediaStage event={event} onImageOpen={onImageOpen} />
          <PlanetEventDetailContent event={event} onDelete={onDelete} onEdit={onEdit} />
        </div>
      </div>
    </div>
  );
}
