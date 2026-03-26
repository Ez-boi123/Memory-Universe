import React from 'react';

interface ModulePageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
}

export function ModulePageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
}: ModulePageHeaderProps) {
  return (
    <section className="module-page-header">
      <div>
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      <div className="module-page-action">{actionLabel}</div>
    </section>
  );
}
