export type RelationshipStatus = 'pending' | 'active' | 'frozen';

export type EventType = 'anniversary' | 'travel' | 'daily' | 'festival';

export type PhotoArchiveStatus = 'pending_archive' | 'archived';

export interface UserSummary {
  id: string;
  displayName: string;
  email: string;
}

export interface SessionUserSummary {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  relationCode?: string | null;
  relationshipId?: string | null;
  relationshipStatus?: RelationshipStatus | null;
  authState?: 'placeholder' | 'authenticated';
}

export interface RelationshipSummary {
  id: string;
  status: RelationshipStatus;
  title: string;
  members: UserSummary[];
}

export interface MemoryEventSummary {
  id: string;
  title: string;
  bodyPreview: string;
  memoryDate: string;
  locationText?: string | null;
  eventType?: EventType | null;
  updatedAt: string;
  updatedBy: string;
}

export interface PhotoSummary {
  id: string;
  archiveStatus: PhotoArchiveStatus;
  displayUrl?: string | null;
  memoryDate?: string | null;
  note?: string | null;
  eventTitle?: string | null;
  thumbnailUrl?: string | null;
  uploadedAt: string;
  relatedEventId?: string | null;
  relatedEventBody?: string | null;
  relatedEventLocationText?: string | null;
  relatedEventTitle?: string | null;
}

export interface MessageSummary {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}
