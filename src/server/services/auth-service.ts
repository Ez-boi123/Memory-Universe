import { getDatabaseConfigurationError, isDatabaseConfigured } from '@/lib/env';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { buildCandidateRelationCode } from '@/lib/auth/relation-code';
import { validateRegisterInput } from '@/lib/validation/auth';
import { authRepository } from '@/server/repositories/auth-repository';

async function generateUniqueRelationCode(displayName: string) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = buildCandidateRelationCode(displayName);
    const existingUser = await authRepository.findUserByRelationCode(candidate);

    if (!existingUser) {
      return candidate;
    }
  }

  throw new Error('Unable to generate a unique relation code.');
}

export const authService = {
  register: async ({
    email,
    displayName,
    password,
    confirmPassword,
  }: {
    email: string;
    displayName: string;
    password: string;
    confirmPassword: string;
  }) => {
    const validation = validateRegisterInput({
      email,
      displayName,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      return {
        ok: false as const,
        errors: validation.errors,
      };
    }

    if (!isDatabaseConfigured()) {
      return {
        ok: false as const,
        errors: [getDatabaseConfigurationError()],
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await authRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
      return {
        ok: false as const,
        errors: ['An account with this email already exists.'],
      };
    }

    const passwordHash = await hashPassword(password);
    const relationCode = await generateUniqueRelationCode(displayName.trim());
    const user = await authRepository.createUser({
      email: normalizedEmail,
      displayName: displayName.trim(),
      passwordHash,
      relationCode,
    });

    return {
      ok: true as const,
      user,
    };
  },
  signIn: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    if (!isDatabaseConfigured()) {
      return {
        ok: false as const,
        error: getDatabaseConfigurationError(),
      };
    }

    const user = await authRepository.findUserByEmail(email.trim().toLowerCase());

    if (!user) {
      return {
        ok: false as const,
        error: 'Invalid email or password.',
      };
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return {
        ok: false as const,
        error: 'Invalid email or password.',
      };
    }

    return {
      ok: true as const,
      user,
    };
  },
  deleteAccount: async (userId: string) => {
    if (!isDatabaseConfigured()) {
      return {
        error: getDatabaseConfigurationError(),
        ok: false as const,
      };
    }

    const user = await authRepository.findUserById(userId);

    if (!user) {
      return {
        error: 'Account could not be found.',
        ok: false as const,
      };
    }

    await authRepository.deleteUserById(userId);

    return {
      ok: true as const,
    };
  },
};
