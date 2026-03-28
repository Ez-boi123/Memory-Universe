import React from 'react';

interface ModulePageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  action?: React.ReactNode;
}

export function ModulePageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  action,
}: ModulePageHeaderProps) {
  return (
    <section className="module-page-header">
      <div>
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action ? <div className="module-page-action">{action}</div> : null}
      {!action && actionLabel ? <div className="module-page-action">{actionLabel}</div> : null}
    </section>
  );
}
