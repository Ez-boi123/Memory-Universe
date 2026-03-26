export function validateMessageContent(content: string) {
  return {
    success: content.trim().length > 0,
    errors: content.trim().length > 0 ? [] : ['TODO: message content is required'],
  };
}
