import { describe, expect, it } from 'vitest';

import { normalizeRelationCode } from './relation-code';

describe('normalizeRelationCode', () => {
  it('preserves separators used by stored relation codes while trimming pasted input', () => {
    expect(normalizeRelationCode('  mu-u-haof7fd894  ')).toBe('MU-U-HAOF7FD894');
  });
});
