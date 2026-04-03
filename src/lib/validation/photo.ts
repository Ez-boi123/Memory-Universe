export interface PhotoArchiveInput {
  memoryDate?: string;
  relatedEventId?: string;
}

export interface PhotoUploadInput {
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export function validatePhotoArchive(input: PhotoArchiveInput) {
  return {
    success: Boolean(input.memoryDate),
    errors: input.memoryDate ? [] : ['TODO: memory date confirmation is required before archive'],
  };
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function validatePhotoUpload(input: PhotoUploadInput) {
  const errors: string[] = [];

  if (!input.fileName.trim()) {
    errors.push('Photo filename is required.');
  }

  if (!input.mimeType.startsWith('image/')) {
    errors.push('Only image uploads are supported.');
  }

  if (input.fileSize <= 0) {
    errors.push('Uploaded images must not be empty.');
  }

  if (input.fileSize > MAX_UPLOAD_BYTES) {
    errors.push('Uploaded images must be 10MB or smaller.');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
