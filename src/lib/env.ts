const DATABASE_URL_ERROR =
  'Database is not configured. Add DATABASE_URL to .env.local before using sign in or sign up.';

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabaseConfigurationError() {
  return DATABASE_URL_ERROR;
}
