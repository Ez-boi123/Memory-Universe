import React from 'react';
import type { UniverseArchiveNote as UniverseArchiveNoteViewModel } from '@/types/universe';

interface UniverseArchiveNoteProps {
  note: UniverseArchiveNoteViewModel;
}

export function UniverseArchiveNote({ note }: UniverseArchiveNoteProps) {
  return (
    <aside className="universe-archive-note">
      <p className="universe-kicker">Archive Note</p>
      <h2 className="universe-archive-title">{note.title}</h2>
      <p className="universe-archive-body">{note.body}</p>
    </aside>
  );
}
