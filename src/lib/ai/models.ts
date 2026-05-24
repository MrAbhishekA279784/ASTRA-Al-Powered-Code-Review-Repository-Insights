export const MODELS = {
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat',
  QWEN_CODER: 'qwen/qwen-2.5-coder-32b-instruct',
  GEMINI_FLASH: 'google/gemini-2.0-flash-001',
} as const;

export type ModelName = (typeof MODELS)[keyof typeof MODELS];

export const FALLBACK_CHAIN: ModelName[] = [
  MODELS.DEEPSEEK_CHAT,
  MODELS.QWEN_CODER,
  MODELS.GEMINI_FLASH,
];

export type AIRoute = 'review-pr' | 'generate-docs' | 'chat' | 'code-reasoning' | 'fix-suggestions';

export const MODEL_ROUTES: Record<AIRoute, ModelName> = {
  'review-pr': MODELS.DEEPSEEK_CHAT,
  'generate-docs': MODELS.DEEPSEEK_CHAT,
  'chat': MODELS.DEEPSEEK_CHAT,
  'code-reasoning': MODELS.QWEN_CODER,
  'fix-suggestions': MODELS.QWEN_CODER,
};
