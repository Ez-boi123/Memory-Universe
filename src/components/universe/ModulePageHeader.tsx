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
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      <div className="module-page-action">{action ?? actionLabel}</div>
    </section>
  );
}
