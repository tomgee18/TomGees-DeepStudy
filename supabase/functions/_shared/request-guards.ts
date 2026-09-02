const ALLOWED_MODELS = new Set([
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
  'microsoft/phi-3-mini-128k-instruct:free',
  'microsoft/phi-3-medium-128k-instruct:free',
  'google/gemma-7b-it:free',
  'meta-llama/llama-3-8b-instruct:free',
  'huggingface/zephyr-7b-beta:free',
  'openchat/openchat-7b:free',
]);

export const MAX_MESSAGE_LENGTH = 4_000;
export const MAX_TEXT_LENGTH = 50_000;

export const parseJsonBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    return await req.json();
  } catch {
    throw new Error('INVALID_JSON_BODY');
  }
};

export const ensureValidModel = (model: unknown, fallback: string): string => {
  const selectedModel = typeof model === 'string' && model.trim() ? model.trim() : fallback;

  if (!ALLOWED_MODELS.has(selectedModel)) {
    throw new Error('INVALID_MODEL');
  }

  return selectedModel;
};

export const ensureStringWithinLimit = (
  value: unknown,
  fieldName: string,
  maxLength: number,
): string => {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName.toUpperCase()}_REQUIRED`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName.toUpperCase()}_REQUIRED`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldName.toUpperCase()}_TOO_LARGE`);
  }

  return normalized;
};

export const ensureBoundedInteger = (
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number => {
  const parsed = Number.isInteger(value) ? Number(value) : fallback;
  return Math.min(max, Math.max(min, parsed));
};
