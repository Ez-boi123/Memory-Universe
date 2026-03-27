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
      <div className="milky-way-timeline-rail" aria-hidden="true" />
      <ol className="milky-way-timeline-list">
        {nodes.map((node) => (
          <li key={node.id} className="milky-way-timeline-item">
            <a
              className={node.isActive ? 'milky-way-timeline-link is-active' : 'milky-way-timeline-link'}
              href={`#${node.sectionId}`}
            >
              <span className="milky-way-timeline-label">{node.label}</span>
              <span className="milky-way-timeline-node" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
