import type { RelationshipStatus } from '@/types/domain';

export function canReadRelationship(status: RelationshipStatus): boolean {
  return ['pending', 'active', 'frozen'].includes(status);
}

export function canWriteRelationship(status: RelationshipStatus): boolean {
  return status !== 'frozen';
}

export function describePermissionGuard(): string {
  return 'TODO: centralize relationship membership and frozen-state permission checks.';
}
