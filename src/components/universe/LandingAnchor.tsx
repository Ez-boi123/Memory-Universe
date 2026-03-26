'use client';

import type { MouseEvent, ReactNode } from 'react';

export type LandingSectionId = 'top' | 'features' | 'messages' | 'spaces' | 'cta';

interface LandingAnchorProps {
  href: `#${LandingSectionId}`;
  className?: string;
  isActive?: boolean;
  onNavigate?: (sectionId: LandingSectionId) => void;
  sectionId?: LandingSectionId;
  children: ReactNode;
}

const SCROLL_DURATION_MS = 920;
const TOP_OFFSET_PX = 108;

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function LandingAnchor({
  href,
  className,
  isActive = false,
  onNavigate,
  sectionId,
  children,
}: LandingAnchorProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const targetId = href.slice(1) as LandingSectionId;
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      window.location.hash = href;
      return;
    }

    onNavigate?.(targetId);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      window.history.replaceState(null, '', href);
      return;
    }

    const startY = window.scrollY;
    const targetTop = targetElement.getBoundingClientRect().top + startY - TOP_OFFSET_PX;
    const boundedTargetTop = Math.max(targetTop, 0);
    const distance = boundedTargetTop - startY;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1);
      const currentTop = startY + distance * easeOutCubic(progress);

      window.scrollTo({
        top: currentTop,
        behavior: 'auto',
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
        return;
      }

      window.history.replaceState(null, '', href);
    }

    window.requestAnimationFrame(step);
  }

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={className}
      data-active={isActive ? 'true' : 'false'}
      data-section-id={sectionId}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
