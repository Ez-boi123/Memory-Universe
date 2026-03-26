import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { validateRegisterInput } from '@/lib/validation/auth';
import { authRepository } from '@/server/repositories/auth-repository';

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

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await authRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
      return {
        ok: false as const,
        errors: ['An account with this email already exists.'],
      };
    }

    const passwordHash = await hashPassword(password);
    const user = await authRepository.createUser({
      email: normalizedEmail,
      displayName: displayName.trim(),
      passwordHash,
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
};
