import React from 'react';

import type { ConstellationHeroViewModel } from '@/types/constellation';

interface ConstellationHeroProps {
  hero: ConstellationHeroViewModel;
}

export function ConstellationHero({ hero }: ConstellationHeroProps) {
  return (
    <section className="constellation-hero">
      <div
        aria-hidden="true"
        className="constellation-hero-cluster-layer"
        data-testid="constellation-hero-cluster-layer"
      />
      <div className="constellation-hero-copy">
        <p className="page-eyebrow">{hero.eyebrow}</p>
        <h1 className="constellation-hero-title">{hero.title}</h1>
        <p className="constellation-hero-lead">{hero.lead}</p>
        <p className="constellation-hero-description">{hero.description}</p>
      </div>
      <div aria-hidden="true" className="constellation-hero-divider" />
      <div aria-hidden="true" className="constellation-hero-illustration">
        <div className="constellation-hero-orbit constellation-hero-orbit--outer" />
        <div className="constellation-hero-orbit constellation-hero-orbit--inner" />
        <div className="constellation-hero-planet constellation-hero-planet--primary" />
        <div className="constellation-hero-planet constellation-hero-planet--secondary" />
        <div className="constellation-hero-comet" />
        <div className="constellation-hero-trail constellation-hero-trail--one" />
        <div className="constellation-hero-trail constellation-hero-trail--two" />
        <div className="constellation-hero-starburst constellation-hero-starburst--one" />
        <div className="constellation-hero-starburst constellation-hero-starburst--two" />
      </div>
      <div aria-hidden="true" className="constellation-hero-stars" />
    </section>
  );
}
