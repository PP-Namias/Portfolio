const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_LENGTH = 50;
const BLOCKED_PATTERNS = [/<script[\s>]/i, /javascript:/i, /on\w+=/i, /data:\s*text\/html/i];

export interface ChatMessage {
  message: string;
  history: Array<{ role: string; content: string }>;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  status?: number;
}

function hasBlockedPattern(input: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(input));
}

export function validateChatInput(body: Record<string, unknown> | null): ValidationResult {
  if (!body || typeof body.message !== 'string') {
    return { valid: false, error: 'Message is required.', status: 400 };
  }

  const message = body.message.trim();

  if (message.length === 0) {
    return { valid: false, error: 'Message cannot be empty.', status: 400 };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
      status: 400,
    };
  }

  if (hasBlockedPattern(message)) {
    return {
      valid: false,
      error: 'Message contains blocked content.',
      status: 400,
    };
  }

  if (body.history !== undefined) {
    if (!Array.isArray(body.history)) {
      return { valid: false, error: 'History must be an array.', status: 400 };
    }

    if (body.history.length > MAX_HISTORY_LENGTH) {
      return {
        valid: false,
        error: `History exceeds maximum length of ${MAX_HISTORY_LENGTH}.`,
        status: 400,
      };
    }

    for (const entry of body.history) {
      if (!entry || typeof entry !== 'object') {
        return { valid: false, error: 'Invalid history entry.', status: 400 };
      }

      const candidate = entry as Record<string, unknown>;
      if (typeof candidate.role !== 'string' || typeof candidate.content !== 'string') {
        return { valid: false, error: 'History entry must have role and content strings.', status: 400 };
      }

      if (hasBlockedPattern(candidate.content)) {
        return { valid: false, error: 'History contains blocked content.', status: 400 };
      }
    }
  }

  return { valid: true };
}
