'use client';

import React, { useEffect, useState } from 'react';
import type { MilkyWayTimelineNode } from '@/types/milky-way';

interface MilkyWayTimelineNavProps {
  nodes: MilkyWayTimelineNode[];
}

interface SectionMetric {
  bottom: number;
  id: string;
  top: number;
}

interface ResolveActiveSectionIdOptions {
  documentHeight: number;
  scrollY: number;
  sectionMetrics: SectionMetric[];
  viewportHeight: number;
}

export function resolveActiveSectionId({
  documentHeight,
  scrollY,
  sectionMetrics,
  viewportHeight,
}: ResolveActiveSectionIdOptions) {
  if (sectionMetrics.length === 0) {
    return '';
  }

  const anchorOffset = Math.min(Math.max(viewportHeight * 0.34, 220), 320);

  if (scrollY + viewportHeight >= documentHeight - 8) {
    return sectionMetrics[sectionMetrics.length - 1].id;
  }

  const containingSection = sectionMetrics.find(
    (section) => section.top <= anchorOffset && section.bottom > anchorOffset,
  );

  if (containingSection) {
    return containingSection.id;
  }

  return [...sectionMetrics]
    .sort(
      (left, right) =>
        Math.abs(left.top - anchorOffset) - Math.abs(right.top - anchorOffset),
    )[0]?.id ?? sectionMetrics[0].id;
}

export function MilkyWayTimelineNav({ nodes }: MilkyWayTimelineNavProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    nodes.find((node) => node.isActive)?.sectionId ?? nodes[0]?.sectionId ?? '',
  );

  useEffect(() => {
    setActiveSectionId(nodes.find((node) => node.isActive)?.sectionId ?? nodes[0]?.sectionId ?? '');
  }, [nodes]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const sectionElements = nodes
      .map((node) => document.getElementById(node.sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      const nextSectionId = resolveActiveSectionId({
        documentHeight: document.documentElement.scrollHeight,
        scrollY: window.scrollY,
        sectionMetrics: sectionElements.map((element) => ({
          bottom: element.getBoundingClientRect().bottom,
          id: element.id,
          top: element.getBoundingClientRect().top,
        })),
        viewportHeight: window.innerHeight,
      });

      if (nextSectionId) {
        setActiveSectionId(nextSectionId);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [nodes]);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <nav className="milky-way-timeline-nav" aria-label="Milky Way months">
      <div className="milky-way-timeline-rail" aria-hidden="true" />
      <ol className="milky-way-timeline-list">
        {nodes.map((node) => {
          const isCurrent = node.sectionId === activeSectionId;

          return (
            <li key={node.id} className="milky-way-timeline-item">
              <a
                aria-current={isCurrent ? 'true' : undefined}
                className={isCurrent ? 'milky-way-timeline-link is-active is-current' : 'milky-way-timeline-link'}
                href={`#${node.sectionId}`}
                onClick={() => setActiveSectionId(node.sectionId)}
              >
                <span className="milky-way-timeline-label">{node.label}</span>
                <span className="milky-way-timeline-node" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
