export function validateMessageContent(content: string) {
  const normalizedContent = content.trim();

  return {
    success: normalizedContent.length > 0 && normalizedContent.length <= 220,
    errors:
      normalizedContent.length === 0
        ? ['Message content is required.']
        : normalizedContent.length > 220
          ? ['Message content must be 220 characters or fewer.']
          : [],
  };
}
