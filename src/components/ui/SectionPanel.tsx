import type { ReactNode } from 'react';

interface SectionPanelProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function SectionPanel({ title, description, children }: SectionPanelProps) {
  return (
    <section className="placeholder-panel">
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  );
}
