import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (client) return client;
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export async function aiGenerate(prompt: string, systemPrompt?: string): Promise<string> {
  const openai = getOpenAI();
  if (!openai) return "";

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: prompt },
      ],
    });
    return res.choices[0]?.message?.content || "";
  } catch {
    return "";
  }
}

export async function aiGenerateJSON<T>(prompt: string, systemPrompt: string): Promise<T | null> {
  const openai = getOpenAI();
  if (!openai) return null;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });
    const text = res.choices[0]?.message?.content || "{}";
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
