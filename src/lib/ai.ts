import OpenAI from "openai";

let defaultClient: OpenAI | null = null;

function getDefaultClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (defaultClient) return defaultClient;
  defaultClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return defaultClient;
}

function getUserClient(userKey: string): OpenAI {
  return new OpenAI({ apiKey: userKey });
}

export function getOpenAI(userKey?: string | null): OpenAI | null {
  if (userKey && userKey.startsWith("sk-")) {
    return getUserClient(userKey);
  }
  return getDefaultClient();
}

export async function aiGenerate(prompt: string, systemPrompt?: string, userKey?: string | null): Promise<string> {
  const openai = getOpenAI(userKey);
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

export async function aiGenerateJSON<T>(prompt: string, systemPrompt: string, userKey?: string | null): Promise<T | null> {
  const openai = getOpenAI(userKey);
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
