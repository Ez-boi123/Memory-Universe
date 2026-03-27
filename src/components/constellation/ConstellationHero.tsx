import React from 'react';

import type { ConstellationHeroViewModel } from '@/types/constellation';

interface ConstellationHeroProps {
  hero: ConstellationHeroViewModel;
}

export function ConstellationHero({ hero }: ConstellationHeroProps) {
  return (
    <section className="constellation-hero">
      <div className="constellation-hero-copy">
        <p className="page-eyebrow">{hero.eyebrow}</p>
        <h1 className="constellation-hero-title">{hero.title}</h1>
        <p className="constellation-hero-lead">{hero.lead}</p>
        <p className="constellation-hero-description">{hero.description}</p>
      </div>
      <div aria-hidden="true" className="constellation-hero-stars" />
    </section>
  );
}
