const DATABASE_URL_ERROR =
  'Database is not configured. Add DATABASE_URL to .env.local before using sign in or sign up.';
const OBJECT_STORAGE_ERROR =
  'Object storage is not configured. Add the S3-compatible storage variables to .env.local before uploading images.';

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabaseConfigurationError() {
  return DATABASE_URL_ERROR;
}

export function isObjectStorageConfigured() {
  return Boolean(
    process.env.OBJECT_STORAGE_ENDPOINT &&
      process.env.OBJECT_STORAGE_REGION &&
      process.env.OBJECT_STORAGE_BUCKET &&
      process.env.OBJECT_STORAGE_ACCESS_KEY_ID &&
      process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY
  );
}

export function getObjectStorageConfigurationError() {
  return OBJECT_STORAGE_ERROR;
}
