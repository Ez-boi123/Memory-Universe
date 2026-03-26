import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthCardProps {
  eyebrow: string;
  title: string;
  description: string;
  error?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  error,
  footer,
  children,
}: AuthCardProps) {
  return (
    <div className="page-shell auth-shell">
      <section className="page-card auth-card">
        <Link className="auth-back-link" href="/">
          Back To Entry
        </Link>
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
        {error ? <p className="auth-error">{error}</p> : null}
        {children}
        {footer ? <div className="auth-footer">{footer}</div> : null}
      </section>
    </div>
  );
}
