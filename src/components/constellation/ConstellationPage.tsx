'use client';

import React, { useState } from 'react';

import type { ConstellationPageViewModel } from '@/types/constellation';

import { ConstellationComposer } from './ConstellationComposer';
import { ConstellationFloatingAction } from './ConstellationFloatingAction';
import { ConstellationHero } from './ConstellationHero';
import { ConstellationMessageStream } from './ConstellationMessageStream';

interface ConstellationPageProps {
  model: ConstellationPageViewModel;
}

export function ConstellationPage({ model }: ConstellationPageProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <div className="constellation-page">
      <div aria-hidden="true" className="constellation-page-veil" data-testid="constellation-page-veil">
        <div
          aria-hidden="true"
          className="constellation-page-veil-stardust-haze"
          data-testid="constellation-page-stardust-haze-hook"
        />
        <div
          aria-hidden="true"
          className="constellation-page-veil-stardust-sparkle"
          data-testid="constellation-page-stardust-sparkle-hook"
        >
          <div
            aria-hidden="true"
            className="constellation-page-veil-stardust-sparkle-field constellation-page-veil-stardust-sparkle-field--one"
          />
          <div
            aria-hidden="true"
            className="constellation-page-veil-stardust-sparkle-field constellation-page-veil-stardust-sparkle-field--two"
          />
          <div
            aria-hidden="true"
            className="constellation-page-veil-stardust-sparkle-field constellation-page-veil-stardust-sparkle-field--three"
          />
        </div>
        <div
          aria-hidden="true"
          className="constellation-page-veil-stardust-glow"
          data-testid="constellation-page-stardust-glow-hook"
        />
        <div
          aria-hidden="true"
          className="constellation-page-veil-stardust-needle"
          data-testid="constellation-page-stardust-needle-hook"
        />
        <div
          aria-hidden="true"
          className="constellation-page-veil-arcs"
          data-testid="constellation-page-veil-arcs"
        >
          <div aria-hidden="true" className="constellation-page-veil-arcs-segment constellation-page-veil-arcs-segment--hero" />
          <div aria-hidden="true" className="constellation-page-veil-arcs-segment constellation-page-veil-arcs-segment--mid" />
          <div aria-hidden="true" className="constellation-page-veil-arcs-segment constellation-page-veil-arcs-segment--deep" />
        </div>
        <div
          aria-hidden="true"
          className="constellation-page-veil-clusters"
          data-testid="constellation-page-veil-clusters"
        >
          <div
            aria-hidden="true"
            className="constellation-page-veil-clusters-segment constellation-page-veil-clusters-segment--hero"
          />
          <div
            aria-hidden="true"
            className="constellation-page-veil-clusters-segment constellation-page-veil-clusters-segment--mid"
          />
          <div
            aria-hidden="true"
            className="constellation-page-veil-clusters-segment constellation-page-veil-clusters-segment--deep"
          />
        </div>
        <div aria-hidden="true" className="constellation-page-reading-shield" />
      </div>
      <div className="constellation-page-content">
        <ConstellationHero hero={model.hero} />
        <ConstellationMessageStream emptyState={model.emptyState} messages={model.messages} />
        <ConstellationFloatingAction
          action={model.floatingAction}
          onClick={() => setIsComposerOpen(true)}
        />
        <ConstellationComposer
          composer={model.composer}
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
        />
      </div>
    </div>
  );
}
