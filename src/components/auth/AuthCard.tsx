import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthCardProps {
  eyebrow: string;
  title: string;
  description: string;
  mode: 'sign-in' | 'sign-up';
  error?: string;
  message?: string;
  footer?: ReactNode;
  children: ReactNode;
}

const authSceneCopy = {
  'sign-in': {
    label: 'Return To Your Orbit',
    heading: 'Step back into the universe you have already started building.',
    body: 'Memories, notes, and shared moments stay organized inside a calm private cosmos built for revisiting what matters.',
    chips: ['Private shared space', 'Timeline memories', 'Heartfelt message board'],
  },
  'sign-up': {
    label: 'Begin A New Archive',
    heading: 'Create the first layer of a memory space that can grow with your relationships.',
    body: 'Start with an account, then shape a private universe for family, partners, and friends with structure, atmosphere, and permanence.',
    chips: ['Relationship universes', 'Event chapters', 'Photo journeys'],
  },
} as const;

export function AuthCard({
  eyebrow,
  title,
  description,
  mode,
  error,
  message,
  footer,
  children,
}: AuthCardProps) {
  const scene = authSceneCopy[mode];

  return (
    <div className="auth-page">
      <div className="auth-page-background" aria-hidden="true">
        <div className="auth-page-nebula auth-page-nebula-a" />
        <div className="auth-page-nebula auth-page-nebula-b" />
        <div className="auth-page-nebula auth-page-nebula-c" />
        <div className="auth-page-stars auth-page-stars-a" />
        <div className="auth-page-stars auth-page-stars-b" />
      </div>

      <div className="auth-shell">
        <section className="auth-card">
          <Link className="auth-back-link" href="/">
            Back To Entry
          </Link>
          <div className="auth-card-intro">
            <p className="auth-showcase-label">{scene.label}</p>
            <div className="auth-chip-row">
              {scene.chips.map((chip) => (
                <span className="auth-chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <p className="page-eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
          {message ? <p className="auth-message">{message}</p> : null}
          {error ? <p className="auth-error">{error}</p> : null}
          {children}
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </section>
      </div>
    </div>
  );
}
