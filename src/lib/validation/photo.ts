export interface PhotoArchiveInput {
  memoryDate?: string;
  relatedEventId?: string;
}

export function validatePhotoArchive(input: PhotoArchiveInput) {
  return {
    success: Boolean(input.memoryDate),
    errors: input.memoryDate ? [] : ['TODO: memory date confirmation is required before archive'],
  };
}
