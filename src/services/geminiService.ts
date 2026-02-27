
import { GoogleGenAI, Type } from "@google/genai";
import { PolishingResult, ScenarioType, ToneType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function polishLanguage(
  context: string,
  scenario: string,
  tone: string,
  goal?: string,
  mbti?: string,
  location?: string
): Promise<PolishingResult> {
  const prompt = `
    作为一名全球顶尖的心理学专家、跨文化人际交往大师，请帮我润色社交对话。
    
    【核心原则】
    - 严禁提供任何偏激、报复性、侮辱性或可能导致局势恶化的建议。
    - 如果用户输入的上下文包含极端的负面情绪、暴力倾向或心理危机，请先提供专业的心理疏导和正向反馈。
    - 每一个建议都必须建立在共赢和长远关系的考量之上。

    【基本信息】
    - 用户所在地: ${location || '未指定'}
    - 用户MBTI: ${mbti || '未指定'}
    - 场景: ${scenario}
    - 期望语气: ${tone}
    - 目标: ${goal || '达成高效得体的沟通'}
    - 对话内容: ${context}

    【任务要求】
    1. 提供三个回复方案。每个方案需包含：
       - text: 回复原话。
       - explanation: 心理学逻辑。
       - futureForecast: 预测该回复发出后，对方可能的反应及事情的后续走向（需专业客观）。
       - classicCitation: 引经据典。结合中外名言、哲学、心理学名著或经典理论（如《孙子兵法》、《非暴力沟通》、阿德勒心理学、斯多葛学派等）来论证该方案的合理性。
    2. proTip: 针对该情景的大师级行为建议。
    3. psychologicalWellnessNote: 若检测到用户压力过大或情绪不稳定，请在此给出温暖的心理疏导，鼓励其关注心理健康。

    请严格按JSON格式返回。
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                explanation: { type: Type.STRING },
                futureForecast: { type: Type.STRING },
                classicCitation: { type: Type.STRING }
              },
              required: ["id", "text", "explanation", "futureForecast", "classicCitation"]
            }
          },
          proTip: { type: Type.STRING },
          psychologicalWellnessNote: { type: Type.STRING },
          alternativeStrategy: {
            type: Type.OBJECT,
            properties: {
              reason: { type: Type.STRING },
              suggestion: { type: Type.STRING },
              tone: { type: Type.STRING }
            }
          }
        },
        required: ["suggestions", "proTip"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("生成失败，请稍后重试");
  }
}
