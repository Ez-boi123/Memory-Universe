import React from 'react';

interface ModulePageHeaderBaseProps {
  eyebrow: string;
  title: string;
  description: string;
}

type ModulePageHeaderProps =
  | (ModulePageHeaderBaseProps & {
      actionLabel: string;
      action?: never;
    })
  | (ModulePageHeaderBaseProps & {
      action: React.ReactNode;
      actionLabel?: never;
    });

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
        <p className="module-page-eyebrow">{eyebrow}</p>
        <h1 className="module-page-title">{title}</h1>
        <p className="module-page-description">{description}</p>
      </div>
      <div className="module-page-action">{action ?? actionLabel}</div>
    </section>
  );
}
