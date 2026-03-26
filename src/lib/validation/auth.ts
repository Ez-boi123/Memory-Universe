export interface AuthFormInput {
  email: string;
  password: string;
}

export interface RegisterFormInput extends AuthFormInput {
  displayName: string;
  confirmPassword: string;
}

export function validateAuthInput(input: AuthFormInput) {
  const errors: string[] = [];

  if (!input.email.trim()) {
    errors.push('Email is required.');
  }

  if (!input.email.includes('@')) {
    errors.push('Email must be a valid email address.');
  }

  if (!input.password.trim()) {
    errors.push('Password is required.');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

export function validateRegisterInput(input: RegisterFormInput) {
  const base = validateAuthInput(input);
  const errors = [...base.errors];

  if (!input.displayName.trim()) {
    errors.push('Display name is required.');
  }

  if (input.password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (input.password !== input.confirmPassword) {
    errors.push('Password confirmation does not match.');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
