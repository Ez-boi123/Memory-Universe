import type { EventType } from '@/types/domain';

export interface EventDraftInput {
  title: string;
  body: string;
  memoryDate: string;
  locationText?: string;
  eventType?: EventType;
}

export function validateEventDraft(input: EventDraftInput) {
  const errors: string[] = [];

  if (!input.title) {
    errors.push('TODO: title is required');
  }

  if (!input.body) {
    errors.push('TODO: body is required');
  }

  if (!input.memoryDate) {
    errors.push('TODO: memory date is required');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
