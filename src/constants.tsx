
import React from 'react';
import { ScenarioType, ToneType } from './types';

export const SCENARIOS = [
  { id: ScenarioType.WORK, icon: <i className="fa-solid fa-laptop-code"></i>, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
  { id: ScenarioType.LOVE, icon: <i className="fa-solid fa-sparkles"></i>, color: 'text-rose-500', bg: 'bg-rose-50/50' },
  { id: ScenarioType.SMALL_TALK, icon: <i className="fa-solid fa-mug-hot"></i>, color: 'text-orange-500', bg: 'bg-orange-50/50' },
  { id: ScenarioType.LIFE, icon: <i className="fa-solid fa-leaf"></i>, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  { id: ScenarioType.CUSTOM, icon: <i className="fa-solid fa-wand-magic-sparkles"></i>, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50/50' },
];

export const TONES = [
  { id: ToneType.PROFESSIONAL, label: '专业得体', isHot: true },
  { id: 'HIGH_EQ', label: '高情商调和', isHot: true, customValue: '高情商、幽默且能缓解尴尬' },
  { id: ToneType.SINCERE, label: '真诚坦率', isHot: false },
  { id: ToneType.DECISIVE, label: '温柔而坚定', isHot: true },
  { id: 'ASSERTIVE', label: '不卑不亢', isHot: false, customValue: '态度对等，有理有据，不卑不亢' },
  { id: ToneType.POLITE, label: '谦逊有礼', isHot: false },
  { id: 'WITTY', label: '诙谐风趣', isHot: false, customValue: '幽默风趣，自带网感' },
  { id: ToneType.CUSTOM, label: '自定义...', isHot: false },
];

export const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export const LOCATIONS = [
  '中国-北方 (直爽、豪气)', 
  '中国-南方 (细腻、委婉)', 
  '中国-江浙沪 (讲求效率与得体)', 
  '中国-川渝 (幽默、安逸)', 
  '海外-北美 (直接、高效)', 
  '海外-英国 (礼貌克制、冷幽默、脱欧后独立视角)',
  '海外-欧洲 (严谨、人文、多语环境)', 
  '海外-日韩 (敬语文化、极度含蓄)'
];
