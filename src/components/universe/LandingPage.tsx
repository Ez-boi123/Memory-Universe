'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { LandingAnchor, type LandingSectionId } from '@/components/universe/LandingAnchor';

interface LandingPageProps {
  isSignedIn: boolean;
  userLabel?: string | null;
}

const featureCards = [
  {
    eyebrow: 'Memory Planet',
    title: 'Turn major moments into living memory chapters',
    description:
      'Record anniversaries, trips, everyday fragments, and meaningful milestones as carefully dated memory events.',
    accentClassName: 'landing-feature-visual-planet',
    meta: 'Event chapters • shared edits • date-based memories',
  },
  {
    eyebrow: 'Memory Milky Way',
    title: 'Follow your story through a visual timeline',
    description:
      'Arrange photos as a gentle journey through time, so revisiting memories feels like traveling through your own galaxy.',
    accentClassName: 'landing-feature-visual-milkyway',
    meta: 'Photo trails • archive flow • timeline journeys',
  },
  {
    eyebrow: 'Heartfelt Messages',
    title: 'Leave warmth in small, everyday words',
    description:
      'Keep a private message board for short notes, affection, gratitude, and the things that deserve to stay close.',
    accentClassName: 'landing-feature-visual-constellation',
    meta: 'Daily notes • soft presence • emotional memory layer',
  },
];

const relationshipSpaces = [
  {
    title: 'Partners',
    detail: 'A shared constellation for anniversaries, ordinary days, and the quiet rituals that define a relationship.',
  },
  {
    title: 'Family',
    detail: 'A place to preserve generations of stories, photos, milestones, and notes that should not disappear in chat history.',
  },
  {
    title: 'Friends',
    detail: 'A private orbit for trips, reunions, in-jokes, and memories that grow more valuable with time.',
  },
];

const messagePreview = [
  {
    author: 'Ari',
    time: 'Tonight, 9:24 PM',
    content: 'I still remember how the room felt the first time we laughed until midnight.',
  },
  {
    author: 'Mina',
    time: 'Yesterday, 7:12 AM',
    content: 'Let’s keep this one forever. It felt small in the moment, but I know it will matter later.',
  },
];

