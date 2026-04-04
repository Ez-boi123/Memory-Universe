import { randomBytes } from 'node:crypto';

function compact(input: string) {
  return input.replace(/[^a-z0-9]/gi, '').toUpperCase();
}

export function normalizeRelationCode(input: string) {
  return input.trim().replace(/\s+/g, '').toUpperCase();
}

export function buildCandidateRelationCode(displayName: string) {
  const prefix = compact(displayName).slice(0, 4) || 'STAR';
  const suffix = randomBytes(3).toString('hex').toUpperCase();

  return `MU-U-${prefix}${suffix}`;
}
