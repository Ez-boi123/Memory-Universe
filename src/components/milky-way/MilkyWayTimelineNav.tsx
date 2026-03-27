import React from 'react';
import type { MilkyWayTimelineNode } from '@/types/milky-way';

interface MilkyWayTimelineNavProps {
  nodes: MilkyWayTimelineNode[];
}

export function MilkyWayTimelineNav({ nodes }: MilkyWayTimelineNavProps) {
  if (nodes.length === 0) {
    return null;
  }

  return (
    <nav className="milky-way-timeline-nav" aria-label="Milky Way months">
      <ol className="milky-way-timeline-list">
        {nodes.map((node) => (
          <li key={node.id}>
            <a
              className={node.isActive ? 'milky-way-timeline-link is-active' : 'milky-way-timeline-link'}
              href={`#${node.sectionId}`}
            >
              {node.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
