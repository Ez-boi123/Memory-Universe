import React from 'react';

import type { ConstellationFloatingActionViewModel } from '@/types/constellation';

interface ConstellationFloatingActionProps {
  action: ConstellationFloatingActionViewModel;
  onClick: () => void;
}

export function ConstellationFloatingAction({
  action,
  onClick,
}: ConstellationFloatingActionProps) {
  return (
    <button
      aria-label={action.ariaLabel}
      className="constellation-floating-action"
      onClick={onClick}
      type="button"
    >
      ✦
    </button>
  );
}
