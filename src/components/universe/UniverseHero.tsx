import React from 'react';
import type { UniverseHeroViewModel } from '@/types/universe';

interface UniverseHeroProps {
  hero: UniverseHeroViewModel;
}

export function UniverseHero({ hero }: UniverseHeroProps) {
  return (
    <section className="universe-hero" aria-labelledby="universe-hero-title">
      <div className="universe-hero-copy">
        <p className="universe-kicker">{hero.eyebrow}</p>
        <h1 className="universe-hero-title" id="universe-hero-title">
          {hero.title}
        </h1>
        <p className="universe-hero-description">{hero.description}</p>
      </div>

      <aside className="universe-hero-aside" aria-label="Universe status">
        <span className="universe-status-pill">{hero.statusLabel}</span>
        <p className="universe-member-summary">{hero.memberSummary}</p>
      </aside>
    </section>
  );
}
