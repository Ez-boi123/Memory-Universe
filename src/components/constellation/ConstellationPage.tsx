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
  );
}
