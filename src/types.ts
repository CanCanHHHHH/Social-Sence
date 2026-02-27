
export enum ScenarioType {
  WORK = '职场交流',
  LOVE = '亲密关系',
  SMALL_TALK = '社交破冰',
  LIFE = '日常琐事',
  CUSTOM = '自定义场景'
}

export enum ToneType {
  PROFESSIONAL = '专业得体',
  HUMOROUS = '幽默风趣',
  SINCERE = '真诚恳切',
  DECISIVE = '态度坚决',
  POLITE = '委婉有礼',
  CUSTOM = '自定义语气'
}

export interface Suggestion {
  id: string;
  text: string;
  explanation: string;
  futureForecast: string; // 预测未来走向
  classicCitation: string; // 引经据典
}

export interface PolishingResult {
  suggestions: Suggestion[];
  proTip: string;
  psychologicalWellnessNote?: string; // 心理疏导反馈
  alternativeStrategy?: {
    reason: string;
    suggestion: string;
    tone: string;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  context: string;
  scenario: string;
  tone: string;
  mbti?: string;
  location?: string;
  result: PolishingResult;
  isStarred: boolean;
  selectedOptionId?: string; // 用户最终偏好的方案ID
}