const landingSectionIds: LandingSectionId[] = ['features', 'messages', 'spaces', 'cta'];
const landingParticles = [
  { left: '6%', top: '18%', size: '3px', delay: '0s', duration: '4.8s', color: 'rgba(244, 244, 248, 0.96)' },
  { left: '14%', top: '58%', size: '2px', delay: '-2s', duration: '5.6s', color: 'rgba(246, 232, 190, 0.86)' },
  { left: '22%', top: '34%', size: '4px', delay: '-1.4s', duration: '6.4s', color: 'rgba(235, 238, 246, 0.9)' },
  { left: '28%', top: '76%', size: '2px', delay: '-4s', duration: '5.1s', color: 'rgba(255, 244, 214, 0.82)' },
  { left: '36%', top: '14%', size: '5px', delay: '-3.2s', duration: '7s', color: 'rgba(248, 249, 252, 0.8)' },
  { left: '44%', top: '48%', size: '3px', delay: '-1.5s', duration: '4.9s', color: 'rgba(245, 228, 180, 0.76)' },
  { left: '52%', top: '24%', size: '2px', delay: '-5s', duration: '5.3s', color: 'rgba(252, 252, 255, 0.88)' },
  { left: '58%', top: '66%', size: '4px', delay: '-2.6s', duration: '6.7s', color: 'rgba(250, 232, 172, 0.78)' },
  { left: '64%', top: '38%', size: '3px', delay: '-3s', duration: '5.4s', color: 'rgba(236, 239, 245, 0.8)' },
  { left: '72%', top: '14%', size: '2px', delay: '-1s', duration: '4.7s', color: 'rgba(255, 246, 220, 0.84)' },
  { left: '78%', top: '54%', size: '4px', delay: '-2.1s', duration: '6.2s', color: 'rgba(242, 243, 248, 0.78)' },
  { left: '86%', top: '30%', size: '2px', delay: '-4.3s', duration: '5s', color: 'rgba(250, 227, 160, 0.86)' },
  { left: '90%', top: '72%', size: '5px', delay: '-3.8s', duration: '7.2s', color: 'rgba(242, 244, 250, 0.76)' },
  { left: '12%', top: '88%', size: '3px', delay: '-2.8s', duration: '5.8s', color: 'rgba(245, 224, 166, 0.68)' },
  { left: '40%', top: '88%', size: '2px', delay: '-5.2s', duration: '4.6s', color: 'rgba(250, 250, 253, 0.8)' },
  { left: '68%', top: '84%', size: '4px', delay: '-3.5s', duration: '6.5s', color: 'rgba(244, 230, 182, 0.66)' },
  { left: '18%', top: '10%', size: '2px', delay: '-6.2s', duration: '5.5s', color: 'rgba(245, 246, 250, 0.78)' },
  { left: '32%', top: '62%', size: '3px', delay: '-1.8s', duration: '6.1s', color: 'rgba(246, 229, 188, 0.74)' },
  { left: '48%', top: '78%', size: '2px', delay: '-4.8s', duration: '5.2s', color: 'rgba(248, 248, 252, 0.76)' },
  { left: '76%', top: '24%', size: '3px', delay: '-2.4s', duration: '6s', color: 'rgba(247, 228, 175, 0.82)' },
  { left: '8%', top: '40%', size: '2px', delay: '-1.2s', duration: '5.8s', color: 'rgba(251, 252, 255, 0.9)' },
  { left: '16%', top: '26%', size: '3px', delay: '-4.1s', duration: '6.8s', color: 'rgba(247, 231, 190, 0.78)' },
  { left: '24%', top: '48%', size: '2px', delay: '-2.7s', duration: '5.4s', color: 'rgba(240, 242, 247, 0.84)' },
  { left: '30%', top: '20%', size: '2px', delay: '-3.6s', duration: '4.9s', color: 'rgba(252, 237, 192, 0.88)' },
  { left: '38%', top: '34%', size: '3px', delay: '-5.4s', duration: '6.2s', color: 'rgba(246, 246, 250, 0.82)' },
  { left: '46%', top: '16%', size: '2px', delay: '-2.3s', duration: '5.1s', color: 'rgba(245, 228, 178, 0.84)' },
  { left: '54%', top: '42%', size: '3px', delay: '-1.1s', duration: '5.7s', color: 'rgba(252, 252, 255, 0.9)' },
  { left: '62%', top: '22%', size: '2px', delay: '-3.9s', duration: '6.4s', color: 'rgba(249, 228, 165, 0.8)' },
  { left: '70%', top: '44%', size: '3px', delay: '-4.7s', duration: '5.5s', color: 'rgba(242, 243, 248, 0.78)' },
  { left: '82%', top: '18%', size: '2px', delay: '-2.9s', duration: '4.8s', color: 'rgba(250, 233, 186, 0.9)' },
  { left: '88%', top: '46%', size: '3px', delay: '-5.6s', duration: '6.6s', color: 'rgba(245, 246, 250, 0.76)' },
  { left: '92%', top: '58%', size: '2px', delay: '-1.7s', duration: '5.2s', color: 'rgba(246, 226, 170, 0.84)' },
  { left: '10%', top: '24%', size: '2px', delay: '-6.4s', duration: '5.7s', color: 'rgba(251, 251, 255, 0.88)' },
  { left: '20%', top: '68%', size: '3px', delay: '-2.5s', duration: '6.9s', color: 'rgba(248, 225, 162, 0.76)' },
  { left: '27%', top: '56%', size: '2px', delay: '-3.3s', duration: '4.9s', color: 'rgba(242, 244, 249, 0.8)' },
  { left: '34%', top: '12%', size: '3px', delay: '-4.6s', duration: '7.4s', color: 'rgba(247, 229, 182, 0.74)' },
  { left: '42%', top: '70%', size: '2px', delay: '-1.9s', duration: '5.4s', color: 'rgba(250, 251, 255, 0.84)' },
  { left: '50%', top: '32%', size: '3px', delay: '-5.8s', duration: '6.1s', color: 'rgba(246, 223, 152, 0.78)' },
  { left: '60%', top: '74%', size: '2px', delay: '-2.2s', duration: '5.3s', color: 'rgba(244, 245, 250, 0.82)' },
  { left: '66%', top: '12%', size: '3px', delay: '-4.9s', duration: '6.7s', color: 'rgba(247, 226, 167, 0.8)' },
  { left: '74%', top: '62%', size: '2px', delay: '-3.1s', duration: '5.1s', color: 'rgba(251, 252, 255, 0.88)' },
  { left: '80%', top: '40%', size: '3px', delay: '-6s', duration: '6.3s', color: 'rgba(248, 227, 170, 0.76)' },
  { left: '94%', top: '20%', size: '2px', delay: '-2.6s', duration: '5.6s', color: 'rgba(244, 246, 250, 0.8)' },
];

