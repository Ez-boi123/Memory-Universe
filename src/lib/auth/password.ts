import { compare, hash } from 'bcryptjs';

const PASSWORD_SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return hash(password, PASSWORD_SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}