const landingFlareStars = [
  { left: '18%', top: '32%', size: '18px', delay: '-1s', duration: '7.2s' },
  { left: '43%', top: '18%', size: '22px', delay: '-3.2s', duration: '8.6s' },
  { left: '67%', top: '36%', size: '20px', delay: '-2.4s', duration: '7.8s' },
  { left: '84%', top: '24%', size: '16px', delay: '-4.4s', duration: '6.9s' },
];

export function LandingPage({ isSignedIn, userLabel }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState<LandingSectionId | null>(null);
  const [navIndicatorStyle, setNavIndicatorStyle] = useState<CSSProperties>({});
  const navLinksRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sections = landingSectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries.length === 0) {
          return;
        }

        setActiveSection(visibleEntries[0].target.id as LandingSectionId);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: '-18% 0px -42% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    function updateIndicator() {
      const sectionForIndicator = activeSection;

      if (!navLinksRef.current || !sectionForIndicator) {
        setNavIndicatorStyle({
          opacity: 0,
        });
        return;
      }

      const activeLink = navLinksRef.current.querySelector<HTMLElement>(
        `[data-section-id="${sectionForIndicator}"]`
      );

      if (!activeLink) {
        setNavIndicatorStyle({
          opacity: 0,
        });
        return;
      }

      setNavIndicatorStyle({
        opacity: 1,
        width: `${activeLink.offsetWidth}px`,
        height: `${activeLink.offsetHeight}px`,
        transform: `translateX(${activeLink.offsetLeft}px)`,
      });
    }

    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeSection]);

  function handleNavStart(sectionId: LandingSectionId) {
    if (sectionId === 'top') {
      return;
    }

    setActiveSection(sectionId);
  }

  return (
    <div className="landing-page" id="top">
      <div className="landing-background" aria-hidden="true">
        <div className="landing-nebula landing-nebula-left" />
        <div className="landing-nebula landing-nebula-right" />
        <div className="landing-nebula landing-nebula-bottom" />
        <div className="landing-milkyway-band" />
        <div className="landing-particles">
          {landingParticles.map((particle, index) => (
            <span
              className="landing-particle"
              key={`${particle.left}-${particle.top}-${index}`}
              style={
                {
                  '--particle-left': particle.left,
                  '--particle-top': particle.top,
                  '--particle-size': particle.size,
                  '--particle-delay': particle.delay,
                  '--particle-duration': particle.duration,
                  '--particle-color': particle.color,
                } as CSSProperties
              }
            />
          ))}
          {landingFlareStars.map((star, index) => (
            <span
              className="landing-flare-star"
              key={`${star.left}-${star.top}-${index}`}
              style={
                {
                  '--flare-left': star.left,
                  '--flare-top': star.top,
                  '--flare-size': star.size,
                  '--flare-delay': star.delay,
                  '--flare-duration': star.duration,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <span className="landing-star landing-star-1" />
        <span className="landing-star landing-star-2" />
        <span className="landing-star landing-star-3" />
        <span className="landing-star landing-star-4" />
        <span className="landing-star landing-star-5" />
        <span className="landing-star landing-star-6" />
      </div>

      <div className="landing-shell">
        <header className="landing-nav">
          <LandingAnchor className="landing-brand" href="#top">
            <span className="landing-brand-mark" />
            <span>Memory Universe</span>
          </LandingAnchor>

          <nav className="landing-nav-links" aria-label="Primary" ref={navLinksRef}>
            <div className="landing-nav-indicator" style={navIndicatorStyle} />
            <LandingAnchor
              href="#features"
              isActive={activeSection === 'features'}
              onNavigate={handleNavStart}
              sectionId="features"
            >
              Features
            </LandingAnchor>
            <LandingAnchor
              href="#messages"
              isActive={activeSection === 'messages'}
              onNavigate={handleNavStart}
              sectionId="messages"
            >
              Message Board
            </LandingAnchor>
            <LandingAnchor
              href="#spaces"
              isActive={activeSection === 'spaces'}
              onNavigate={handleNavStart}
              sectionId="spaces"
            >
              Shared Spaces
            </LandingAnchor>
            <LandingAnchor
              href="#cta"
              isActive={activeSection === 'cta'}
              onNavigate={handleNavStart}
              sectionId="cta"
            >
              Start
            </LandingAnchor>
          </nav>

          <div className="landing-nav-actions">
            {isSignedIn ? (
              <>
                <span className="landing-session-pill">{userLabel ?? 'Signed in'}</span>
                <Link className="landing-nav-button" href="/universe">
                  Enter Universe
                </Link>
              </>
            ) : (
              <>
                <Link className="landing-nav-link" href="/sign-in">
                  Sign In
                </Link>
                <Link className="landing-nav-button" href="/sign-up">
                  Begin Your Archive
                </Link>
              </>
            )}
          </div>
        </header>

        <main>
          <section className="landing-hero">
            <div className="landing-hero-copy">
              <p className="landing-kicker">Private memory spaces for family, partners, and friends</p>
              <h1>Every Memory Has Its Own Universe</h1>
              <p className="landing-hero-text">
                Turn moments into timeless digital constellations. Preserve stories, photos, notes,
                and milestones inside immersive shared spaces designed for revisiting what matters.
              </p>

              <div className="landing-hero-actions">
                <Link className="landing-primary-cta" href={isSignedIn ? '/universe' : '/sign-up'}>
                  {isSignedIn ? 'Open Your Universe' : 'Start Preserving Memories'}
                </Link>
                <LandingAnchor
                  className="landing-secondary-cta"
                  href="#features"
                  isActive={activeSection === 'features'}
                  onNavigate={handleNavStart}
                >
                  Explore The Journey
                </LandingAnchor>
              </div>

              <div className="landing-hero-stats">
                <div className="landing-glass-card">
                  <span className="landing-stat-value">4 core worlds</span>
                  <span className="landing-stat-label">Events, photos, messages, private spaces</span>
                </div>
                <div className="landing-glass-card">
                  <span className="landing-stat-value">Private by default</span>
                  <span className="landing-stat-label">Shared only with the people inside your orbit</span>
                </div>
              </div>
            </div>

            <div className="landing-hero-visual">
              <div className="landing-orbit-card landing-orbit-main">
                <p className="landing-panel-eyebrow">Dreamy archive</p>
                <h2>Memory Universe</h2>
                <p>
                  A calm cosmic home where your relationship stories feel curated, layered, and
                  worth returning to.
                </p>
              </div>

              <div className="landing-orbit-card landing-orbit-planet">
                <p className="landing-panel-eyebrow">Memory Planet</p>
                <strong>“Our first trip after the rain.”</strong>
                <span>Event chapter with date, place, and shared edits.</span>
              </div>

              <div className="landing-orbit-card landing-orbit-milkyway">
                <p className="landing-panel-eyebrow">Memory Milky Way</p>
                <strong>Timeline photo journey</strong>
                <span>Follow your story through a luminous path of captured days.</span>
              </div>
            </div>
          </section>

          <section className="landing-story-band" id="features">
            <div className="landing-story-intro">
              <p className="landing-section-kicker">Designed for memory, not noise</p>
              <h2>A storytelling interface with emotional depth and structure</h2>
              <p>
                We use layered contrast, soft glass surfaces, and nebula-inspired light to make the
                product feel immersive without sacrificing clarity.
              </p>
            </div>

            <div className="landing-feature-grid">
              {featureCards.map((card) => (
                <article className="landing-feature-card" key={card.title}>
                  <div className={`landing-feature-visual ${card.accentClassName}`}>
                    <div className="landing-feature-visual-core" />
                    <div className="landing-feature-visual-ring landing-feature-visual-ring-a" />
                    <div className="landing-feature-visual-ring landing-feature-visual-ring-b" />
                    <div className="landing-feature-visual-spark landing-feature-visual-spark-a" />
                    <div className="landing-feature-visual-spark landing-feature-visual-spark-b" />
                    <div className="landing-feature-visual-spark landing-feature-visual-spark-c" />
                  </div>
                  <p className="landing-panel-eyebrow">{card.eyebrow}</p>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="landing-feature-meta">{card.meta}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-message-section" id="messages">
            <div className="landing-message-visual">
              <div className="landing-message-orbit" />
              <div className="landing-message-moon landing-message-moon-a" />
              <div className="landing-message-moon landing-message-moon-b" />
              <div className="landing-message-moon landing-message-moon-c" />
              <div className="landing-message-scene-card">
                <p className="landing-panel-eyebrow">Message board preview</p>
                <strong>Small words, held in orbit</strong>
                <span>
                  Notes drift like luminous fragments around the relationship they belong to.
                </span>
              </div>
            </div>

            <div className="landing-message-content">
              <div className="landing-message-copy">
                <p className="landing-section-kicker">Heartfelt message board</p>
                <h2>Small words stay luminous when they have a place to live</h2>
                <p>
                  Keep everyday affection, gratitude, and quiet reminders somewhere more lasting than
                  scrolling chat history.
                </p>
              </div>

              <div className="landing-message-stack">
                {messagePreview.map((message) => (
                  <article className="landing-message-card" key={`${message.author}-${message.time}`}>
                    <div className="landing-message-meta">
                      <strong>{message.author}</strong>
                      <span>{message.time}</span>
                    </div>
                    <p>{message.content}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="landing-spaces-section" id="spaces">
            <div className="landing-spaces-header">
              <p className="landing-section-kicker">Private shared spaces</p>
              <h2>Different relationships deserve different skies</h2>
              <p>
                Create intimate memory spaces that feel personal to the connection they hold,
                whether it is family, friendship, or love.
              </p>
            </div>

            <div className="landing-spaces-grid">
              {relationshipSpaces.map((space) => (
                <article className="landing-space-card" key={space.title}>
                  <div className="landing-space-visual">
                    <div className="landing-space-visual-core" />
                    <div className="landing-space-visual-trail" />
                    <div className="landing-space-visual-dot landing-space-visual-dot-a" />
                    <div className="landing-space-visual-dot landing-space-visual-dot-b" />
                    <div className="landing-space-visual-dot landing-space-visual-dot-c" />
                  </div>
                  <h3>{space.title}</h3>
                  <p>{space.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-final-cta" id="cta">
            <div className="landing-final-cta-card">
              <div className="landing-final-cta-layout">
                <div className="landing-final-cta-copy">
                  <p className="landing-section-kicker">Begin the archive</p>
                  <h2>Preserve the moments you know you will want back</h2>
                  <p>
                    Build a digital space where meaningful memories can stay organized, revisitable, and
                    quietly beautiful over time.
                  </p>
                  <div className="landing-hero-actions">
                    <Link className="landing-primary-cta" href={isSignedIn ? '/universe' : '/sign-up'}>
                      {isSignedIn ? 'Return To Your Universe' : 'Create Your Memory Universe'}
                    </Link>
                    {!isSignedIn ? (
                      <Link className="landing-secondary-cta" href="/sign-in">
                        I Already Have An Account
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="landing-final-cta-visual">
                  <div className="landing-final-cta-sphere" />
                  <div className="landing-final-cta-arc landing-final-cta-arc-a" />
                  <div className="landing-final-cta-arc landing-final-cta-arc-b" />
                  <div className="landing-final-cta-petal landing-final-cta-petal-a" />
                  <div className="landing-final-cta-petal landing-final-cta-petal-b" />
                  <div className="landing-final-cta-petal landing-final-cta-petal-c" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
